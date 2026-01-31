"""
Twitter/X content collector using hybrid approach:
1. Primary: Nitter instance scraping (no API costs)
2. Fallback: Official Twitter API v2 via tweepy (if keys configured)
"""

import re
import json
import time
import requests
from datetime import datetime
from bs4 import BeautifulSoup

from ai_content_machine.utils.database import insert_source
from ai_content_machine.utils.logger import setup_logger
from config.settings import (
    ALL_TWITTER_ACCOUNTS, NITTER_INSTANCES,
    TWITTER_API_KEY, TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET,
)

logger = setup_logger("collectors.twitter")

MIN_LIKES_THRESHOLD = 1000  # Only collect tweets with 1k+ likes


# ─── Nitter Scraping (Primary) ────────────────────────────────────────────────

def _find_working_nitter() -> str | None:
    """Find a working Nitter instance."""
    for instance in NITTER_INSTANCES:
        try:
            resp = requests.get(instance, timeout=10)
            if resp.status_code == 200:
                logger.info(f"Using Nitter instance: {instance}")
                return instance
        except Exception:
            continue
    logger.warning("No working Nitter instances found")
    return None


def _parse_engagement(text: str) -> int:
    """Parse engagement numbers like '1.2K', '45', '3.5M'."""
    if not text:
        return 0
    text = text.strip().replace(",", "")
    multipliers = {"K": 1_000, "M": 1_000_000}
    for suffix, mult in multipliers.items():
        if text.upper().endswith(suffix):
            try:
                return int(float(text[:-1]) * mult)
            except ValueError:
                return 0
    try:
        return int(text)
    except ValueError:
        return 0


def scrape_nitter_account(nitter_base: str, username: str) -> int:
    """
    Scrape recent tweets from a single account via Nitter.
    Returns the number of new tweets inserted.
    """
    url = f"{nitter_base}/{username}"
    logger.info(f"Scraping Nitter: {url}")

    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (compatible; AIContentBot/1.0)"
        })
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to scrape {username} via Nitter: {e}")
        return 0

    soup = BeautifulSoup(resp.text, "lxml")
    tweets = soup.select(".timeline-item")

    if not tweets:
        # Try alternative selectors used by different Nitter versions
        tweets = soup.select(".tweet-body")

    count = 0
    for tweet_el in tweets:
        try:
            # Extract tweet text
            content_el = tweet_el.select_one(".tweet-content, .media-body")
            if not content_el:
                continue
            tweet_text = content_el.get_text(strip=True)

            # Extract engagement stats
            stats = tweet_el.select(".tweet-stat, .icon-container")
            likes = 0
            retweets = 0
            replies = 0
            for stat in stats:
                stat_text = stat.get_text(strip=True)
                if "like" in stat.get("title", "").lower() or \
                   stat.select_one(".icon-heart"):
                    likes = _parse_engagement(stat_text)
                elif "retweet" in stat.get("title", "").lower() or \
                     stat.select_one(".icon-retweet"):
                    retweets = _parse_engagement(stat_text)
                elif "comment" in stat.get("title", "").lower() or \
                     stat.select_one(".icon-comment"):
                    replies = _parse_engagement(stat_text)

            # Only keep tweets with significant engagement
            if likes < MIN_LIKES_THRESHOLD:
                continue

            # Extract tweet URL
            link_el = tweet_el.select_one(".tweet-link, a[href*='/status/']")
            tweet_path = ""
            if link_el and link_el.get("href"):
                tweet_path = link_el["href"]
            tweet_url = f"https://x.com{tweet_path}" if tweet_path else \
                        f"https://x.com/{username}"

            # Extract timestamp
            time_el = tweet_el.select_one("time, .tweet-date a")
            published_at = ""
            if time_el:
                dt_attr = time_el.get("datetime", time_el.get("title", ""))
                if dt_attr:
                    published_at = dt_attr

            # Detect if it's a thread (has "Show this thread" or similar)
            is_thread = bool(tweet_el.select_one(
                "a[href*='#m'], .show-thread, .thread-line"
            ))

            # Detect if it's a quote tweet
            is_quote = bool(tweet_el.select_one(".quote, .quote-media"))

            result = insert_source(
                source_type="twitter",
                source_name=f"twitter:@{username}",
                title=tweet_text[:120],
                summary=tweet_text,
                content=tweet_text,
                url=tweet_url,
                author=username,
                engagement_likes=likes,
                engagement_shares=retweets,
                engagement_comments=replies,
                extra_data={
                    "is_thread": is_thread,
                    "is_quote_tweet": is_quote,
                    "platform": "twitter",
                },
                published_at=published_at,
            )
            if result is not None:
                count += 1

        except Exception as e:
            logger.debug(f"Error parsing tweet from {username}: {e}")
            continue

    logger.info(f"Collected {count} high-engagement tweets from @{username}")
    return count


