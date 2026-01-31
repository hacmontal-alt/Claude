"""
Notification module for sending alerts when posts are published or errors occur.
Supports Slack webhook and basic email notifications.
"""

import json
import requests
from datetime import datetime

from ai_content_machine.utils.logger import setup_logger
from config.settings import SLACK_WEBHOOK_URL

logger = setup_logger("publisher.notifier")


def send_slack_notification(message: str, is_error: bool = False) -> bool:
    """
    Send a notification to Slack via webhook.

    Args:
        message: The notification text
        is_error: If True, formats as an error alert

    Returns:
        True if sent successfully, False otherwise
    """
    if not SLACK_WEBHOOK_URL:
        logger.debug("Slack webhook not configured, skipping notification")
        return False

    emoji = ":rotating_light:" if is_error else ":white_check_mark:"
    prefix = "ERROR" if is_error else "AI Content Machine"

    payload = {
        "text": f"{emoji} *{prefix}*\n{message}",
        "unfurl_links": False,
    }

    try:
        resp = requests.post(
            SLACK_WEBHOOK_URL,
            json=payload,
            timeout=10,
        )
        resp.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"Failed to send Slack notification: {e}")
        return False


def notify_publish_success(platform: str, topic_title: str,
                           publish_id: str = "") -> bool:
    """Send notification that a post was published successfully."""
    msg = (
        f"*{platform.title()} post published!*\n"
        f"Topic: {topic_title}\n"
        f"Published at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
    )
    if publish_id:
        msg += f"\nID: `{publish_id}`"
    return send_slack_notification(msg)


def notify_publish_failure(platform: str, topic_title: str,
                           error: str) -> bool:
    """Send notification that a post failed to publish."""
    msg = (
        f"*Failed to publish {platform.title()} post*\n"
        f"Topic: {topic_title}\n"
        f"Error: {error}"
    )
    return send_slack_notification(msg, is_error=True)


def notify_pipeline_complete(results: dict) -> bool:
    """Send daily pipeline summary notification."""
    msg = "*Daily Pipeline Complete*\n"
    for key, val in results.items():
        msg += f"  {key}: {val}\n"
    return send_slack_notification(msg)
