from google_play_scraper import app, reviews_all, Sort, reviews
from datetime import datetime
from database import db, App, Review
from logger import logger
from flask import current_app
from sqlalchemy import select

def extract_reviews(appID, limit=10000):
    try:
        with current_app.app_context():
            app_details = app(appID)
            # Modern query for app
            stmt = select(App).where(App.id == appID)
            app_entry = db.session.execute(stmt).scalar_one_or_none()
            
            if not app_entry:
                app_entry = App(
                    id=appID,
                    name=app_details['title'],
                    description=app_details['description']
                )
                db.session.add(app_entry)
                db.session.commit()
            
            BATCH_SIZE = 1000
            review_batch = []
            batch_count = 0
            total_reviews = 0
            
            # Modern query for existing reviews
            stmt = select(Review.name, Review.date).where(Review.app_id == appID)
            existing_reviews = set(
                (r.name, r.date.isoformat())
                for r in db.session.execute(stmt).all()
            )
            
            logger.info(f"Extracting up to {limit} reviews for app {appID}")
            print(f"Extracting reviews for app {appID} has started")
            
            for review in reviews(appID, lang='en', country='us', count=limit):
                
                review_date = datetime.fromtimestamp(review['at']).date()
                review_key = (review['userName'], review_date.isoformat())
                
                if review_key not in existing_reviews:
                    review_batch.append(Review(
                        app_id=appID,
                        name=review['userName'],
                        rating=review['score'],
                        content=review['content'],
                        date=review_date,
                        topic_id=None,
                        sentiment_score=None
                    ))
                    total_reviews += 1
                
                print(f"Currently examining review {total_reviews} of {limit}")
                
                if len(review_batch) >= BATCH_SIZE:
                    batch_count += 1
                    logger.info(f"Committing batch {batch_count} with {len(review_batch)} reviews for app {appID}")
                    db.session.bulk_save_objects(review_batch)
                    db.session.commit()
                    review_batch = []

            if review_batch:
                batch_count += 1
                logger.info(f"Committing final batch {batch_count} with {len(review_batch)} reviews for app {appID}")
                db.session.bulk_save_objects(review_batch)
                db.session.commit()

            logger.info(f"Completed processing {total_reviews} reviews in {batch_count} batches for app {appID}")
            return {"success": True, "message": f"Successfully extracted {total_reviews} reviews for app {appID}"}
        
    except Exception as e:
        logger.error(f"Error processing reviews for app {appID}: {str(e)}")
        db.session.rollback()
        return {"success": False, "message": f"Error extracting reviews: {str(e)}"}