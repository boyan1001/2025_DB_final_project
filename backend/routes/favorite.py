from flask import Blueprint, jsonify
from utils.db import query_all

favorite_bp = Blueprint("favorite", __name__)

@favorite_bp.route("/api/favorites/<int:user_id>")
def get_user_favorites(user_id):
    sql = """
        SELECT R.* FROM Favorite F
        JOIN Restaurant R ON F.restaurant_id = R.restaurant_id
        WHERE F.user_id = %s
    """
    return jsonify(query_all(sql, (user_id,)))