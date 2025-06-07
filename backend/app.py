from flask import Flask
from routes.auth import auth_bp
from routes.restaurant import restaurant_bp
from routes.review import review_bp
from routes.favorite import favorite_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(restaurant_bp)
app.register_blueprint(review_bp)
app.register_blueprint(favorite_bp)

@app.route("/")
def hello():
    return {"message": "✅ API is running."}

if __name__ == "__main__":
    app.run(debug=True)