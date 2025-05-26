import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import re
from typing import List, Optional, Tuple
from langdetect import detect, LangDetectException
from ..models import Review, Topic, App
from .. import db, logger

try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

def is_english(text: str) -> bool:
    try:
        return detect(text) == 'en'
    except LangDetectException:
        return False
    except Exception as e:
        logger.error(f"Error detecting language: {str(e)}")
        return False

def clean_text(text: str) -> Optional[str]:
    try:
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        lemmatizer = WordNetLemmatizer()
        cleaned_tokens = [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words and len(token) > 2]
        return ' '.join(cleaned_tokens)
    except Exception as e:
        logger.error(f"Error cleaning text: {str(e)}")
        return None

def process_review_batch(reviews_batch: List[Review]) -> Tuple[List[str], int]:
    cleaned_texts = []
    non_english_count = 0
    
    for review in reviews_batch:
        try:
            if not is_english(review.content):
                non_english_count += 1
                continue
                
            cleaned_text = clean_text(review.content)
            if cleaned_text:
                cleaned_texts.append(cleaned_text)
        except Exception as e:
            logger.error(f"Error processing review {review.id}: {str(e)}")
            continue
            
    return cleaned_texts, non_english_count

def initialize_models(num_topics: int) -> Tuple[CountVectorizer, LatentDirichletAllocation]:
    vectorizer = CountVectorizer(
        max_df=0.5,
        min_df=2,
        stop_words='english',
        max_features=1000
    )
    
    lda_model = LatentDirichletAllocation(
        n_components=num_topics,
        max_iter=10,
        learning_method='online',
        random_state=42,
        batch_size=128,
        verbose=0
    )
    
    return vectorizer, lda_model

def update_lda_model(cleaned_texts: List[str], vectorizer: CountVectorizer, lda_model: LatentDirichletAllocation, is_first_batch: bool = False) -> None:
    if is_first_batch:
        X = vectorizer.fit_transform(cleaned_texts)
        lda_model.fit(X)
    else:
        X = vectorizer.transform(cleaned_texts)
        lda_model.partial_fit(X)

def get_topic_words(vectorizer: CountVectorizer, lda_model: LatentDirichletAllocation, topic_id: int, words_per_topic: int) -> List[str]:
    feature_names = vectorizer.get_feature_names_out()
    topic_components = lda_model.components_[topic_id]
    top_indices = topic_components.argsort()[:-words_per_topic-1:-1]
    return [feature_names[i] for i in top_indices]

def save_topics(vectorizer: CountVectorizer, lda_model: LatentDirichletAllocation, app_id: str, num_topics: int, words_per_topic: int) -> None:
    for topic_id in range(num_topics):
        try:
            topic_words = get_topic_words(vectorizer, lda_model, topic_id, words_per_topic)
            topic_content = ', '.join(topic_words)
            topic = Topic(app_id=app_id, content=topic_content)
            db.session.add(topic)
        except Exception as e:
            logger.error(f"Error saving topic {topic_id}: {str(e)}")
            continue
    
    db.session.commit()

def extract_topics(app_id: str, num_topics: int = 10, words_per_topic: int = 8, batch_size: int = 1000) -> None:
    try:
        app = App.query.get(app_id)
        if not app:
            logger.error(f"App with ID {app_id} not found")
            return

        existing_topics = Topic.query.filter_by(app_id=app_id).all()
        if existing_topics:
            logger.info(f"Found {len(existing_topics)} existing topics for app {app_id}. Removing them...")
            for topic in existing_topics:
                db.session.delete(topic)
            db.session.commit()
            logger.info("Existing topics removed successfully")
            
        Review.query.filter_by(app_id=app_id).update({Review.topic_id: None})
        db.session.commit()
        logger.info("Reset topic_id for all reviews")

        total_reviews = Review.query.filter_by(app_id=app_id).count()
        if total_reviews == 0:
            logger.warning(f"No reviews found for app_id: {app_id}")
            return

        processed_count = 0
        total_non_english = 0
        has_valid_texts = False
        
        vectorizer, lda_model = initialize_models(num_topics)
        
        while processed_count < total_reviews:
            reviews_batch = Review.query.filter_by(app_id=app_id).offset(processed_count).limit(batch_size).all()
            cleaned_texts, non_english_count = process_review_batch(reviews_batch)
            total_non_english += non_english_count
            
            if cleaned_texts:
                has_valid_texts = True
                try:
                    update_lda_model(cleaned_texts, vectorizer, lda_model, is_first_batch=(processed_count == 0))
                except Exception as e:
                    logger.error(f"Error in batch processing: {str(e)}")
                    continue
            
            processed_count += len(reviews_batch)
            logger.info(f"Processed {processed_count}/{total_reviews} reviews for app_id: {app_id}. Omitted {total_non_english} non-english reviews.")
        
        if not has_valid_texts:
            logger.warning(f"No valid texts found for topic modeling for app_id: {app_id}")
            return
            
        try:
            save_topics(vectorizer, lda_model, app_id, num_topics, words_per_topic)
            logger.info(f"Successfully extracted {num_topics} topics for app_id: {app_id}. Skipped {total_non_english} non-English reviews.")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in LDA modeling for app_id {app_id}: {str(e)}")
            raise
            
    except Exception as e:
        logger.error(f"Critical error in topic extraction for app_id {app_id}: {str(e)}")
        raise