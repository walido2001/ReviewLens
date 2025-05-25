from google_play_scraper import app as appScraper, reviews_all, Sort, reviews
from datetime import datetime
from flask import current_app
from sqlalchemy import select
from .. import db
from ..models import App, Review
from ..logger import get_logger

logger = get_logger(__name__)

def extract_reviews(appID, limit=10000):
    try:
        app_data = App(appID, lang='en', country='us')
        app_record = App(
            app_id=appID,
            title=app_data['title'],
            developer=app_data['developer'],
            developer_email=app_data['developerEmail'],
            developer_address=app_data['developerAddress'],
            price=app_data['price'],
            )
        
        app_exec = db.session.execute(db.select(App).filter_by(app_id=app_record.app_id)).scalar_one_or_none()
        
        # If app already exists and therefore reviews have been mined, delete (triggering a cascade of review deletions) and re-add new data.
        if app_exec:
            db.session.delete(app_record)
            db.session.commit()

        db.session.add(app_record)
        db.session.commit()

        scraper = appScraper(appID, lang='en', country='us')
        review_count = 0
        batch_count = 0
        batch_limit = 1000
        scrape_results, continuation_token = reviews(appID, lang='en', sort=Sort.NEWEST, count=200)
        while review_count < limit and scrape_results:
            for review in scrape_results:
                review_row = Review(app_id = appID, 
                                    name=review['userName'],
                                    rating=review['score'],
                                    content=review['content'],
                                    date=datetime.now(datetime.timezone.utc)
                                    )
                review_count += 1
                batch_limit += 1
                db.session.add(review_row)
            if batch_count >= batch_limit:
                logger.info(f"[IN PROGRESS] Committed a batch of 200 reviews. Total so far: {review_count}")
                db.session.commit()
            
            scrape_results, continuation_token = reviews(appID, lang='en', sort=Sort.NEWEST, count=200, continuation_token=continuation_token)

        logger.info(f"[COMPLETE] Completed scraping reviews for app {app_record.title} with a total of {review_count} reviews.")
        db.session.commit()
        
        
    except Exception as e:
        logger.error(f"Review extraction for app {appID} failed: {e}", exc_info=True)