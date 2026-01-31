"""
News collector for AI content from RSS feeds and APIs.
Sources: TechCrunch AI, VentureBeat AI, HackerNews, Product Hunt.
"""

import time
import json
import requests
import feedparser
from datetime import datetime, timedelta

from ai_content_machine.utils.database import insert_source
from ai_content_machine.utils.logger import setup_logger
from config.settings import NEWS_SOURCES

logger = setup_logger("collectors.news")

# ─── RSS Feed Collector ───────────────────────────────────────────────────────

def collect_rss_feed(source_name: str, feed_url: str,
                     ai_keywords: list[str] = None) -> int:
    """
    Collect articles from an RSS feed.
    If ai_keywords is provided, only keep entries matching at least one keyword.
    Returns the number of new articles inserted.
    """
    logger.info(f"Collecting RSS feed: {source_name} from {feed_url}")
    try:
        feed = feedparser.parse(feed_url)
    except Exception as e:
        logger.error(f"Failed to parse RSS feed {source_name}: {e}")
        return 0

    if feed.bozo and not feed.entries:
        logger.warning(f"RSS feed {source_name} returned no entries (bozo={feed.bozo})")
        return 0

    count = 0
    for entry in feed.entries:
        title = entry.get("title", "").strip()
        summary = entry.get("summary", entry.get("description", "")).strip()
        link = entry.get("link", "")
        author = entry.get("author", "")
        published = entry.get("published", entry.get("updated", ""))

        # Filter by AI keywords if provided
        if ai_keywords:
            text = f"{title} {summary}".lower()
            if not any(kw.lower() in text for kw in ai_keywords):
                continue

        # Parse published date
        published_at = ""
        if published:
            try:
                ts = entry.get("published_parsed") or entry.get("updated_parsed")
                if ts:
                    published_at = datetime(*ts[:6]).isoformat()
            except Exception:
                published_at = published

        result = insert_source(
            source_type="news",
            source_name=source_name,
            title=title,
            summary=summary[:1000] if summary else "",
            url=link,
            author=author,
            published_at=published_at,
        )
        if result is not None:
            count += 1

    logger.info(f"Collected {count} new articles from {source_name}")
    return count


# ─── HackerNews API Collector ─────────────────────────────────────────────────

def collect_hackernews(max_stories: int = 60) -> int:
    """
    Collect AI-related stories from HackerNews front page via Firebase API.
    Returns the number of new articles inserted.
    """
    logger.info("Collecting HackerNews front page stories")
    hn_config = NEWS_SOURCES.get("hackernews", {})
    base_url = hn_config.get("url", "https://hacker-news.firebaseio.com/v0/")
    ai_keywords = hn_config.get("ai_keywords", [])

    try:
        resp = requests.get(f"{base_url}topstories.json", timeout=15)
        resp.raise_for_status()
        story_ids = resp.json()[:max_stories]
    except Exception as e:
        logger.error(f"Failed to fetch HackerNews top stories: {e}")
        return 0

    count = 0
    for story_id in story_ids:
        try:
            item_resp = requests.get(
                f"{base_url}item/{story_id}.json", timeout=10
            )
            item_resp.raise_for_status()
            item = item_resp.json()
        except Exception:
            continue

        if not item or item.get("type") != "story":
            continue

        title = item.get("title", "")
        url = item.get("url", f"https://news.ycombinator.com/item?id={story_id}")
        score = item.get("score", 0)
        comments = item.get("descendants", 0)
        author = item.get("by", "")
        created = item.get("time", 0)

        # Filter for AI-related content
        if ai_keywords:
            text = title.lower()
            if not any(kw.lower() in text for kw in ai_keywords):
                continue

        published_at = ""
        if created:
            published_at = datetime.utcfromtimestamp(created).isoformat()

        result = insert_source(
            source_type="news",
            source_name="hackernews",
            title=title,
            summary=f"HN Score: {score}, Comments: {comments}",
            url=url,
            author=author,
            engagement_likes=score,
            engagement_comments=comments,
            extra_data={"hn_id": story_id},
            published_at=published_at,
        )
        if result is not None:
            count += 1

        # Be polite to the API
        time.sleep(0.1)

    logger.info(f"Collected {count} new AI stories from HackerNews")
    return count


# ─── Main Collection Entrypoint ───────────────────────────────────────────────

def collect_all_news() -> dict[str, int]:
    """Run all news collectors. Returns a dict of source_name -> new_article_count."""
    results = {}

    # RSS feeds
    for name, config in NEWS_SOURCES.items():
        if config["type"] == "rss":
            count = collect_rss_feed(
                source_name=name,
                feed_url=config["url"],
                ai_keywords=config.get("ai_keywords"),
            )
            results[name] = count

    # HackerNews API
    results["hackernews"] = collect_hackernews()

    total = sum(results.values())
    logger.info(f"Total new articles collected: {total}")
    return results


if __name__ == "__main__":
    from ai_content_machine.utils.database import init_db
    init_db()
    results = collect_all_news()
    print(f"Collection results: {results}")
