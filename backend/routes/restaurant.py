from flask import Blueprint, jsonify
from utils.db import query_all

restaurant_bp = Blueprint("restaurant", __name__)

@restaurant_bp.route("/api/restaurants")
def get_restaurants():
    return jsonify(query_all("SELECT * FROM Restaurant"))

@restaurant_bp.route("/api/images/<restaurant_id>")
def get_images(restaurant_id):
    return jsonify(query_all("SELECT * FROM Image WHERE restaurant_id = %s", (restaurant_id,)))