from flask import Flask
from routes.processing import processing_blueprint
from routes.customer import customer_blueprint
app = Flask(__name__)

app.register_blueprint(processing_blueprint, url_prefix="/processing")
app.register_blueprint(customer_blueprint, url_prefix="/customer")


@app.route('/')
def searchApp():
    return 'Hello this is Review Lens'
