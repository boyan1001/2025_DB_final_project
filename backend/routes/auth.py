from flask import Blueprint, jsonify
from utils.db import query_all

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/users")
def get_users():
    users = query_all("SELECT * FROM User")
    return jsonify(users)