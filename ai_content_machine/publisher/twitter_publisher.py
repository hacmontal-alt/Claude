"""
Twitter/X Publishing Module.

Publishes approved threads to Twitter using the Twitter API v2 via tweepy.
Handles thread structure (reply chains), scheduling, and analytics.
"""

import json
import time
from datetime import datetime

from ai_content_machine.utils.database import update_post
from ai_content_machine.utils.logger import setup_logger
from config.settings import (
    TWITTER_API_KEY, TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET,
)

logger = setup_logger("publisher.twitter")


def _has_credentials() -> bool:
    """Check if Twitter API credentials are configured."""
    return all([
        TWITTER_API_KEY, TWITTER_API_SECRET,
        TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET,
    ])


def _get_client():
    """Create a tweepy Client for Twitter API v2."""
    import tweepy
    return tweepy.Client(
        consumer_key=TWITTER_API_KEY,
        consumer_secret=TWITTER_API_SECRET,
        access_token=TWITTER_ACCESS_TOKEN,
        access_token_secret=TWITTER_ACCESS_SECRET,
    )


def publish_thread(post_id: int, tweets: list[str]) -> dict:
    """
    Publish a thread (sequence of tweets) to Twitter.

    Each tweet is posted as a reply to the previous one, forming a thread.

    Args:
        post_id: Database post ID for tracking
        tweets: List of tweet strings

    Returns:
        dict with 'success', 'tweet_ids', and optional 'error'
    """
    if not _has_credentials():
        return {"success": False, "error": "Twitter API credentials not configured"}

    if not tweets:
        return {"success": False, "error": "No tweets to publish"}

    try:
        client = _get_client()
    except ImportError:
        return {"success": False, "error": "tweepy library not installed"}

    tweet_ids = []
    reply_to_id = None

    for i, tweet_text in enumerate(tweets):
        try:
            if reply_to_id:
                response = client.create_tweet(
                    text=tweet_text,
                    in_reply_to_tweet_id=reply_to_id,
                )
            else:
                response = client.create_tweet(text=tweet_text)

            tweet_id = response.data["id"]
            tweet_ids.append(str(tweet_id))
            reply_to_id = tweet_id

            logger.info(f"Published tweet {i+1}/{len(tweets)}: {tweet_id}")

            # Small delay between tweets to avoid rate limiting
            if i < len(tweets) - 1:
                time.sleep(1)

        except Exception as e:
            logger.error(f"Failed to publish tweet {i+1}: {e}")
            # If first tweet fails, abort entirely
            if i == 0:
                return {
                    "success": False,
                    "error": f"Failed to publish first tweet: {e}",
                }
            # If a later tweet fails, we have a partial thread
            break

    # Update database
    first_tweet_id = tweet_ids[0] if tweet_ids else ""
    update_post(
        post_id,
        status="published",
        published_at=datetime.utcnow().isoformat(),
        publish_id=first_tweet_id,
        analytics=json.dumps({"tweet_ids": tweet_ids}),
    )

    success = len(tweet_ids) == len(tweets)
    logger.info(
        f"Twitter thread published: {len(tweet_ids)}/{len(tweets)} tweets"
        f" (first: {first_tweet_id})"
    )

    return {
        "success": success,
        "tweet_ids": tweet_ids,
        "partial": not success and len(tweet_ids) > 0,
    }


def get_tweet_metrics(tweet_id: str) -> dict:
    """Fetch engagement metrics for a published tweet."""
    if not _has_credentials() or not tweet_id:
        return {}

    try:
        client = _get_client()
        tweet = client.get_tweet(
            tweet_id,
            tweet_fields=["public_metrics"],
        )
        if tweet and tweet.data:
            return dict(tweet.data.public_metrics or {})
    except Exception as e:
        logger.error(f"Failed to fetch tweet metrics: {e}")

    return {}
