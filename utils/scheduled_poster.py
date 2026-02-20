#!/usr/bin/env python3
"""
GenWise CM - Scheduled Post Publisher
Runs via cron on DO droplet, checks for scheduled posts and publishes to Twitter/X.

Features:
- Handles mentions (@handles) in posts
- Handles threads (parent/reply chains) - posts parent first, then replies
- URLs in thread replies avoid Twitter engagement penalties

Setup on DO:
1. Copy this file to /root/apps/cm-poster/scheduled_poster.py
2. Create .env with credentials
3. pip install tweepy supabase python-dotenv
4. Add cron: */5 * * * * cd /root/apps/cm-poster && python scheduled_poster.py >> /var/log/cm-poster.log 2>&1
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase CM credentials
SUPABASE_URL = os.getenv("SUPABASE_CM_URL", "https://kkkcjcqvngyohzhqoanb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_CM_SERVICE_KEY")

# GenWise Twitter credentials
TWITTER_API_KEY = os.getenv("TWITTER_WORK_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_WORK_API_KEY_SECRET")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_WORK_ACCESS_TOKEN")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_WORK_ACCESS_TOKEN_SECRET")

def log(msg: str):
    """Print timestamped log message."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    print(f"[{ts}] {msg}")

def get_due_posts():
    """Fetch posts that are scheduled and due for posting, ordered for thread handling."""
    try:
        from supabase import create_client

        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        now = datetime.now(timezone.utc).isoformat()

        # Get posts where:
        # - status = 'scheduled'
        # - platform = 'twitter'
        # - scheduled_date <= now OR scheduled_date is null (post immediately)

        # First get posts with scheduled_date <= now
        response1 = supabase.table("content_posts") \
            .select("*") \
            .eq("status", "scheduled") \
            .eq("platform", "twitter") \
            .lte("scheduled_date", now) \
            .execute()

        # Then get posts with no scheduled_date (post immediately)
        response2 = supabase.table("content_posts") \
            .select("*") \
            .eq("status", "scheduled") \
            .eq("platform", "twitter") \
            .is_("scheduled_date", "null") \
            .execute()

        # Combine results
        posts = (response1.data or []) + (response2.data or [])

        # Sort posts: parents first (no parent_post_id), then replies by thread_position
        # This ensures parent is posted before its replies
        def sort_key(p):
            has_parent = 1 if p.get("parent_post_id") else 0
            position = p.get("thread_position") or 0
            return (has_parent, position)

        posts.sort(key=sort_key)
        return posts
    except Exception as e:
        log(f"ERROR fetching posts: {e}")
        return []


def get_parent_platform_id(parent_post_id: str) -> str | None:
    """Get the platform_id of a parent post (for threading replies)."""
    try:
        from supabase import create_client

        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table("content_posts") \
            .select("platform_id, status") \
            .eq("id", parent_post_id) \
            .single() \
            .execute()

        if response.data and response.data.get("status") == "posted":
            return response.data.get("platform_id")
        return None
    except Exception as e:
        log(f"ERROR fetching parent post {parent_post_id}: {e}")
        return None

def parse_json_array(json_str: str | None) -> list:
    """Parse a JSON array string, handling malformed input gracefully."""
    if not json_str:
        return []
    try:
        parsed = json.loads(json_str)
        return parsed if isinstance(parsed, list) else []
    except:
        # If not valid JSON, try to extract words
        found = re.findall(r'[@#]?\w+', json_str)
        return [f for f in found if f]


