from flask import Blueprint, request, jsonify

customer_blueprint = Blueprint("customer", __name__)

@customer_blueprint.route("/", methods=["GET"])
def hello():
    return "This is the customer route"