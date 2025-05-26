from google_play_scraper import app as appScraper, reviews_all, Sort, reviews
from datetime import datetime
from flask import current_app
from sqlalchemy import select
from .. import db
from ..models import App, Review
from ..logger import get_logger

logger = get_logger(__name__)

def sanitize_review_data(review_data, app_id):
    try:
        username = review_data['userName']
        if len(username) > 50:
            username = username[:50]
            logger.warning(f"Username truncated to 50 characters: {username}")

        rating = int(review_data['score'])
        if rating < 1:
            rating = 1
        elif rating > 5:
            rating = 5

        content = str(review_data['content'])

        if isinstance(review_data['at'], datetime):
            date = review_data['at']
        else:
            date = datetime.now(datetime.timezone.utc)

        return Review(
            app_id=app_id,
            name=username,
            rating=rating,
            content=content,
            date=date
        )
    except Exception as e:
        logger.error(f"Error sanitizing review data: {str(e)}")
        raise

def extract_reviews(appID, limit=30000):
    try:
        app_data = appScraper(appID, lang='en', country='us')
        app_record = App(
            id=appID,
            name=app_data['title'],
            description=app_data['description']
        )
        
        app_exec = db.session.execute(select(App).filter_by(id=appID)).scalar_one_or_none()
        if app_exec:
            logger.info(f"App {appID} already exists. Deleting existing records to refresh data.")
            db.session.delete(app_exec)
            db.session.commit()

        db.session.add(app_record)
        db.session.commit()

        review_count = 0
        skipped_count = 0
        batch_size = 200
        batch_count = 0
        batch_limit = 1000

        scrape_results, continuation_token = reviews(
            appID, 
            lang='en', 
            sort=Sort.NEWEST, 
            count=batch_size
        )
        
        while review_count < limit and scrape_results:
            for review in scrape_results:
                try:
                    review_row = sanitize_review_data(review, appID)
                    review_count += 1
                    batch_count += 1
                    db.session.add(review_row)
                except Exception as e:
                    skipped_count += 1
                    logger.warning(f"Skipping review due to error: {str(e)}")
                    continue

            if batch_count >= batch_limit:
                logger.info(f"[IN PROGRESS] Committed a batch of {batch_count} reviews. Total so far: {review_count} (Skipped: {skipped_count})")
                db.session.commit()
                batch_count = 0

            scrape_results, continuation_token = reviews(
                appID, 
                lang='en', 
                sort=Sort.NEWEST, 
                count=batch_size, 
                continuation_token=continuation_token
            )

        if batch_count > 0:
            logger.info(f"[IN PROGRESS] Committing final batch of {batch_count} reviews")
            db.session.commit()

        logger.info(f"[COMPLETE] Completed scraping reviews for app {app_record.name} with a total of {review_count} reviews (Skipped: {skipped_count}).")
        
    except Exception as e:
        logger.error(f"Review extraction for app {appID} failed: {str(e)}", exc_info=True)
        db.session.rollback()
        raise