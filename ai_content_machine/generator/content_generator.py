"""
Content Generation Engine.

Uses Claude API to generate LinkedIn posts and Twitter threads
matching Tal Hacmon's writing style and perspective.
"""

import json
from pathlib import Path

import anthropic

from ai_content_machine.utils.database import insert_post, get_recent_posts
from ai_content_machine.utils.logger import setup_logger
from config.settings import (
    CLAUDE_API_KEY, CLAUDE_MODEL, TRAINING_POSTS_DIR,
    AUTHOR_NAME, AUTHOR_TWITTER_HANDLE, NEWSLETTER_LINK,
    LINKEDIN_WORD_RANGE, TWITTER_THREAD_LENGTH,
)

logger = setup_logger("generator")


# ─── Style Training Data ─────────────────────────────────────────────────────

def _load_training_examples() -> dict:
    """Load Tal's example posts for style reference."""
    examples = {"linkedin": [], "twitter": []}

    linkedin_path = TRAINING_POSTS_DIR / "linkedin_examples.json"
    twitter_path = TRAINING_POSTS_DIR / "twitter_examples.json"

    if linkedin_path.exists():
        with open(linkedin_path) as f:
            examples["linkedin"] = json.load(f)
    if twitter_path.exists():
        with open(twitter_path) as f:
            examples["twitter"] = json.load(f)

    return examples


def _build_style_guide(examples: dict) -> str:
    """Build a style guide prompt section from training examples."""
    guide_parts = []

    guide_parts.append("""WRITING STYLE GUIDE FOR TAL HACMON:

Voice & Tone:
- Founder/operator perspective — speaks from experience, not theory
- Pattern-spotter — connects dots between seemingly unrelated events
- Business-focused — always ties back to actionable insights for founders/operators
- Conversational but professional — no corporate jargon, no fluff
- Concrete over abstract — specific numbers, companies, examples > vague claims
- Israeli tech ecosystem lens when relevant

Structure Pattern (ALWAYS follow this):
1. HOOK: Start with a specific, attention-grabbing example (name a company, person, or event)
2. STORY: What happened, with concrete details (numbers, timeline, specifics)
3. ANALYSIS: 3-4 bullet points breaking down "why this matters"
4. TAKEAWAY: Clear lesson or insight for founders/operators
5. CTA: Standard closing""")

    # Add LinkedIn examples
    if examples.get("linkedin"):
        guide_parts.append("\n--- LINKEDIN STYLE EXAMPLES ---")
        for ex in examples["linkedin"][:3]:
            guide_parts.append(f"\nExample ({ex.get('title', 'Post')}):")
            guide_parts.append(ex.get("content", ""))
            guide_parts.append("---")

    # Add Twitter examples
    if examples.get("twitter"):
        guide_parts.append("\n--- TWITTER THREAD STYLE EXAMPLES ---")
        for ex in examples["twitter"][:2]:
            guide_parts.append(f"\nExample ({ex.get('title', 'Thread')}):")
            for i, tweet in enumerate(ex.get("thread", []), 1):
                guide_parts.append(f"Tweet {i}: {tweet}")
            guide_parts.append("---")

    return "\n".join(guide_parts)


# ─── Content Generation ──────────────────────────────────────────────────────

def _get_client() -> anthropic.Anthropic:
    """Create an Anthropic API client."""
    if not CLAUDE_API_KEY:
        raise ValueError(
            "CLAUDE_API_KEY not configured. Set it in .env or environment variables."
        )
    return anthropic.Anthropic(api_key=CLAUDE_API_KEY)


def _get_recent_context() -> str:
    """Get recent posts for consistency checking."""
    recent = get_recent_posts(days=3)
    if not recent:
        return "No recent posts to reference."

    lines = ["Recent posts for context (avoid repeating similar angles):"]
    for post in recent[:5]:
        lines.append(f"- [{post.get('platform')}] {post.get('topic_title', 'N/A')}: "
                     f"{post.get('content', '')[:150]}...")
    return "\n".join(lines)


def generate_linkedin_post(topic: dict) -> str:
    """
    Generate a LinkedIn post for the given topic.

    Args:
        topic: dict with 'title', 'summary', 'sources' (list of source dicts)

    Returns:
        Generated LinkedIn post text.
    """
    logger.info(f"Generating LinkedIn post for: {topic['title'][:60]}")

    examples = _load_training_examples()
    style_guide = _build_style_guide(examples)
    recent_context = _get_recent_context()

    # Compile source material
    source_material = []
    for src in topic.get("sources", []):
        source_material.append(
            f"- [{src.get('source_name', 'Unknown')}] {src.get('title', '')}\n"
            f"  {src.get('summary', '')}\n"
            f"  URL: {src.get('url', '')}\n"
            f"  Engagement: {src.get('engagement_likes', 0)} likes, "
            f"{src.get('engagement_shares', 0)} shares"
        )

    source_text = "\n".join(source_material) if source_material else topic.get("summary", "")

    min_words, max_words = LINKEDIN_WORD_RANGE

    prompt = f"""Write a LinkedIn post as {AUTHOR_NAME} about the following AI topic.

{style_guide}

TOPIC: {topic['title']}

SOURCE MATERIAL:
{source_text}

{recent_context}

REQUIREMENTS:
- {min_words}-{max_words} words
- Follow the HOOK → STORY → ANALYSIS (3-4 bullets) → TAKEAWAY → CTA structure exactly
- Include specific details from the source material (company names, numbers, dates)
- Add Tal's perspective: what does this mean for founders/operators?
- If relevant, include an Israeli tech ecosystem angle
- End with EXACTLY this CTA:
  "If you found this insightful, consider resharing 🔄 and follow me {AUTHOR_NAME} for more content like this.

  For a deeper dive, check out my newsletter: {NEWSLETTER_LINK}

  Always 5 minutes or less to read."

Write the post now. Output ONLY the post text, no commentary or labels."""

    client = _get_client()
    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    post_text = response.content[0].text.strip()
    logger.info(f"LinkedIn post generated ({len(post_text.split())} words)")
    return post_text


