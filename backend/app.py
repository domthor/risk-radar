import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
app = Flask(__name__)
CORS(app) 

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# County Model
class County(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    county_name = db.Column(db.String(100), nullable=False)
    
# Get all of the counties from the Census API
@app.route("/set_counties/", methods=["GET"])
def set_counties():
    # Make a request to the Census API for all of the counties
    response = requests.get("https://api.census.gov/data/2023/acs/acs5?get=NAME&for=county:*")
    data = response.json()
    
    if data is not None:
        print('Clearing existing counties')
        db.session.query(County).delete()
        db.session.commit()
    
    # Update the database with the counties and their IDs
    for i in range(1, len(data)):
        county_name = data[i][0]
        db.session.add(County(county_name=county_name))
    
    print('Adding counties to the database')
    db.session.commit()
    return jsonify({"message": "Counties added to the database"})

    
# Get all the counties from the database
@app.route("/counties/", methods=["GET"])
def get_counties():
    counties = County.query.all()
    return jsonify([
        {
            "county_name": county.county_name
        }
        for county in counties
    ])

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)