from flask import Blueprint, request, jsonify

from services.googlePlayStore import validate_ID
from services.reviewExtraction import extract_reviews
from services.topicExtraction import extract_topics
from services.reviewTopicLinkage import link_topics_reviews
from services.sentimentAnalysis import analyze_sentiment

processing_blueprint = Blueprint("api", __name__)

@processing_blueprint.route("/startProcessing", methods=["POST"])
def start_processing():
    data = request.get_json()
    appID = data.get("appID")

    extract_reviews(appID)
    extract_topics(appID)
    link_topics_reviews(appID)
    analyze_sentiment(appID)

    return "This is the API route"