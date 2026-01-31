"""
Review Dashboard — Flask web interface for reviewing and editing generated posts.

Features:
- View generated LinkedIn post (editable textarea)
- View generated Twitter thread (editable, tweet-by-tweet)
- Source article/tweet links with preview
- Alternative topics (ranked #2 and #3)
- Platform preview
- Buttons: Save draft / Approve & Schedule / Regenerate / Pick different topic
- Previous day's post for style consistency check
"""

import json
from datetime import datetime, timedelta

from flask import Flask, render_template, request, jsonify, redirect, url_for

from ai_content_machine.utils.database import (
    get_topics_for_date, get_posts_for_topic, update_post,
    get_recent_posts, get_connection,
)
from ai_content_machine.utils.logger import setup_logger
from config.settings import DASHBOARD_HOST, DASHBOARD_PORT, DASHBOARD_DEBUG

logger = setup_logger("dashboard")

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
)


# ─── Helper Functions ─────────────────────────────────────────────────────────

def _get_topic_with_posts(topic_row: dict) -> dict:
    """Enrich a topic dict with its posts and parsed source IDs."""
    topic = dict(topic_row)
    topic["source_ids_list"] = json.loads(topic.get("source_ids", "[]"))
    topic["score_breakdown_obj"] = json.loads(topic.get("score_breakdown", "{}"))
    topic["posts"] = get_posts_for_topic(topic["id"])

    # Parse twitter thread JSON if present
    for post in topic["posts"]:
        if post["platform"] == "twitter":
            try:
                post["thread"] = json.loads(post["content"])
            except (json.JSONDecodeError, TypeError):
                post["thread"] = [post["content"]]

    return topic


def _get_source_details(source_ids: list[int]) -> list[dict]:
    """Fetch source details by IDs."""
    if not source_ids:
        return []
    conn = get_connection()
    try:
        placeholders = ",".join("?" * len(source_ids))
        rows = conn.execute(
            f"SELECT * FROM sources WHERE id IN ({placeholders})",
            source_ids,
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Main dashboard page showing today's content."""
    date = request.args.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    topics = get_topics_for_date(date)

    enriched_topics = []
    for t in topics:
        enriched = _get_topic_with_posts(t)
        enriched["sources_detail"] = _get_source_details(enriched["source_ids_list"])
        enriched_topics.append(enriched)

    # Get previous day's posts for consistency check
    prev_date = (datetime.strptime(date, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")
    prev_topics = get_topics_for_date(prev_date)
    prev_enriched = []
    for t in prev_topics:
        prev_enriched.append(_get_topic_with_posts(t))

    return render_template(
        "dashboard.html",
        date=date,
        topics=enriched_topics,
        prev_topics=prev_enriched,
        prev_date=prev_date,
    )


@app.route("/api/post/<int:post_id>/update", methods=["POST"])
def update_post_content(post_id: int):
    """Update post content via AJAX."""
    data = request.get_json()
    content = data.get("content", "")
    if not content:
        return jsonify({"error": "Content is required"}), 400

    update_post(post_id, content=content)
    logger.info(f"Post #{post_id} content updated")
    return jsonify({"status": "ok", "message": "Post updated"})


@app.route("/api/post/<int:post_id>/approve", methods=["POST"])
def approve_post(post_id: int):
    """Approve and schedule a post."""
    update_post(post_id, status="approved")
    logger.info(f"Post #{post_id} approved")
    return jsonify({"status": "ok", "message": "Post approved and scheduled"})


@app.route("/api/post/<int:post_id>/status", methods=["POST"])
def change_post_status(post_id: int):
    """Change post status."""
    data = request.get_json()
    status = data.get("status", "draft")
    update_post(post_id, status=status)
    logger.info(f"Post #{post_id} status changed to {status}")
    return jsonify({"status": "ok", "message": f"Status changed to {status}"})


@app.route("/api/regenerate", methods=["POST"])
def regenerate():
    """Regenerate content for a topic."""
    data = request.get_json()
    topic_id = data.get("topic_id")
    platform = data.get("platform", "both")

    if not topic_id:
        return jsonify({"error": "topic_id is required"}), 400

    # Fetch topic data
    conn = get_connection()
    try:
        topic_row = conn.execute(
            "SELECT * FROM topics WHERE id = ?", (topic_id,)
        ).fetchone()
    finally:
        conn.close()

    if not topic_row:
        return jsonify({"error": "Topic not found"}), 404

    topic = dict(topic_row)
    source_ids = json.loads(topic.get("source_ids", "[]"))
    sources = _get_source_details(source_ids)

    topic_data = {
        "id": topic["id"],
        "title": topic["title"],
        "summary": topic["summary"],
        "sources": sources,
    }

    try:
        from ai_content_machine.generator.content_generator import (
            generate_content_for_topic, regenerate_post as regen,
        )

        if platform == "both":
            result = generate_content_for_topic(topic_data)
            return jsonify({
                "status": "ok",
                "linkedin_post": result.get("linkedin_post", ""),
                "twitter_thread": result.get("twitter_thread", []),
            })
        else:
            content = regen(topic_data, platform)
            return jsonify({"status": "ok", "content": content})
    except Exception as e:
        logger.error(f"Regeneration failed: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/history")
def history():
    """View post history."""
    posts = get_recent_posts(days=30)
    return render_template("history.html", posts=posts)


# ─── Run ──────────────────────────────────────────────────────────────────────

def run_dashboard():
    """Start the Flask dashboard."""
    logger.info(f"Starting dashboard on {DASHBOARD_HOST}:{DASHBOARD_PORT}")
    app.run(
        host=DASHBOARD_HOST,
        port=DASHBOARD_PORT,
        debug=DASHBOARD_DEBUG,
    )


if __name__ == "__main__":
    run_dashboard()
