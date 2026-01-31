"""
Main Pipeline Orchestrator.

Runs the full daily content generation pipeline:
1. Collect news and Twitter content
2. Rank topics
3. Generate LinkedIn + Twitter posts
4. Optionally publish approved posts

Can be run as a daily cron job or invoked manually.
"""

import json
import sys
from datetime import datetime

from ai_content_machine.utils.database import (
    init_db, get_topics_for_date, get_posts_for_topic, get_connection,
)
from ai_content_machine.utils.logger import setup_logger
from ai_content_machine.collectors.news_collector import collect_all_news
from ai_content_machine.collectors.twitter_collector import collect_all_twitter
from ai_content_machine.ranking.topic_ranker import rank_topics, save_daily_topics
from ai_content_machine.generator.content_generator import generate_content_for_topic
from ai_content_machine.publisher.notifier import (
    notify_pipeline_complete, notify_publish_success, notify_publish_failure,
)

logger = setup_logger("pipeline")


def run_collection() -> dict:
    """Phase 1: Collect data from all sources."""
    logger.info("=" * 60)
    logger.info("PHASE 1: DATA COLLECTION")
    logger.info("=" * 60)

    results = {"news": {}, "twitter": {}}

    try:
        results["news"] = collect_all_news()
    except Exception as e:
        logger.error(f"News collection failed: {e}")
        results["news"] = {"error": str(e)}

    try:
        results["twitter"] = collect_all_twitter()
    except Exception as e:
        logger.error(f"Twitter collection failed: {e}")
        results["twitter"] = {"error": str(e)}

    total_news = sum(v for v in results["news"].values() if isinstance(v, int))
    total_tweets = sum(v for v in results["twitter"].values() if isinstance(v, int))
    logger.info(f"Collection complete: {total_news} news articles, {total_tweets} tweets")

    return results


def run_ranking() -> list[dict]:
    """Phase 2: Rank topics and save top 3."""
    logger.info("=" * 60)
    logger.info("PHASE 2: TOPIC RANKING")
    logger.info("=" * 60)

    topics = rank_topics(hours=24, top_n=3)
    if not topics:
        logger.warning("No topics ranked — not enough source data")
        return []

    today = datetime.utcnow().strftime("%Y-%m-%d")
    topic_ids = save_daily_topics(topics, date=today)

    # Attach IDs back to topic dicts
    for topic, tid in zip(topics, topic_ids):
        topic["id"] = tid

    return topics


def run_generation(topics: list[dict]) -> list[dict]:
    """Phase 3: Generate content for the #1 ranked topic."""
    logger.info("=" * 60)
    logger.info("PHASE 3: CONTENT GENERATION")
    logger.info("=" * 60)

    if not topics:
        logger.warning("No topics to generate content for")
        return []

    # Generate for the top-ranked topic
    primary_topic = topics[0]
    logger.info(f"Generating content for: {primary_topic['title'][:60]}")

    try:
        result = generate_content_for_topic(primary_topic)
        logger.info("Content generated successfully")
        logger.info(f"  LinkedIn post: {len(result.get('linkedin_post', '').split())} words")
        logger.info(f"  Twitter thread: {len(result.get('twitter_thread', []))} tweets")
        return [result]
    except Exception as e:
        logger.error(f"Content generation failed: {e}")
        return []


def run_publishing(date: str = None) -> dict:
    """Phase 5: Publish approved posts."""
    logger.info("=" * 60)
    logger.info("PHASE 5: PUBLISHING")
    logger.info("=" * 60)

    if date is None:
        date = datetime.utcnow().strftime("%Y-%m-%d")

    topics = get_topics_for_date(date)
    results = {"linkedin": None, "twitter": None}

    for topic in topics:
        posts = get_posts_for_topic(topic["id"])
        for post in posts:
            if post["status"] != "approved":
                continue

            if post["platform"] == "linkedin":
                try:
                    from ai_content_machine.publisher.linkedin_publisher import publish_post
                    result = publish_post(post["id"], post["content"])
                    results["linkedin"] = result
                    if result["success"]:
                        notify_publish_success(
                            "linkedin", topic["title"], result.get("post_urn", "")
                        )
                    else:
                        notify_publish_failure(
                            "linkedin", topic["title"], result.get("error", "")
                        )
                except Exception as e:
                    logger.error(f"LinkedIn publishing error: {e}")
                    results["linkedin"] = {"success": False, "error": str(e)}

            elif post["platform"] == "twitter":
                try:
                    from ai_content_machine.publisher.twitter_publisher import publish_thread
                    tweets = json.loads(post["content"])
                    result = publish_thread(post["id"], tweets)
                    results["twitter"] = result
                    if result["success"]:
                        notify_publish_success(
                            "twitter", topic["title"],
                            result.get("tweet_ids", [""])[0]
                        )
                    else:
                        notify_publish_failure(
                            "twitter", topic["title"], result.get("error", "")
                        )
                except Exception as e:
                    logger.error(f"Twitter publishing error: {e}")
                    results["twitter"] = {"success": False, "error": str(e)}

    return results


def run_full_pipeline(skip_publish: bool = True) -> dict:
    """
    Run the full daily pipeline.

    Args:
        skip_publish: If True, stop after generation (default).
                      Posts need manual approval via dashboard before publishing.

    Returns:
        Summary dict with results from each phase.
    """
    logger.info("*" * 60)
    logger.info("STARTING DAILY PIPELINE")
    logger.info(f"Time: {datetime.utcnow().isoformat()}")
    logger.info("*" * 60)

    init_db()

    summary = {}

    # Phase 1: Collection
    summary["collection"] = run_collection()

    # Phase 2: Ranking
    topics = run_ranking()
    summary["topics_ranked"] = len(topics)
    summary["top_topic"] = topics[0]["title"] if topics else "N/A"

    # Phase 3: Generation
    if topics:
        gen_results = run_generation(topics)
        summary["content_generated"] = len(gen_results) > 0
    else:
        summary["content_generated"] = False

    # Phase 5: Publishing (only if explicitly enabled)
    if not skip_publish:
        summary["publishing"] = run_publishing()
    else:
        summary["publishing"] = "Skipped (approve via dashboard first)"

    # Notify
    notify_pipeline_complete(summary)

    logger.info("*" * 60)
    logger.info("PIPELINE COMPLETE")
    logger.info(f"Summary: {json.dumps(summary, indent=2, default=str)}")
    logger.info("*" * 60)

    return summary
