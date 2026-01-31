"""
Configuration settings for AI Content Machine.
All API keys and sensitive config should be set via environment variables or .env file.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "db" / "content_machine.db"
TRAINING_POSTS_DIR = DATA_DIR / "training_posts"
LOGS_DIR = BASE_DIR / "logs"

# ─── API Keys ─────────────────────────────────────────────────────────────────
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY", "")
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY", "")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET", "")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN", "")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET", "")
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")

# ─── Author Profile ──────────────────────────────────────────────────────────
AUTHOR_NAME = "Tal Hacmon"
AUTHOR_LINKEDIN_HANDLE = "Tal Hacmon"
AUTHOR_TWITTER_HANDLE = "@tal_hacmon"
NEWSLETTER_LINK = "https://lnkd.in/dr5n5jze"

# ─── News Sources ─────────────────────────────────────────────────────────────
NEWS_SOURCES = {
    "techcrunch": {
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "type": "rss",
    },
    "venturebeat": {
        "url": "https://venturebeat.com/category/ai/feed/",
        "type": "rss",
    },
    "hackernews": {
        "url": "https://hacker-news.firebaseio.com/v0/",
        "type": "api",
        "ai_keywords": [
            "AI", "artificial intelligence", "GPT", "LLM", "machine learning",
            "neural", "deep learning", "OpenAI", "Anthropic", "Claude",
            "Gemini", "DeepMind", "transformer", "generative", "AGI",
            "foundation model", "diffusion", "chatbot", "copilot",
        ],
    },
    "producthunt": {
        "url": "https://www.producthunt.com/feed",
        "type": "rss",
        "ai_keywords": [
            "AI", "artificial intelligence", "GPT", "LLM", "machine learning",
            "generative", "copilot", "chatbot", "automation",
        ],
    },
}

# ─── Twitter Accounts to Monitor ──────────────────────────────────────────────
TWITTER_ACCOUNTS = {
    "ai_lab_founders": [
        "sama",           # Sam Altman - OpenAI
        "AnthropicAI",    # Anthropic
        "demaborsa",      # Demis Hassabis - DeepMind (placeholder handle)
    ],
    "researchers": [
        "karpathy",       # Andrej Karpathy
        "ylecun",         # Yann LeCun
        "goodfellow_ian", # Ian Goodfellow
    ],
    "ai_observers": [
        "emollick",       # Ethan Mollick
        "labenz",         # Nathan Labenz
        "BinduReddy",     # Bindu Reddy
    ],
    "vc_investors": [
        "saranormous",    # Sarah Guo
        "pooleparty",     # Mike Poole
    ],
    "israeli_tech": [
        "AmitBendov",     # Amit Bendov
    ],
}

# Flatten for easy iteration
ALL_TWITTER_ACCOUNTS = []
for group in TWITTER_ACCOUNTS.values():
    ALL_TWITTER_ACCOUNTS.extend(group)

# ─── Nitter Instances (for Twitter scraping without API) ──────────────────────
NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.privacydev.net",
    "https://nitter.poast.org",
]

# ─── Topic Ranking Weights ────────────────────────────────────────────────────
RANKING_WEIGHTS = {
    "recency": 0.25,         # Prefer last 24 hours
    "engagement": 0.20,      # Social shares/comments/likes
    "business_relevance": 0.20,  # Funding, launches, strategic moves
    "novelty": 0.15,         # Not covered in previous posts
    "twitter_signal": 0.10,  # Weight Twitter content higher
    "multi_source": 0.10,    # Multiple top accounts discussing same topic
}

# ─── Content Generation ──────────────────────────────────────────────────────
CLAUDE_MODEL = "claude-sonnet-4-20250514"
LINKEDIN_WORD_RANGE = (250, 400)
TWITTER_THREAD_LENGTH = (5, 7)  # number of tweets

# ─── Scheduling (IST = UTC+2 in winter, UTC+3 in summer) ─────────────────────
LINKEDIN_POST_HOUR_IST = 9   # 9 AM IST
TWITTER_POST_HOUR_IST = 12   # 12 PM IST
DATA_COLLECTION_HOUR_IST = 6 # 6 AM IST

# ─── Dashboard ────────────────────────────────────────────────────────────────
DASHBOARD_HOST = "127.0.0.1"
DASHBOARD_PORT = 5000
DASHBOARD_DEBUG = True
