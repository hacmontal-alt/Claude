"""SQLite database manager for AI Content Machine."""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

from config.settings import DB_PATH


def get_connection() -> sqlite3.Connection:
    """Get a database connection, creating the DB file if needed."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initialize all database tables."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        -- Raw collected articles/tweets
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_type TEXT NOT NULL,          -- 'news' or 'twitter'
            source_name TEXT NOT NULL,          -- 'techcrunch', 'hackernews', 'twitter:@sama', etc.
            title TEXT,
            summary TEXT,
            content TEXT,
            url TEXT,
            author TEXT,
            engagement_likes INTEGER DEFAULT 0,
            engagement_shares INTEGER DEFAULT 0,
            engagement_comments INTEGER DEFAULT 0,
            extra_data TEXT,                    -- JSON blob for source-specific fields
            published_at TEXT,
            collected_at TEXT NOT NULL,
            UNIQUE(url)
        );

        -- Ranked topics for each day
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,                 -- YYYY-MM-DD
            rank INTEGER NOT NULL,             -- 1, 2, 3
            title TEXT NOT NULL,
            summary TEXT,
            source_ids TEXT,                   -- JSON array of source IDs
            score REAL,
            score_breakdown TEXT,              -- JSON object with per-factor scores
            created_at TEXT NOT NULL
        );

        -- Generated posts
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER REFERENCES topics(id),
            platform TEXT NOT NULL,            -- 'linkedin' or 'twitter'
            content TEXT NOT NULL,             -- full post text (or JSON array for twitter thread)
            status TEXT NOT NULL DEFAULT 'draft',  -- draft, approved, scheduled, published
            scheduled_at TEXT,
            published_at TEXT,
            publish_id TEXT,                   -- platform-specific post ID after publishing
            analytics TEXT,                    -- JSON blob for engagement metrics
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        -- Index for common queries
        CREATE INDEX IF NOT EXISTS idx_sources_collected ON sources(collected_at);
        CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(source_type);
        CREATE INDEX IF NOT EXISTS idx_topics_date ON topics(date);
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
        CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
    """)

    conn.commit()
    conn.close()


def insert_source(source_type: str, source_name: str, title: str,
                  summary: str, url: str, author: str = "",
                  content: str = "",
                  engagement_likes: int = 0, engagement_shares: int = 0,
                  engagement_comments: int = 0, extra_data: dict = None,
                  published_at: str = "") -> int | None:
    """Insert a source record, skipping duplicates. Returns the row ID or None."""
    conn = get_connection()
    try:
        cursor = conn.execute(
            """INSERT OR IGNORE INTO sources
               (source_type, source_name, title, summary, content, url, author,
                engagement_likes, engagement_shares, engagement_comments,
                extra_data, published_at, collected_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (source_type, source_name, title, summary, content, url, author,
             engagement_likes, engagement_shares, engagement_comments,
             json.dumps(extra_data or {}), published_at,
             datetime.utcnow().isoformat())
        )
        conn.commit()
        return cursor.lastrowid if cursor.rowcount > 0 else None
    finally:
        conn.close()


def insert_topic(date: str, rank: int, title: str, summary: str,
                 source_ids: list[int], score: float,
                 score_breakdown: dict) -> int:
    """Insert a ranked topic. Returns the row ID."""
    conn = get_connection()
    try:
        cursor = conn.execute(
            """INSERT INTO topics (date, rank, title, summary, source_ids,
               score, score_breakdown, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (date, rank, title, summary, json.dumps(source_ids), score,
             json.dumps(score_breakdown), datetime.utcnow().isoformat())
        )
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def insert_post(topic_id: int, platform: str, content: str,
                status: str = "draft") -> int:
    """Insert a generated post. Returns the row ID."""
    now = datetime.utcnow().isoformat()
    conn = get_connection()
    try:
        cursor = conn.execute(
            """INSERT INTO posts (topic_id, platform, content, status,
               created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (topic_id, platform, content, status, now, now)
        )
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def update_post(post_id: int, **kwargs):
    """Update post fields by ID."""
    allowed = {"content", "status", "scheduled_at", "published_at",
               "publish_id", "analytics"}
    updates = {k: v for k, v in kwargs.items() if k in allowed}
    if not updates:
        return
    updates["updated_at"] = datetime.utcnow().isoformat()
    set_clause = ", ".join(f"{k} = ?" for k in updates)
    values = list(updates.values()) + [post_id]
    conn = get_connection()
    try:
        conn.execute(f"UPDATE posts SET {set_clause} WHERE id = ?", values)
        conn.commit()
    finally:
        conn.close()


def get_sources_since(hours: int = 24, source_type: str = None) -> list[dict]:
    """Get sources collected within the last N hours."""
    conn = get_connection()
    try:
        query = """SELECT * FROM sources
                   WHERE collected_at >= datetime('now', ?)"""
        params = [f"-{hours} hours"]
        if source_type:
            query += " AND source_type = ?"
            params.append(source_type)
        query += " ORDER BY collected_at DESC"
        rows = conn.execute(query, params).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_topics_for_date(date: str) -> list[dict]:
    """Get ranked topics for a specific date."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM topics WHERE date = ? ORDER BY rank",
            (date,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_posts_for_topic(topic_id: int) -> list[dict]:
    """Get all posts for a given topic."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM posts WHERE topic_id = ? ORDER BY platform",
            (topic_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_recent_posts(days: int = 7) -> list[dict]:
    """Get posts from the last N days."""
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT p.*, t.title as topic_title, t.date as topic_date
               FROM posts p
               JOIN topics t ON p.topic_id = t.id
               WHERE p.created_at >= datetime('now', ?)
               ORDER BY p.created_at DESC""",
            (f"-{days} days",)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_previous_topic_titles(days: int = 30) -> list[str]:
    """Get titles of topics from previous days (for novelty checking)."""
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT title FROM topics
               WHERE created_at >= datetime('now', ?)
               ORDER BY created_at DESC""",
            (f"-{days} days",)
        ).fetchall()
        return [r["title"] for r in rows]
    finally:
        conn.close()
