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
    state_initials = db.Column(db.String(2), nullable=False)
    statefp = db.Column(db.String(2), nullable=False)
    countyfp = db.Column(db.String(3), nullable=False)
    countyns = db.Column(db.String(8), nullable=False)
    county_name = db.Column(db.String(100), nullable=False)
    classfp = db.Column(db.String(2), nullable=False)
    funcstat = db.Column(db.String(1), nullable=False)
    
    
# Fetch county data from the Census Bureau's national file
@app.route("/set_counties/", methods=["GET"])
def set_counties():
    # URL to the national county file
    url = "https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt"
    response = requests.get(url)
    
    data = response.text.splitlines()
    data = data[1:]
    
    # Process each line in the data
    for line in data:
        parts = line.split('|')
        county = County(
            state_initials=parts[0],
            statefp=parts[1],
            countyfp=parts[2],
            countyns=parts[3],
            county_name=parts[4],
            classfp=parts[5],
            funcstat=parts[6]
        )
        print("County", county)
        db.session.add(county)
    
    print("Adding counties to the database")
    db.session.commit()
    return jsonify({"message": "Counties added to the database"})
    
# Get all the counties from the database
@app.route("/counties/", methods=["GET"])
def get_counties():
    counties = County.query.all()
    results = []
    for county in counties:
        print(county.county_name)
        county_name_and_state = f"{county.county_name}, {county.state_initials}"
        results.append(county_name_and_state)
    return jsonify(results)
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5001)