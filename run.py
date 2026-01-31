#!/usr/bin/env python3
"""
AI Content Machine — CLI Entry Point.

Usage:
    python run.py pipeline          Run full daily pipeline (collect → rank → generate)
    python run.py collect           Run data collection only
    python run.py rank              Run topic ranking only
    python run.py generate          Generate content for today's top topic
    python run.py publish           Publish approved posts
    python run.py dashboard         Start the review dashboard
    python run.py init              Initialize the database
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_content_machine.utils.database import init_db
from ai_content_machine.utils.logger import setup_logger

logger = setup_logger()


def cmd_pipeline():
    """Run the full daily pipeline."""
    from ai_content_machine.pipeline import run_full_pipeline
    results = run_full_pipeline(skip_publish=True)
    print(f"\nPipeline complete. Review posts at http://127.0.0.1:5000")
    return results


def cmd_collect():
    """Run data collection only."""
    init_db()
    from ai_content_machine.collectors.news_collector import collect_all_news
    from ai_content_machine.collectors.twitter_collector import collect_all_twitter

    print("Collecting news...")
    news = collect_all_news()
    print(f"News: {news}")

    print("\nCollecting tweets...")
    tweets = collect_all_twitter()
    print(f"Twitter: {tweets}")


def cmd_rank():
    """Run topic ranking."""
    init_db()
    from ai_content_machine.ranking.topic_ranker import rank_topics, save_daily_topics

    topics = rank_topics()
    if topics:
        ids = save_daily_topics(topics)
        print(f"\nTop {len(topics)} topics:")
        for i, t in enumerate(topics):
            print(f"  #{i+1}: {t['title'][:80]} (score: {t['score']:.3f})")
    else:
        print("No topics to rank. Run collection first.")


def cmd_generate():
    """Generate content for today's top topic."""
    init_db()
    from datetime import datetime
    from ai_content_machine.utils.database import get_topics_for_date
    from ai_content_machine.generator.content_generator import generate_content_for_topic

    today = datetime.utcnow().strftime("%Y-%m-%d")
    topics = get_topics_for_date(today)

    if not topics:
        print("No topics found for today. Run collection and ranking first.")
        return

    topic = dict(topics[0])
    import json
    source_ids = json.loads(topic.get("source_ids", "[]"))

    # Fetch source details
    from ai_content_machine.utils.database import get_connection
    conn = get_connection()
    sources = []
    if source_ids:
        placeholders = ",".join("?" * len(source_ids))
        rows = conn.execute(
            f"SELECT * FROM sources WHERE id IN ({placeholders})", source_ids
        ).fetchall()
        sources = [dict(r) for r in rows]
    conn.close()

    topic["sources"] = sources
    result = generate_content_for_topic(topic)

    print("\n=== LINKEDIN POST ===")
    print(result["linkedin_post"])
    print(f"\n=== TWITTER THREAD ({len(result['twitter_thread'])} tweets) ===")
    for i, tweet in enumerate(result["twitter_thread"], 1):
        print(f"\nTweet {i} ({len(tweet)} chars):")
        print(tweet)


def cmd_publish():
    """Publish approved posts."""
    init_db()
    from ai_content_machine.pipeline import run_publishing
    results = run_publishing()
    print(f"Publishing results: {results}")


def cmd_dashboard():
    """Start the review dashboard."""
    init_db()
    from ai_content_machine.dashboard.app import run_dashboard
    run_dashboard()


def cmd_init():
    """Initialize the database."""
    init_db()
    print("Database initialized successfully.")


COMMANDS = {
    "pipeline": cmd_pipeline,
    "collect": cmd_collect,
    "rank": cmd_rank,
    "generate": cmd_generate,
    "publish": cmd_publish,
    "dashboard": cmd_dashboard,
    "init": cmd_init,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print(__doc__)
        print(f"Available commands: {', '.join(COMMANDS.keys())}")
        sys.exit(1)

    command = sys.argv[1]
    print(f"Running: {command}")
    COMMANDS[command]()


if __name__ == "__main__":
    main()
