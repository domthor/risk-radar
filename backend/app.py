from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

@app.route("/items", methods=["GET"])
def get_items():
    items = Item.query.all()
    return jsonify([{"id": item.id, "name": item.name} for item in items])

@app.route("/items", methods=["POST"])
def add_item():
    data = request.get_json()
    new_item = Item(name=data["name"])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"id": new_item.id, "name": new_item.name}), 201

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)