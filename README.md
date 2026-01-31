# AI Content Machine

Automated system that generates 1 LinkedIn post + 1 Twitter thread daily about trending AI topics, matching Tal Hacmon's writing style and perspective.

## How It Works

```
6:00 AM IST  →  Collect AI news + trending tweets
             →  Rank topics (top 3 by engagement, recency, relevance)
             →  Generate LinkedIn post + Twitter thread via Claude API
             →  Review & edit in local dashboard
9:00 AM IST  →  Publish LinkedIn post
12:00 PM IST →  Publish Twitter thread
```

## Quick Start

### 1. Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure API Keys

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

| Key | Required | Notes |
|-----|----------|-------|
| `CLAUDE_API_KEY` | Yes | For content generation |
| `LINKEDIN_CLIENT_ID` | For publishing | LinkedIn API OAuth |
| `LINKEDIN_CLIENT_SECRET` | For publishing | LinkedIn API OAuth |
| `LINKEDIN_ACCESS_TOKEN` | For publishing | LinkedIn API OAuth |
| `TWITTER_API_KEY` | Optional | Falls back to Nitter scraping |
| `TWITTER_API_SECRET` | Optional | Falls back to Nitter scraping |
| `TWITTER_ACCESS_TOKEN` | Optional | For publishing threads |
| `TWITTER_ACCESS_SECRET` | Optional | For publishing threads |
| `SLACK_WEBHOOK_URL` | Optional | For notifications |

### 3. Initialize Database

```bash
python run.py init
```

### 4. Run the Pipeline

```bash
# Full pipeline: collect → rank → generate
python run.py pipeline

# Or run steps individually:
python run.py collect     # Scrape news + tweets
python run.py rank        # Rank top 3 topics
python run.py generate    # Generate posts for top topic
```

### 5. Review & Edit

```bash
python run.py dashboard
# Opens at http://127.0.0.1:5000
```

The dashboard lets you:
- Edit LinkedIn post and Twitter thread before publishing
- See source articles/tweets with links
- View alternative topics (#2 and #3)
- Check previous day's post for style consistency
- Approve, regenerate, or pick a different topic

### 6. Publish

```bash
# After approving posts in the dashboard:
python run.py publish
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `python run.py pipeline` | Full daily pipeline (collect → rank → generate) |
| `python run.py collect` | Data collection only |
| `python run.py rank` | Topic ranking only |
| `python run.py generate` | Content generation for today's top topic |
| `python run.py publish` | Publish approved posts |
| `python run.py dashboard` | Start review dashboard |
| `python run.py init` | Initialize database |

## Automated Scheduling (Cron)

Add to crontab (`crontab -e`):

```bash
# Run full pipeline at 6 AM IST (3:30 AM UTC in winter, 3:00 AM UTC in summer)
0 3 * * * cd /path/to/Claude && /path/to/venv/bin/python run.py pipeline

# Publish approved posts at 9 AM IST (LinkedIn)
30 6 * * * cd /path/to/Claude && /path/to/venv/bin/python run.py publish
```

## Project Structure

```
Claude/
├── run.py                          # CLI entry point
├── requirements.txt                # Python dependencies
├── .env.example                    # API key template
├── config/
│   └── settings.py                 # All configuration
├── ai_content_machine/
│   ├── pipeline.py                 # Main orchestrator
│   ├── collectors/
│   │   ├── news_collector.py       # RSS + HackerNews scraping
│   │   └── twitter_collector.py    # Nitter + Twitter API hybrid
│   ├── ranking/
│   │   └── topic_ranker.py         # Topic scoring & ranking
│   ├── generator/
│   │   └── content_generator.py    # Claude API content generation
│   ├── dashboard/
│   │   ├── app.py                  # Flask web interface
│   │   ├── templates/              # HTML templates
│   │   └── static/                 # CSS
│   ├── publisher/
│   │   ├── linkedin_publisher.py   # LinkedIn API integration
│   │   ├── twitter_publisher.py    # Twitter API thread publishing
│   │   └── notifier.py             # Slack notifications
│   └── utils/
│       ├── database.py             # SQLite operations
│       └── logger.py               # Logging setup
├── data/
│   ├── training_posts/             # Tal's example posts for style training
│   │   ├── linkedin_examples.json
│   │   └── twitter_examples.json
│   └── db/                         # SQLite database (auto-created)
└── logs/                           # Log files (auto-created)
```

## Customizing Style & Topics

### Adding Training Posts

Edit `data/training_posts/linkedin_examples.json` and `twitter_examples.json` to add more of Tal's best-performing posts. The content generator uses these as style references.

### Modifying News Sources

Edit `config/settings.py` → `NEWS_SOURCES` to add/remove RSS feeds or change AI keyword filters.

### Changing Twitter Accounts

Edit `config/settings.py` → `TWITTER_ACCOUNTS` to monitor different accounts.

### Adjusting Ranking Weights

Edit `config/settings.py` → `RANKING_WEIGHTS` to prioritize different scoring factors (recency, engagement, business relevance, etc.).

### Changing Post Style

Modify the style guide in `ai_content_machine/generator/content_generator.py` → `_build_style_guide()` to adjust voice, tone, and structure.

## Troubleshooting

### "No topics to rank"
Run `python run.py collect` first. The ranker needs source data.

### "CLAUDE_API_KEY not configured"
Add your Anthropic API key to the `.env` file.

### Nitter scraping fails
Nitter instances go up and down. The system automatically falls back to Twitter API if configured. Update `NITTER_INSTANCES` in settings if needed.

### LinkedIn publishing fails
1. Ensure your OAuth token is fresh (they expire)
2. Check that your LinkedIn app has `w_member_social` permission
3. Verify the access token in `.env`

### Twitter thread publishing fails
1. Check API credentials in `.env`
2. Ensure your Twitter app has write permissions
3. Verify you haven't hit rate limits

### Dashboard won't start
Check that port 5000 is available, or change `DASHBOARD_PORT` in settings.

## Data Sources

| Source | Method | Data Extracted |
|--------|--------|---------------|
| TechCrunch AI | RSS feed | Headlines, summaries, URLs |
| VentureBeat AI | RSS feed | Headlines, summaries, URLs |
| HackerNews | Firebase API | AI stories, scores, comments |
| Product Hunt | RSS feed | AI product launches |
| Twitter/X | Nitter scraping / API v2 | Tweets with 1k+ likes from monitored accounts |
