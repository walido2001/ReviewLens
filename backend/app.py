from flask import Flask
from database import db
from routes.processing import processing_blueprint
from routes.customer import customer_blueprint
from logger import logger

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://localhost/ReviewLensDB"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

db.init_app(app)

with app.app_context():
    try:
        db.create_all()
        logger.info("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        logger.error(f"Error creating database tables: {e}")

app.register_blueprint(processing_blueprint, url_prefix="/processing")
app.register_blueprint(customer_blueprint, url_prefix="/customer")


@app.route('/')
def searchApp():
    return 'Hello this is Review Lens'
