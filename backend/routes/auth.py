from flask import Blueprint, jsonify, request
from db_config import get_db_connection
from utils.db import query_all

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

    # 檢查是否已存在相同帳號
    existing = query_all("SELECT * FROM User WHERE username = %s", (username,))
    if existing:
        return jsonify({"error": "帳號已存在"}), 409

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO User (username, password, role) VALUES (%s, %s, %s)",
            (username, password, role)
        )
        conn.commit()
        return jsonify({"message": "✅ 註冊成功"})
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