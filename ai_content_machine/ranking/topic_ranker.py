"""
Topic Ranking Engine.

Scores and ranks collected stories to identify the top 3 daily topics.
Scoring factors: recency, engagement, business relevance, novelty,
Twitter signal strength, and multi-source signal.
"""

import json
import re
from datetime import datetime, timedelta
from collections import defaultdict

from ai_content_machine.utils.database import (
    get_sources_since, get_previous_topic_titles, insert_topic,
)
from ai_content_machine.utils.logger import setup_logger
from config.settings import RANKING_WEIGHTS

logger = setup_logger("ranking")

# ─── Business Relevance Keywords ──────────────────────────────────────────────

BUSINESS_KEYWORDS = {
    "high": [
        "funding", "raised", "series", "valuation", "acquisition", "acquired",
        "launch", "launched", "announces", "partnership", "IPO", "revenue",
        "enterprise", "startup", "founder", "CEO", "billion", "million",
        "GTM", "go-to-market", "product", "customers", "ARR", "growth",
        "market", "strategic", "invest", "deal", "pivot",
    ],
    "medium": [
        "release", "update", "API", "platform", "tool", "feature",
        "developer", "open source", "model", "benchmark", "deploy",
        "scale", "integration", "use case", "industry",
    ],
    "low": [
        "paper", "research", "study", "theory", "algorithm", "dataset",
        "arxiv", "preprint", "conference",
    ],
}

# ─── Scoring Functions ────────────────────────────────────────────────────────

def _score_recency(published_at: str) -> float:
    """Score based on how recent the source is. 1.0 = within 6 hours."""
    if not published_at:
        return 0.3  # Unknown age gets a low default

    try:
        pub_dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return 0.3

    now = datetime.utcnow()
    # Make pub_dt naive if it's aware
    if pub_dt.tzinfo:
        pub_dt = pub_dt.replace(tzinfo=None)

    hours_old = (now - pub_dt).total_seconds() / 3600

    if hours_old <= 6:
        return 1.0
    elif hours_old <= 12:
        return 0.8
    elif hours_old <= 24:
        return 0.6
    elif hours_old <= 48:
        return 0.3
    else:
        return 0.1


def _score_engagement(likes: int, shares: int, comments: int) -> float:
    """Score based on engagement metrics. Normalized to 0-1."""
    total = likes + (shares * 2) + (comments * 1.5)

    if total >= 10000:
        return 1.0
    elif total >= 5000:
        return 0.85
    elif total >= 2000:
        return 0.7
    elif total >= 1000:
        return 0.55
    elif total >= 500:
        return 0.4
    elif total >= 100:
        return 0.25
    else:
        return 0.1


def _score_business_relevance(title: str, summary: str) -> float:
    """Score based on business relevance of the content."""
    text = f"{title} {summary}".lower()

    high_count = sum(1 for kw in BUSINESS_KEYWORDS["high"] if kw.lower() in text)
    medium_count = sum(1 for kw in BUSINESS_KEYWORDS["medium"] if kw.lower() in text)
    low_count = sum(1 for kw in BUSINESS_KEYWORDS["low"] if kw.lower() in text)

    score = min(1.0, (high_count * 0.25) + (medium_count * 0.1) + (low_count * 0.02))

    # Penalty for pure research without business angle
    if low_count > 0 and high_count == 0 and medium_count == 0:
        score *= 0.3

    return max(0.05, score)


def _score_novelty(title: str, previous_titles: list[str]) -> float:
    """Score based on how different this topic is from previous posts."""
    if not previous_titles:
        return 1.0

    title_lower = title.lower()
    title_words = set(re.findall(r'\b\w{4,}\b', title_lower))

    max_overlap = 0.0
    for prev in previous_titles:
        prev_words = set(re.findall(r'\b\w{4,}\b', prev.lower()))
        if not title_words or not prev_words:
            continue
        overlap = len(title_words & prev_words) / max(len(title_words), 1)
        max_overlap = max(max_overlap, overlap)

    # Higher novelty score when there's less overlap
    return max(0.1, 1.0 - max_overlap)


def _score_twitter_signal(source: dict) -> float:
    """Give higher weight to Twitter sources (real-time signal)."""
    if source.get("source_type") == "twitter":
        return 1.0
    return 0.3


# ─── Topic Clustering ─────────────────────────────────────────────────────────

