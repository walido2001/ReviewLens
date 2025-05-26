from typing import List, Tuple
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from ..models import App, Review, Topic
from .. import db, logger

def get_topic_distribution(text: str, vectorizer: CountVectorizer, lda_model: LatentDirichletAllocation) -> List[float]:
    """Get the topic distribution for a given text."""
    X = vectorizer.transform([text])
    return lda_model.transform(X)[0]

def link_topics_reviews(app_id: str, batch_size: int = 500) -> None:
    """
    Link reviews to their most relevant topics using LDA topic distributions.
    
    Args:
        app_id (str): The ID of the app to process
        batch_size (int): Number of reviews to process in each batch
    """
    try:
        # Check if app exists and has topics
        app = App.query.get(app_id)
        if not app:
            logger.error(f"App with ID {app_id} not found")
            return
            
        topics = Topic.query.filter_by(app_id=app_id).all()
        if not topics:
            logger.error(f"No topics found for app {app_id}")
            return
            
        # Initialize vectorizer and LDA model with same parameters as topic extraction
        vectorizer = CountVectorizer(
            max_df=0.5,
            min_df=2,
            stop_words='english',
            max_features=1000
        )
        
        lda_model = LatentDirichletAllocation(
            n_components=len(topics),
            max_iter=10,
            learning_method='online',
            random_state=42,
            batch_size=128,
            verbose=0
        )
        
        # Fit vectorizer and LDA model on topic contents
        topic_contents = [topic.content for topic in topics]
        X = vectorizer.fit_transform(topic_contents)
        lda_model.fit(X)
        
        # Process reviews in batches
        total_reviews = Review.query.filter_by(app_id=app_id).count()
        processed_count = 0
        skipped_count = 0
        
        while processed_count < total_reviews:
            reviews_batch = Review.query.filter_by(app_id=app_id).offset(processed_count).limit(batch_size).all()
            batch_skipped = 0
            
            for review in reviews_batch:
                try:
                    # Skip reviews that are too short or already have a topic
                    if len(review.content.split()) < 3 or review.topic_id is not None:
                        continue
                        
                    # Get topic distribution for the review
                    topic_distribution = get_topic_distribution(review.content, vectorizer, lda_model)
                    
                    # Find the topic with highest probability
                    max_prob = max(topic_distribution)
                    if max_prob > 0.1:  # Adjust threshold as needed
                        most_relevant_topic_id = topics[topic_distribution.argmax()].id
                        review.topic_id = most_relevant_topic_id
                    else:
                        batch_skipped += 1
                        
                except Exception as e:
                    logger.error(f"Error processing review {review.id}: {str(e)}")
                    batch_skipped += 1
                    continue
            
            try:
                db.session.commit()
                skipped_count += batch_skipped
                processed_count += len(reviews_batch)
                logger.info(f"Processed {processed_count}/{total_reviews} reviews for app {app_id}. "
                          f"Current batch skipped: {batch_skipped}, Total skipped: {skipped_count}")
            except Exception as e:
                db.session.rollback()
                logger.error(f"Error committing batch for app {app_id}: {str(e)}")
                raise
                
        logger.info(f"Completed topic linkage for app {app_id}. "
                   f"Total reviews processed: {processed_count}, Total skipped: {skipped_count}")
                   
    except Exception as e:
        logger.error(f"Critical error in topic linkage for app {app_id}: {str(e)}")
        raise