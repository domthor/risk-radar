from datetime import datetime
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import time
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
    if data is not None:
        print("Clearing duplicate county data.")
        db.session.query(County).delete()
        db.session.commit()
    
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
            "stateInitials": county.state_initials,
            "countyName": f"{county.county_name}, {county.state_initials}",
            "fipsStateCode": county.statefp,
            "fipsCountyCode": county.countyfp,
        })

    return jsonify(results)

# Get disaster summaries from the FEMA API
@app.route("/api/disaster_summaries/", methods=["GET"])
def get_disaster_summaries():
    
    # Get query parameters
    fips_state = request.args.get("fipsStateCode")
    fips_county = request.args.get("fipsCountyCode")
    
    # Validate parameters
    if fips_state and fips_county:
        filter_query = f"?$filter=fipsStateCode eq '{fips_state}' and fipsCountyCode eq '{fips_county}'"
    elif fips_state:
        filter_query = f"?$filter=fipsStateCode eq '{fips_state}'"
    else:
        filter_query = ""
    
    
    try:
        response = requests.get(f"{FEMA_API_URL}{filter_query}")
        response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
        data = response.json()  # Ensure we parse JSON
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

    # Extract and sort summaries
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid response format from API"}), 500
    summaries = data.get("DisasterDeclarationsSummaries", [])
    summaries.sort(key=lambda s: datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ"), reverse=True)
    
    # Count hazard occurrences
    counts = {}
    for summary in summaries:
        incident_type = summary.get("incidentType")
        if incident_type:
            counts[incident_type] = counts.get(incident_type, 0) + 1
            
    # Find the oldest disaster year
    oldest_date = (
        min(
            (datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ") for s in summaries),
            default=None,
        )
    )
    oldest_year = oldest_date.year if oldest_date else None
    
    result = {
        "summaries": summaries,
        "counts": counts,
        "oldestYear": oldest_year,
        "title": f"Disaster Declarations Summaries Since {oldest_year}",
    }
    return result
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5001)