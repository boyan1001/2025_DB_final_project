from flask import Blueprint, jsonify, request
from db_config import get_db_connection
from utils.db import query_all
import os, base64

def generate_unique_restaurant_id():
    while True:
        rand = os.urandom(9)
        candidate = "ChIJ" + base64.urlsafe_b64encode(rand).decode("utf-8").rstrip("=")
        exists = query_all("SELECT 1 FROM Restaurant WHERE restaurant_id = %s", (candidate,))
        if not exists:
            return candidate

auth_bp = Blueprint("auth", __name__)

# 查詢所有使用者
@auth_bp.route("/api/users")
def get_users():
    return jsonify(query_all("SELECT * FROM User"))

# 註冊使用者
@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "user")

    if not username or not password:
        return jsonify({"error": "缺少 username 或 password"}), 400

    # 檢查是否重複帳號
    existing = query_all("SELECT * FROM User WHERE username = %s", (username,))
    if existing:
        return jsonify({"error": "帳號已存在"}), 409

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # ✅ 一起用 transaction 包起來
        cursor.execute(
            "INSERT INTO User (username, password, role) VALUES (%s, %s, %s)",
            (username, password, role)
        )
        user_id = cursor.lastrowid

        # 如果是店家，要同時建立餐廳
        if role == "owner":
            restaurant_id = generate_unique_restaurant_id()
            rest = data.get("restaurant")
            if not rest:
                raise Exception("缺少餐廳資料")

            # 驗證基本欄位
            if not rest.get("name") or not rest.get("address") or not rest.get("phone"):
                raise Exception("❌ 餐廳資料不完整")

            cursor.execute("""
                INSERT INTO Restaurant (
                    restaurant_id, owner_id, name, address, phone,
                    price_range, cuisine_type, rating, cover,
                    county, district, station_name
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                restaurant_id,
                user_id,
                rest.get("name"),
                rest.get("address"),
                rest.get("phone"),
                rest.get("price_range"),
                rest.get("cuisine_type"),
                0,  # 初始評分
                rest.get("cover"),
                rest.get("county", ""),
                rest.get("district", ""),
                rest.get("station_name", "")
            ))

        # ✅ 所有操作都成功才 commit
        conn.commit()
        return jsonify({
            "message": "✅ 註冊成功",
            "user_id": user_id
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# 登入驗證
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = query_all(
        "SELECT * FROM User WHERE username = %s AND password = %s",
        (username, password)
    )

    if user:
        return jsonify({"message": "✅ 登入成功", "user": user[0]})
    else:
        return jsonify({"error": "❌ 帳號或密碼錯誤"}), 401

# 修改使用者資料
@auth_bp.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE User SET username=%s, password=%s, role=%s WHERE user_id=%s",
            (username, password, role, user_id)
        )
        conn.commit()
        return jsonify({"message": "✅ 使用者資料已更新"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 刪除使用者
@auth_bp.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM User WHERE user_id = %s", (user_id,))
        conn.commit()
        return jsonify({"message": "✅ 使用者已刪除"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()