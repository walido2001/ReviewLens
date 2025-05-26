import threading
from flask import Blueprint, request, jsonify, current_app, Response
from .. import create_app
import json
import queue
import time

from ..services.googlePlayStore import validate_ID
from ..services.reviewExtraction import extract_reviews
from ..services.topicExtraction import extract_topics
from ..services.reviewTopicLinkage import link_topics_reviews
from ..services.sentimentAnalysis import analyze_sentiment

processing_blueprint = Blueprint("api", __name__)

def process_app(app_id: str, status_queue: queue.Queue):
    """Process the app through all stages and update status through queue."""
    app = create_app()
    with app.app_context():
        try:
            status_queue.put({"stage": "validation", "status": "started"})
            if not validate_ID(app_id):
                status_queue.put({"stage": "validation", "status": "failed", "error": "Invalid App ID"})
                return
            status_queue.put({"stage": "validation", "status": "completed"})

            status_queue.put({"stage": "review_extraction", "status": "started"})
            try:
                extract_reviews(app_id)
                status_queue.put({"stage": "review_extraction", "status": "completed"})
            except Exception as e:
                status_queue.put({"stage": "review_extraction", "status": "failed", "error": str(e)})
                return

            status_queue.put({"stage": "sentiment_analysis", "status": "started"})
            try:
                analyze_sentiment(app_id)
                status_queue.put({"stage": "sentiment_analysis", "status": "completed"})
            except Exception as e:
                status_queue.put({"stage": "sentiment_analysis", "status": "failed", "error": str(e)})
                return

            status_queue.put({"stage": "topic_extraction", "status": "started"})
            try:
                extract_topics(app_id)
                status_queue.put({"stage": "topic_extraction", "status": "completed"})
            except Exception as e:
                status_queue.put({"stage": "topic_extraction", "status": "failed", "error": str(e)})
                return

            status_queue.put({"stage": "topic_linkage", "status": "started"})
            try:
                link_topics_reviews(app_id)
                status_queue.put({"stage": "topic_linkage", "status": "completed"})
            except Exception as e:
                status_queue.put({"stage": "topic_linkage", "status": "failed", "error": str(e)})
                return

            status_queue.put({"stage": "all", "status": "completed"})

        except Exception as e:
            status_queue.put({"stage": "all", "status": "failed", "error": str(e)})

@processing_blueprint.route("/process", methods=["POST"])
def process_app_endpoint():
    """Endpoint to process an app through all stages with live status updates."""
    data = request.get_json()
    app_id = data.get("appID")

    if not app_id:
        return jsonify({"error": "Input is missing AppID."}), 400

    status_queue = queue.Queue()

    def generate():
        app = create_app()
        with app.app_context():
            thread = threading.Thread(target=process_app, args=(app_id, status_queue))
            thread.daemon = True
            thread.start()

            while True:
                try:
                    status = status_queue.get(timeout=1)
                
                    if status["stage"] == "all":
                        yield f"data: {json.dumps(status)}\n\n"
                        break
                        
                    yield f"data: {json.dumps(status)}\n\n"
                    
                except queue.Empty:
                    yield f"data: {json.dumps({'status': 'heartbeat'})}\n\n"
                    continue

    return Response(generate(), mimetype='text/event-stream')

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

@processing_blueprint.route("/test/reviewTopicLinkage", methods=["POST"])
def test_review_topic_linkage():
    data = request.get_json()
    appID = data.get("appID")

    if not appID:
        return jsonify({"Error": "Input is missing AppID."}), 400

    def link_topics_contexted(appID):
        app = create_app()
        with app.app_context():
            from ..services.reviewTopicLinkage import link_topics_reviews
            link_topics_reviews(appID)

    thread = threading.Thread(target=link_topics_contexted, args=(appID,))
    thread.daemon = True
    thread.start()

    return jsonify({"status": "Request received"}), 202