def collect_via_nitter() -> dict[str, int]:
    """Scrape all monitored accounts via Nitter."""
    nitter_base = _find_working_nitter()
    if not nitter_base:
        return {}

    results = {}
    for username in ALL_TWITTER_ACCOUNTS:
        count = scrape_nitter_account(nitter_base, username)
        results[username] = count
        time.sleep(2)  # Be polite between requests

    return results


# ─── Twitter API v2 (Fallback) ────────────────────────────────────────────────

def _has_twitter_api_keys() -> bool:
    """Check if Twitter API credentials are configured."""
    return all([
        TWITTER_API_KEY, TWITTER_API_SECRET,
        TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET,
    ])


def collect_via_api() -> dict[str, int]:
    """Collect tweets via official Twitter API v2 using tweepy."""
    if not _has_twitter_api_keys():
        logger.info("Twitter API keys not configured, skipping API collection")
        return {}

    try:
        import tweepy
    except ImportError:
        logger.warning("tweepy not installed, cannot use Twitter API")
        return {}

    logger.info("Collecting via Twitter API v2")
    client = tweepy.Client(
        consumer_key=TWITTER_API_KEY,
        consumer_secret=TWITTER_API_SECRET,
        access_token=TWITTER_ACCESS_TOKEN,
        access_token_secret=TWITTER_ACCESS_SECRET,
    )

    results = {}
    for username in ALL_TWITTER_ACCOUNTS:
        try:
            # Look up user ID
            user = client.get_user(username=username)
            if not user or not user.data:
                continue
            user_id = user.data.id

            # Get recent tweets
            tweets = client.get_users_tweets(
                user_id,
                max_results=10,
                tweet_fields=["created_at", "public_metrics", "referenced_tweets"],
                exclude=["replies"],
            )

            if not tweets or not tweets.data:
                results[username] = 0
                continue

            count = 0
            for tweet in tweets.data:
                metrics = tweet.public_metrics or {}
                likes = metrics.get("like_count", 0)
                retweets = metrics.get("retweet_count", 0)
                replies = metrics.get("reply_count", 0)

                if likes < MIN_LIKES_THRESHOLD:
                    continue

                # Check if quote tweet
                is_quote = False
                if tweet.referenced_tweets:
                    is_quote = any(
                        r.type == "quoted" for r in tweet.referenced_tweets
                    )

                result = insert_source(
                    source_type="twitter",
                    source_name=f"twitter:@{username}",
                    title=tweet.text[:120],
                    summary=tweet.text,
                    content=tweet.text,
                    url=f"https://x.com/{username}/status/{tweet.id}",
                    author=username,
                    engagement_likes=likes,
                    engagement_shares=retweets,
                    engagement_comments=replies,
                    extra_data={
                        "is_quote_tweet": is_quote,
                        "platform": "twitter",
                        "tweet_id": str(tweet.id),
                    },
                    published_at=tweet.created_at.isoformat() if tweet.created_at else "",
                )
                if result is not None:
                    count += 1

            results[username] = count
            time.sleep(1)  # Rate limit courtesy

        except Exception as e:
            logger.error(f"Twitter API error for @{username}: {e}")
            results[username] = 0

    return results


# ─── Main Collection Entrypoint ───────────────────────────────────────────────

def collect_all_twitter() -> dict[str, int]:
    """
    Collect tweets using hybrid approach:
    1. Try Nitter scraping first
    2. Fall back to Twitter API if Nitter fails
    """
    results = collect_via_nitter()

    if not results:
        logger.info("Nitter collection failed, falling back to Twitter API")
        results = collect_via_api()

    total = sum(results.values())
    logger.info(f"Total new tweets collected: {total}")
    return results


if __name__ == "__main__":
    from ai_content_machine.utils.database import init_db
    init_db()
    results = collect_all_twitter()
    print(f"Twitter collection results: {results}")
