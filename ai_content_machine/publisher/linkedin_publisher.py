"""
LinkedIn Publishing Module.

Publishes approved posts to LinkedIn using the LinkedIn API.
Handles formatting, scheduling, and post-publish analytics tracking.
"""

import json
import requests
from datetime import datetime

from ai_content_machine.utils.database import update_post
from ai_content_machine.utils.logger import setup_logger
from config.settings import LINKEDIN_ACCESS_TOKEN

logger = setup_logger("publisher.linkedin")

LINKEDIN_API_BASE = "https://api.linkedin.com/v2"


def _get_user_id(access_token: str) -> str | None:
    """Retrieve the authenticated user's LinkedIn URN."""
    try:
        resp = requests.get(
            f"{LINKEDIN_API_BASE}/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("sub")
    except Exception as e:
        logger.error(f"Failed to get LinkedIn user ID: {e}")
        return None


def publish_post(post_id: int, content: str,
                 access_token: str = None) -> dict:
    """
    Publish a text post to LinkedIn.

    Args:
        post_id: Database post ID for tracking
        content: The full post text
        access_token: LinkedIn OAuth token (uses config default if not provided)

    Returns:
        dict with 'success', 'post_urn', and optional 'error'
    """
    token = access_token or LINKEDIN_ACCESS_TOKEN
    if not token:
        return {"success": False, "error": "LinkedIn access token not configured"}

    user_id = _get_user_id(token)
    if not user_id:
        return {"success": False, "error": "Could not retrieve LinkedIn user ID"}

    author_urn = f"urn:li:person:{user_id}"

    payload = {
        "author": author_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": content
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }

    try:
        resp = requests.post(
            f"{LINKEDIN_API_BASE}/ugcPosts",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        result = resp.json()
        post_urn = result.get("id", "")

        # Update database
        update_post(
            post_id,
            status="published",
            published_at=datetime.utcnow().isoformat(),
            publish_id=post_urn,
        )

        logger.info(f"LinkedIn post published: {post_urn}")
        return {"success": True, "post_urn": post_urn}

    except requests.exceptions.HTTPError as e:
        error_body = ""
        try:
            error_body = e.response.json()
        except Exception:
            error_body = e.response.text
        logger.error(f"LinkedIn publish failed: {e} - {error_body}")
        return {"success": False, "error": str(error_body)}
    except Exception as e:
        logger.error(f"LinkedIn publish error: {e}")
        return {"success": False, "error": str(e)}


def get_post_analytics(post_urn: str,
                       access_token: str = None) -> dict:
    """
    Fetch basic analytics for a published LinkedIn post.
    Returns engagement metrics.
    """
    token = access_token or LINKEDIN_ACCESS_TOKEN
    if not token or not post_urn:
        return {}

    try:
        resp = requests.get(
            f"{LINKEDIN_API_BASE}/socialActions/{post_urn}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        analytics = {
            "likes": data.get("likesSummary", {}).get("totalLikes", 0),
            "comments": data.get("commentsSummary", {}).get("totalFirstLevelComments", 0),
            "shares": data.get("sharesSummary", {}).get("totalShares", 0),
        }

        return analytics

    except Exception as e:
        logger.error(f"Failed to fetch LinkedIn analytics: {e}")
        return {}
