from flask import Blueprint, jsonify, request
from utils.db import query_all

image_bp = Blueprint('image', __name__)

@image_bp.route('/api/images', methods=['GET'])
def get_all_images():
    sql = "SELECT * FROM Image"
    return jsonify(query_all(sql))

@image_bp.route('/api/images/<restaurant_id>', methods=['GET'])
def get_images_by_restaurant(restaurant_id):
    sql = "SELECT * FROM Image WHERE restaurant_id = %s"
    return jsonify(query_all(sql, (restaurant_id,)))