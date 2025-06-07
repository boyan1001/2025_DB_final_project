from flask import Blueprint, request, jsonify
from utils.db import query_all, query_one, execute

restaurant_bp = Blueprint("restaurant", __name__, url_prefix="/api/restaurants")

# 📌 新增店家
@restaurant_bp.route("", methods=["POST"])
def create_restaurant():
    data = request.get_json()
    sql = """
        INSERT INTO Restaurant (
            restaurant_id, owner_id, name, address, phone,
            price_range, cuisine_type, rating, cover,
            county, district, station_name
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        data.get("restaurant_id"),
        data.get("owner_id"),
        data.get("name"),
        data.get("address"),
        data.get("phone"),
        data.get("price_range"),
        data.get("cuisine_type"),
        data.get("rating"),
        data.get("cover"),
        data.get("county"),
        data.get("district"),
        data.get("station_name"),
    )
    execute(sql, params)
    return jsonify({"message": "✅ 店家新增成功"}), 201

# ✏️ 編輯店家
@restaurant_bp.route("/<restaurant_id>", methods=["PUT"])
def update_restaurant(restaurant_id):
    data = request.get_json()
    sql = """
        UPDATE Restaurant SET
            name=%s, address=%s, phone=%s,
            price_range=%s, cuisine_type=%s, rating=%s, cover=%s,
            county=%s, district=%s, station_name=%s
        WHERE restaurant_id = %s
    """
    params = (
        data.get("name"),
        data.get("address"),
        data.get("phone"),
        data.get("price_range"),
        data.get("cuisine_type"),
        data.get("rating"),
        data.get("cover"),
        data.get("county"),
        data.get("district"),
        data.get("station_name"),
        restaurant_id
    )
    execute(sql, params)
    return jsonify({"message": "✅ 店家資訊已更新"})

# 🔍 查詢店家（支援條件篩選）
@restaurant_bp.route("", methods=["GET"])
def get_restaurants():
    conditions = []
    values = []

    if q := request.args.get("q"):
        conditions.append("name LIKE %s")
        values.append(f"%{q}%")
    if county := request.args.get("county"):
        conditions.append("county = %s")
        values.append(county)
    if district := request.args.get("district"):
        conditions.append("district = %s")
        values.append(district)
    if station := request.args.get("station"):
        conditions.append("station_name = %s")
        values.append(station)
    if cuisine := request.args.get("cuisine"):
        conditions.append("cuisine_type LIKE %s")
        values.append(f"%{cuisine}%")

    sql = "SELECT * FROM Restaurant"
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)

    results = query_all(sql, values)
    return jsonify(results)