def post_to_twitter(post: dict, reply_to_tweet_id: str | None = None) -> dict:
    """Post content to Twitter/X and return result.

    Args:
        post: The post data from database
        reply_to_tweet_id: If set, post as a reply to this tweet (for threads)
    """
    try:
        import tweepy

        # Authenticate with Twitter
        client = tweepy.Client(
            consumer_key=TWITTER_API_KEY,
            consumer_secret=TWITTER_API_SECRET,
            access_token=TWITTER_ACCESS_TOKEN,
            access_token_secret=TWITTER_ACCESS_SECRET
        )

        # Build tweet content
        caption = post.get("caption", "")

        # Parse mentions and prepend to caption
        mentions = parse_json_array(post.get("mentions"))
        if mentions:
            # Ensure @ prefix
            mention_handles = [m if m.startswith("@") else f"@{m}" for m in mentions]
            mention_str = " ".join(mention_handles)
            # Prepend mentions to caption
            caption = f"{mention_str} {caption}"

        # Parse hashtags
        hashtags = parse_json_array(post.get("hashtags"))
        if hashtags:
            # Ensure # prefix
            hashtags = [h if h.startswith("#") else f"#{h}" for h in hashtags]

        # Combine caption and hashtags
        tweet_text = caption
        if hashtags:
            hashtag_str = " ".join(hashtags)
            # Check if adding hashtags would exceed limit
            # Note: Twitter Blue allows longer posts, but we'll stay safe
            if len(tweet_text) + len(hashtag_str) + 2 <= 280:
                tweet_text = f"{tweet_text}\n\n{hashtag_str}"

        # Log if truncating (but don't truncate - Twitter Blue accounts can post longer)
        if len(tweet_text) > 280:
            log(f"Note: Tweet is {len(tweet_text)} chars (>280), posting full length")

        # Build tweet parameters
        tweet_params = {"text": tweet_text}

        # Add reply_to if this is a thread reply
        if reply_to_tweet_id:
            tweet_params["in_reply_to_tweet_id"] = reply_to_tweet_id
            log(f"Posting as reply to tweet {reply_to_tweet_id}")

        # Post the tweet
        response = client.create_tweet(**tweet_params)

        tweet_id = response.data["id"]
        tweet_url = f"https://x.com/GenWise_/status/{tweet_id}"

        log(f"SUCCESS: Posted tweet {tweet_id}")
        return {
            "success": True,
            "platform_id": str(tweet_id),
            "platform_url": tweet_url
        }

    except Exception as e:
        log(f"ERROR posting to Twitter: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def update_post_status(post_id: str, result: dict):
    """Update post in Supabase with result."""
    try:
        from supabase import create_client

        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

        if result["success"]:
            update_data = {
                "status": "posted",
                "posted_at": datetime.now(timezone.utc).isoformat(),
                "platform_id": result["platform_id"],
                "platform_url": result["platform_url"],
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        else:
            update_data = {
                "status": "failed",
                "notes": f"Auto-post failed: {result.get('error', 'Unknown error')}",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

        supabase.table("content_posts") \
            .update(update_data) \
            .eq("id", post_id) \
            .execute()

        log(f"Updated post {post_id} status to {update_data['status']}")

    except Exception as e:
        log(f"ERROR updating post {post_id}: {e}")

def main():
    """Main entry point."""
    log("=" * 50)
    log("CM Scheduled Poster - Starting run")

    # Validate credentials
    if not all([SUPABASE_KEY, TWITTER_API_KEY, TWITTER_ACCESS_TOKEN]):
        log("ERROR: Missing required credentials. Check .env file.")
        sys.exit(1)

    # Get due posts (sorted: parents first, then replies by position)
    posts = get_due_posts()

    if not posts:
        log("No scheduled posts due for publishing")
        return

    log(f"Found {len(posts)} post(s) to publish")

    # Track platform_ids we've posted this run (for immediate thread replies)
    posted_this_run = {}  # post_id -> platform_id

    for post in posts:
        post_id = post["id"]
        title = post.get("title", "Untitled")
        parent_post_id = post.get("parent_post_id")
        thread_position = post.get("thread_position", 0)

        log(f"Processing: {title} ({post_id})")

        # Determine if this is a thread reply
        reply_to_tweet_id = None
        if parent_post_id:
            log(f"  Thread reply (position {thread_position}) to parent {parent_post_id}")

            # Check if parent was posted this run
            if parent_post_id in posted_this_run:
                reply_to_tweet_id = posted_this_run[parent_post_id]
                log(f"  Using parent platform_id from this run: {reply_to_tweet_id}")
            else:
                # Check if parent was posted in a previous run
                reply_to_tweet_id = get_parent_platform_id(parent_post_id)
                if reply_to_tweet_id:
                    log(f"  Using parent platform_id from database: {reply_to_tweet_id}")
                else:
                    log(f"  WARNING: Parent post not yet posted, skipping reply")
                    continue  # Skip this reply, parent needs to be posted first

        # Post to Twitter
        result = post_to_twitter(post, reply_to_tweet_id)

        # Track successful posts for thread replies in same run
        if result["success"]:
            posted_this_run[post_id] = result["platform_id"]

        # Update status in database
        update_post_status(post_id, result)

    log("Run complete")
    log("=" * 50)

if __name__ == "__main__":
    main()
