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

FEMA_API_URL = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
CENSUS_API_URL = "https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt"

# County Model
class County(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state_initials = db.Column(db.String(2), nullable=False)
    statefp = db.Column(db.String(2), nullable=False)
    countyfp = db.Column(db.String(3), nullable=False)
    county_name = db.Column(db.String(100), nullable=False)
    
    
# Fetch county data from the Census Bureau's national file
@app.route("/set_counties/", methods=["GET"])
def set_counties():
    # URL to the national county file
    url = CENSUS_API_URL
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
            county_name=parts[4],
        )
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
        results.append({
            "countyName": f"{county.county_name}, {county.state_initials}",
            "fipsStateCode": county.statefp,
            "fipsCountyCode": county.countyfp,
        })
    return jsonify(results)

# Get score for a county
@app.route("/disaster_summaries/", methods=["GET"])
def get_disaster_summaries():
    
    # Get query parameters
    fips_state = request.args.get("fipsStateCode")
    fips_county = request.args.get("fipsCountyCode")
    
    # Validate parameters
    if not fips_state or not fips_county:
        return jsonify({"error": "Both fipsStateCode and fipsCountyCode are required"}), 400
    
    # Construct API filter query
    filter_query = f"$filter=fipsStateCode eq '{fips_state}' and fipsCountyCode eq '{fips_county}'"
    
    # Make request to FEMA API
    response = requests.get(f"{FEMA_API_URL}?{filter_query}")
    
    # Check if request was successful
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from FEMA API"}), response.status_code
    
    # Return JSON response
    return jsonify(response.json())
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5001)