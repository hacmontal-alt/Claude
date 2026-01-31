"""Logging configuration for AI Content Machine."""

import logging
import sys
from pathlib import Path

from config.settings import LOGS_DIR


def setup_logger(name: str = "ai_content_machine",
                 level: int = logging.INFO) -> logging.Logger:
    """Set up and return a logger with file and console handlers."""
    LOGS_DIR.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if logger.handlers:
        return logger

    fmt = logging.Formatter(
        "%(asctime)s | %(name)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(level)
    console.setFormatter(fmt)
    logger.addHandler(console)

    # File handler
    file_handler = logging.FileHandler(LOGS_DIR / "content_machine.log")
    file_handler.setLevel(level)
    file_handler.setFormatter(fmt)
    logger.addHandler(file_handler)

    return logger
