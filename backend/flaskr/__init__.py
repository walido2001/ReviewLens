from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .logger import get_logger

db = SQLAlchemy()
logger = get_logger(__name__)

def create_app(config_class=None):
    app = Flask(__name__)
    
    if config_class is None:
        from .config import DevelopmentConfig
        config_class = DevelopmentConfig
    app.config.from_object(config_class)
    
    db.init_app(app)
    
    from .routes.processing import processing_blueprint
    from .routes.customer import customer_blueprint
    
    app.register_blueprint(processing_blueprint, url_prefix="/processing")
    app.register_blueprint(customer_blueprint, url_prefix="/customer")
    
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
    
    @app.route('/')
    def searchApp():
        return 'Hello this is Review Lens'
    
    return app