def generate_twitter_thread(topic: dict) -> list[str]:
    """
    Generate a Twitter thread for the given topic.

    Args:
        topic: dict with 'title', 'summary', 'sources' (list of source dicts)

    Returns:
        List of tweet strings forming the thread.
    """
    logger.info(f"Generating Twitter thread for: {topic['title'][:60]}")

    examples = _load_training_examples()
    style_guide = _build_style_guide(examples)
    recent_context = _get_recent_context()

    source_material = []
    for src in topic.get("sources", []):
        source_material.append(
            f"- [{src.get('source_name', 'Unknown')}] {src.get('title', '')}\n"
            f"  {src.get('summary', '')}"
        )

    source_text = "\n".join(source_material) if source_material else topic.get("summary", "")

    min_tweets, max_tweets = TWITTER_THREAD_LENGTH

    prompt = f"""Write a Twitter/X thread as {AUTHOR_NAME} ({AUTHOR_TWITTER_HANDLE}) about the following AI topic.

{style_guide}

TOPIC: {topic['title']}

SOURCE MATERIAL:
{source_text}

{recent_context}

REQUIREMENTS:
- {min_tweets}-{max_tweets} tweets in the thread
- Each tweet MUST be under 280 characters
- Tweet 1: Strong hook with a specific example (add 🧵 or 👇 to signal thread)
- Tweets 2-{max_tweets - 2}: Story + analysis points with concrete details
- Tweet {max_tweets - 1}: Clear takeaway or lesson
- Final tweet: CTA — follow {AUTHOR_TWITTER_HANDLE} + newsletter link ({NEWSLETTER_LINK})
- Include specific details from the source material
- Add Tal's business-focused perspective

Output the thread as a JSON array of strings, one per tweet. Output ONLY the JSON array, no commentary."""

    client = _get_client()
    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = response.content[0].text.strip()

    # Parse the JSON array
    try:
        tweets = json.loads(raw)
        if not isinstance(tweets, list):
            raise ValueError("Response is not a list")
    except (json.JSONDecodeError, ValueError):
        # Try to extract JSON array from the response
        import re
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if match:
            tweets = json.loads(match.group())
        else:
            # Fall back to splitting by newlines
            logger.warning("Could not parse thread as JSON, splitting by lines")
            tweets = [line.strip() for line in raw.split("\n")
                     if line.strip() and not line.startswith("```")]

    # Validate tweet lengths
    for i, tweet in enumerate(tweets):
        if len(tweet) > 280:
            logger.warning(f"Tweet {i+1} exceeds 280 chars ({len(tweet)}), truncating")
            tweets[i] = tweet[:277] + "..."

    logger.info(f"Twitter thread generated ({len(tweets)} tweets)")
    return tweets


# ─── Full Generation Pipeline ─────────────────────────────────────────────────

def generate_content_for_topic(topic: dict) -> dict:
    """
    Generate both LinkedIn and Twitter content for a topic.

    Args:
        topic: dict with 'title', 'summary', 'sources', and optionally 'id'

    Returns:
        dict with 'linkedin_post', 'twitter_thread', 'linkedin_post_id', 'twitter_post_id'
    """
    topic_id = topic.get("id")

    # Generate LinkedIn post
    linkedin_post = generate_linkedin_post(topic)

    # Generate Twitter thread
    twitter_thread = generate_twitter_thread(topic)

    result = {
        "linkedin_post": linkedin_post,
        "twitter_thread": twitter_thread,
    }

    # Save to database if we have a topic ID
    if topic_id:
        linkedin_post_id = insert_post(
            topic_id=topic_id,
            platform="linkedin",
            content=linkedin_post,
            status="draft",
        )
        twitter_post_id = insert_post(
            topic_id=topic_id,
            platform="twitter",
            content=json.dumps(twitter_thread),
            status="draft",
        )
        result["linkedin_post_id"] = linkedin_post_id
        result["twitter_post_id"] = twitter_post_id
        logger.info(f"Saved posts to DB: LinkedIn #{linkedin_post_id}, Twitter #{twitter_post_id}")

    return result


def regenerate_post(topic: dict, platform: str) -> str | list[str]:
    """
    Regenerate a single post for a platform.
    Returns the new content (string for LinkedIn, list for Twitter).
    """
    if platform == "linkedin":
        return generate_linkedin_post(topic)
    elif platform == "twitter":
        return generate_twitter_thread(topic)
    else:
        raise ValueError(f"Unknown platform: {platform}")


if __name__ == "__main__":
    # Test with a sample topic
    sample_topic = {
        "title": "OpenAI launches GPT-5 with multimodal reasoning",
        "summary": "OpenAI announced GPT-5 with advanced reasoning capabilities. "
                   "The model shows 40% improvement on business benchmarks.",
        "sources": [{
            "source_name": "techcrunch",
            "title": "OpenAI launches GPT-5",
            "summary": "OpenAI announced GPT-5 today with major improvements in reasoning.",
            "url": "https://example.com/gpt5",
            "engagement_likes": 5000,
            "engagement_shares": 1200,
        }],
    }
    result = generate_content_for_topic(sample_topic)
    print("=== LINKEDIN POST ===")
    print(result["linkedin_post"])
    print("\n=== TWITTER THREAD ===")
    for i, tweet in enumerate(result["twitter_thread"], 1):
        print(f"Tweet {i}: {tweet}")
