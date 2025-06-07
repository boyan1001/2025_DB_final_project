from flask import Blueprint, jsonify
from utils.db import query_all

review_bp = Blueprint("review", __name__)

@review_bp.route("/api/reviews/<restaurant_id>")
def get_reviews(restaurant_id):
    return jsonify(query_all("SELECT * FROM Reviews WHERE restaurant_id = %s", (restaurant_id,)))