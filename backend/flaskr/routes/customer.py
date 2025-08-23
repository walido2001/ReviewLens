from flask import Blueprint, request, jsonify
from sqlalchemy import func
from ..models import App, Review, Topic
from .. import db

customer_blueprint = Blueprint("customer", __name__)

@customer_blueprint.route("/", methods=["GET"])
def hello():
    return "This is the customer route"

@customer_blueprint.route("/reviews", methods=["GET"])
def get_reviews():
    try:
        app_id = request.args.get("appID")
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        if not app_id:
            return jsonify({"error": "AppID is required"}), 400

        reviews = Review.query.filter_by(app_id=app_id)\
            .order_by(Review.date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "reviews": [{
                "id": review.id,
                "name": review.name,
                "rating": review.rating,
                "content": review.content,
                "date": review.date.isoformat(),
                "sentiment_score": review.sentiment_score,
                "topic_id": review.topic_id
            } for review in reviews.items],
            "total": reviews.total,
            "pages": reviews.pages,
            "current_page": reviews.page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/topics", methods=["GET"])
def get_topics():
    try:
        app_id = request.args.get("appID")

        if not app_id:
            return jsonify({"error": "AppID is required"}), 400

        topics = Topic.query.filter_by(app_id=app_id).all()

        return jsonify({
            "topics": [{
                "id": topic.id,
                "content": topic.content
            } for topic in topics]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/app", methods=["GET"])
def get_app():
    try:
        app_id = request.args.get("appID")
        app_name = request.args.get("appName")

        if not app_id and not app_name:
            return jsonify({"error": "Either AppID or AppName is required"}), 400

        query = App.query
        if app_id:
            query = query.filter_by(id=app_id)
        if app_name:
            query = query.filter_by(name=app_name)

        app = query.first()
        if not app:
            return jsonify({"error": "App not found"}), 404

        return jsonify({
            "id": app.id,
            "name": app.name,
            "description": app.description
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/reviews/topic", methods=["GET"])
def get_reviews_by_topic():
    try:
        app_id = request.args.get("appID")
        topic_content = request.args.get("topic")
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        if not app_id or not topic_content:
            return jsonify({"error": "Both AppID and topic content are required"}), 400

        topic = Topic.query.filter_by(app_id=app_id, content=topic_content).first()
        if not topic:
            return jsonify({"error": "Topic not found"}), 404

        reviews = Review.query.filter_by(app_id=app_id, topic_id=topic.id)\
            .order_by(Review.date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "reviews": [{
                "id": review.id,
                "name": review.name,
                "rating": review.rating,
                "content": review.content,
                "date": review.date.isoformat(),
                "sentiment_score": review.sentiment_score
            } for review in reviews.items],
            "total": reviews.total,
            "pages": reviews.pages,
            "current_page": reviews.page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/reviews/rating", methods=["GET"])
def get_reviews_by_rating():
    try:
        app_id = request.args.get("appID")
        rating = request.args.get("rating", type=int)
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        if not app_id or not rating:
            return jsonify({"error": "Both AppID and rating are required"}), 400

        if not 1 <= rating <= 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400

        reviews = Review.query.filter_by(app_id=app_id, rating=rating)\
            .order_by(Review.date.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "reviews": [{
                "id": review.id,
                "name": review.name,
                "rating": review.rating,
                "content": review.content,
                "date": review.date.isoformat(),
                "sentiment_score": review.sentiment_score,
                "topic_id": review.topic_id
            } for review in reviews.items],
            "total": reviews.total,
            "pages": reviews.pages,
            "current_page": reviews.page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/sentiment/avg", methods=["GET"])
def get_avg_sentiment_score():
    try:
        app_id = request.args.get("appID")

        if not app_id:
            return jsonify({"error": "AppID is required"}), 400

        avg_sentiment = db.session.query(func.avg(Review.sentiment_score))\
            .filter_by(app_id=app_id)\
            .scalar()

        return jsonify({
            "app_id": app_id,
            "avg_sentiment_score": round(float(avg_sentiment or 0), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/rating/avg", methods=["GET"])
def get_avg_rating():
    try:
        app_id = request.args.get("appID")

        if not app_id:
            return jsonify({"error": "AppID is required"}), 400

        avg_rating = db.session.query(func.avg(Review.rating))\
            .filter_by(app_id=app_id)\
            .scalar()

        return jsonify({
            "app_id": app_id,
            "avg_rating": round(float(avg_rating or 0), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/apps", methods=["GET"])
def get_all_apps():
    try:
        apps = App.query.all()

        return jsonify({
            "apps": [{
                "id": app.id,
                "name": app.name,
                "description": app.description
            } for app in apps]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@customer_blueprint.route("/reviews/rating-breakdown", methods=["GET"])
def get_rating_breakdown():
    try:
        app_id = request.args.get("appID")

        if not app_id:
            return jsonify({"error": "AppID is required"}), 400

        # Query to get count of reviews for each rating
        rating_counts = db.session.query(
            Review.rating,
            func.count(Review.id).label('count')
        ).filter_by(app_id=app_id)\
         .group_by(Review.rating)\
         .order_by(Review.rating)\
         .all()

        # Format the response as requested
        breakdown = [
            {"rating": str(rating), "count": str(count)} 
            for rating, count in rating_counts
        ]

        return jsonify({
            "app_id": app_id,
            "rating_breakdown": breakdown
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@customer_blueprint.route("/reviews/rating-trend", methods=["GET"])
def get_rating_trend():
    try:
        app_id = request.args.get("appID")
        period = request.args.get("period", "daily")  # daily, weekly, monthly
        
        if not app_id:
            return jsonify({"error": "AppID is required"}), 400
        
        # Query reviews with date and rating
        reviews = Review.query.filter_by(app_id=app_id)\
            .order_by(Review.date.asc())\
            .all()
        
        if not reviews:
            return jsonify({
                "app_id": app_id,
                "period": period,
                "trend_data": [],
                "trend_statistics": {
                    "change": "0.00",
                    "percentageChange": "0.0",
                    "direction": "stable"
                }
            })
        
        # Group by time period and calculate averages
        trend_data = []
        
        if period == "daily":
            # Group by day
            daily_groups = {}
            for review in reviews:
                date_key = review.date.strftime('%Y-%m-%d')
                if date_key not in daily_groups:
                    daily_groups[date_key] = []
                daily_groups[date_key].append(review.rating)
            
            # Calculate daily averages
            for date, ratings in sorted(daily_groups.items()):
                avg_rating = sum(ratings) / len(ratings)
                trend_data.append({
                    "date": date,
                    "avg_rating": round(avg_rating, 2),
                    "review_count": len(ratings)
                })
        
        elif period == "weekly":
            # Group by week
            weekly_groups = {}
            for review in reviews:
                year, week, _ = review.date.isocalendar()
                date_key = f"{year}-W{week:02d}"
                if date_key not in weekly_groups:
                    weekly_groups[date_key] = []
                weekly_groups[date_key].append(review.rating)
            
            # Calculate weekly averages
            for date, ratings in sorted(weekly_groups.items()):
                avg_rating = sum(ratings) / len(ratings)
                trend_data.append({
                    "date": date,
                    "avg_rating": round(avg_rating, 2),
                    "review_count": len(ratings)
                })
        
        elif period == "monthly":
            # Group by month
            monthly_groups = {}
            for review in reviews:
                date_key = review.date.strftime('%Y-%m')
                if date_key not in monthly_groups:
                    monthly_groups[date_key] = []
                monthly_groups[date_key].append(review.rating)
            
            # Calculate monthly averages
            for date, ratings in sorted(monthly_groups.items()):
                avg_rating = sum(ratings) / len(ratings)
                trend_data.append({
                    "date": date,
                    "avg_rating": round(avg_rating, 2),
                    "review_count": len(ratings)
                })
        
        # Calculate trend statistics
        trend_statistics = calculate_trend_statistics(trend_data)
        
        return jsonify({
            "app_id": app_id,
            "period": period,
            "trend_data": trend_data,
            "trend_statistics": trend_statistics
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def calculate_trend_statistics(trend_data):
    """
    Calculate trend statistics from trend data
    """
    if len(trend_data) < 2:
        return {
            "change": "0.00",
            "percentageChange": "0.0",
            "direction": "stable"
        }
    
    # Split data into first and second half
    mid_point = len(trend_data) // 2
    first_half = trend_data[:mid_point]
    second_half = trend_data[mid_point:]
    
    # Calculate averages for each half
    first_avg = sum(item['avg_rating'] for item in first_half) / len(first_half)
    second_avg = sum(item['avg_rating'] for item in second_half) / len(second_half)
    
    # Calculate change and percentage
    change = second_avg - first_avg
    percentage_change = (change / first_avg * 100) if first_avg != 0 else 0
    
    # Determine direction
    if abs(change) < 0.01:  # Consider stable if change is very small
        direction = "stable"
    elif change > 0:
        direction = "up"
    else:
        direction = "down"
    
    return {
        "change": f"{change:.2f}",
        "percentageChange": f"{percentage_change:.1f}",
        "direction": direction
    }