def _cluster_sources(sources: list[dict]) -> list[dict]:
    """
    Group related sources into topic clusters.
    Uses simple keyword overlap to detect when multiple sources cover the same story.
    """
    clusters = []

    for source in sources:
        title = (source.get("title") or "").lower()
        summary = (source.get("summary") or "").lower()
        text = f"{title} {summary}"
        words = set(re.findall(r'\b\w{4,}\b', text))

        # Try to match to existing cluster
        matched = False
        for cluster in clusters:
            cluster_words = cluster["keywords"]
            if not words or not cluster_words:
                continue
            overlap = len(words & cluster_words) / max(len(words), 1)
            if overlap >= 0.3:  # 30% word overlap threshold
                cluster["sources"].append(source)
                cluster["keywords"] |= words
                matched = True
                break

        if not matched:
            clusters.append({
                "sources": [source],
                "keywords": words,
            })

    return clusters


# ─── Main Ranking Logic ──────────────────────────────────────────────────────

def rank_topics(hours: int = 24, top_n: int = 3) -> list[dict]:
    """
    Score and rank all collected sources into topics.
    Returns the top N topics with scores and source references.
    """
    logger.info(f"Ranking topics from last {hours} hours")

    sources = get_sources_since(hours=hours)
    if not sources:
        logger.warning("No sources found for ranking")
        return []

    previous_titles = get_previous_topic_titles(days=30)

    # Cluster related sources
    clusters = _cluster_sources(sources)
    logger.info(f"Found {len(clusters)} topic clusters from {len(sources)} sources")

    # Score each cluster
    scored_topics = []
    for cluster in clusters:
        cluster_sources = cluster["sources"]

        # Use the highest-engagement source as the representative
        best_source = max(
            cluster_sources,
            key=lambda s: s.get("engagement_likes", 0) + s.get("engagement_shares", 0)
        )

        title = best_source.get("title", "Unknown Topic")
        summary = best_source.get("summary", "")

        # Calculate individual scores
        recency_scores = [_score_recency(s.get("published_at", "")) for s in cluster_sources]
        recency = max(recency_scores) if recency_scores else 0.3

        engagement = max(
            _score_engagement(
                s.get("engagement_likes", 0),
                s.get("engagement_shares", 0),
                s.get("engagement_comments", 0),
            )
            for s in cluster_sources
        )

        business = _score_business_relevance(title, summary)
        novelty = _score_novelty(title, previous_titles)
        twitter_signal = max(_score_twitter_signal(s) for s in cluster_sources)

        # Multi-source signal: bonus for stories covered by multiple sources
        source_count = len(cluster_sources)
        multi_source = min(1.0, source_count / 3)  # 3+ sources = max score

        # Weighted total
        w = RANKING_WEIGHTS
        total_score = (
            w["recency"] * recency +
            w["engagement"] * engagement +
            w["business_relevance"] * business +
            w["novelty"] * novelty +
            w["twitter_signal"] * twitter_signal +
            w["multi_source"] * multi_source
        )

        score_breakdown = {
            "recency": round(recency, 3),
            "engagement": round(engagement, 3),
            "business_relevance": round(business, 3),
            "novelty": round(novelty, 3),
            "twitter_signal": round(twitter_signal, 3),
            "multi_source": round(multi_source, 3),
            "total": round(total_score, 3),
        }

        scored_topics.append({
            "title": title,
            "summary": summary,
            "sources": cluster_sources,
            "source_ids": [s["id"] for s in cluster_sources],
            "score": total_score,
            "score_breakdown": score_breakdown,
        })

    # Sort by score and take top N
    scored_topics.sort(key=lambda t: t["score"], reverse=True)
    top_topics = scored_topics[:top_n]

    logger.info(f"Top {len(top_topics)} topics ranked:")
    for i, topic in enumerate(top_topics, 1):
        logger.info(f"  #{i}: {topic['title'][:80]} (score: {topic['score']:.3f})")

    return top_topics


def save_daily_topics(topics: list[dict], date: str = None) -> list[int]:
    """Save ranked topics to the database. Returns list of topic IDs."""
    if date is None:
        date = datetime.utcnow().strftime("%Y-%m-%d")

    topic_ids = []
    for rank, topic in enumerate(topics, 1):
        topic_id = insert_topic(
            date=date,
            rank=rank,
            title=topic["title"],
            summary=topic["summary"],
            source_ids=topic["source_ids"],
            score=topic["score"],
            score_breakdown=topic["score_breakdown"],
        )
        topic_ids.append(topic_id)
        logger.info(f"Saved topic #{rank}: {topic['title'][:60]} (ID: {topic_id})")

    return topic_ids


if __name__ == "__main__":
    topics = rank_topics()
    if topics:
        ids = save_daily_topics(topics)
        print(f"Saved {len(ids)} topics: {ids}")
    else:
        print("No topics to rank")
