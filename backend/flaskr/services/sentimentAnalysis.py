from textblob import TextBlob
from ..models import Review
from .. import db, logger

def analyze_sentiment(app_id: str, batch_size: int = 500):
    try:
        
        reviews = Review.query.filter_by(app_id=app_id).all()
        
        if not reviews:
            logger.warning(f"No reviews found for app_id: {app_id}")
            return
            
        processed_count = 0
        total_reviews = len(reviews)
        
        for review in reviews:
            try:
                
                blob = TextBlob(review.content)
                sentiment_score = round(blob.sentiment.polarity, 1)
                
                
                review.sentiment_score = sentiment_score
                db.session.add(review)
                processed_count += 1
                
                
                if processed_count % batch_size == 0:
                    db.session.commit()
                    logger.info(f"Processed {processed_count}/{total_reviews} reviews for app_id: {app_id}")
                
            except Exception as e:
                logger.error(f"Error processing review {review.id}: {str(e)}")
                continue
        
        
        if processed_count % batch_size != 0:
            db.session.commit()
            
        logger.info(f"Successfully analyzed sentiments for app_id: {app_id}. Processed {processed_count}/{total_reviews} reviews")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Critical error in sentiment analysis for app_id {app_id}: {str(e)}")
        raise