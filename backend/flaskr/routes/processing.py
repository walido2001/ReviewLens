import threading
from flask import Blueprint, request, jsonify, current_app
from .. import create_app

from ..services.googlePlayStore import validate_ID
from ..services.reviewExtraction import extract_reviews
from ..services.topicExtraction import extract_topics
from ..services.reviewTopicLinkage import link_topics_reviews
from ..services.sentimentAnalysis import analyze_sentiment

processing_blueprint = Blueprint("api", __name__)


@processing_blueprint.route("/test/reviewExtraction", methods=["POST"])
def test_review_extraction():
    data = request.get_json()
    appID = data.get("appID")

    if not appID:
        return jsonify({"Error": "Input is missing AppID."}), 400

    def extract_reviews_contexted(appID):
        app = create_app()
        with app.app_context():
            extract_reviews(appID)

    thread = threading.Thread(target=extract_reviews_contexted, args=(appID,))
    thread.daemon = True
    thread.start()

    # extract_topics(appID)
    # link_topics_reviews(appID)
    # analyze_sentiment(appID)

    return jsonify({"status": "Request received"}), 202

@processing_blueprint.route("/test/sentimentAnalysis", methods=["POST"])
def test_sentiment_analysis():
    data = request.get_json()
    appID = data.get("appID")

    if not appID:
        return jsonify({"Error": "Input is missing AppID."}), 400

    def analyze_sentiment_contexted(appID):
        app = create_app()
        with app.app_context():
            from ..services.sentimentAnalysis import analyze_sentiment
            analyze_sentiment(appID)

    thread = threading.Thread(target=analyze_sentiment_contexted, args=(appID,))
    thread.daemon = True
    thread.start()

    return jsonify({"status": "Request received"}), 202

@processing_blueprint.route("/test/topicExtraction", methods=["POST"])
def test_topic_extraction():
    data = request.get_json()
    appID = data.get("appID")

    if not appID:
        return jsonify({"Error": "Input is missing AppID."}), 400

    def extract_topics_contexted(appID):
        app = create_app()
        with app.app_context():
            from ..services.topicExtraction import extract_topics
            extract_topics(appID)

    thread = threading.Thread(target=extract_topics_contexted, args=(appID,))
    thread.daemon = True
    thread.start()

    return jsonify({"status": "Request received"}), 202

@processing_blueprint.route("/startProcessing", methods=["POST"])
def start_processing():
    data = request.get_json()
    appID = data.get("appID")

    extract_reviews(appID)
    # extract_topics(appID)
    # link_topics_reviews(appID)
    # analyze_sentiment(appID)

    return "This is the API route"