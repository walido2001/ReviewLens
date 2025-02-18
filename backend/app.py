from flask import Flask
from database import db
from routes.processing import processing_blueprint
from routes.customer import customer_blueprint

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://localhost/ReviewLensDB"
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(processing_blueprint, url_prefix="/processing")
app.register_blueprint(customer_blueprint, url_prefix="/customer")



@app.route('/')
def searchApp():
    return 'Hello this is Review Lens'
