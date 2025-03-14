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
BATCH_SIZE = 10000  # Max records per request

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

    # Build filtering query
    if fips_state and fips_county:
        filter_query = f"$filter=fipsStateCode eq '{fips_state}' and fipsCountyCode eq '{fips_county}'"
        level = "County"
    elif fips_state:
        filter_query = f"$filter=fipsStateCode eq '{fips_state}'"
        level = "State"
    else:
        filter_query = ""  # National dataset
        level = "National"

    print(f"Fetching FEMA Data: {FEMA_API_URL} with filter: {filter_query}")

    try:
        all_summaries = []
        skip = 0
        total_records = None

        while total_records is None or skip < total_records:
            url = f"{FEMA_API_URL}?$top={BATCH_SIZE}&$skip={skip}&$inlinecount=allpages"
            if filter_query:
                url += f"&{filter_query}"

            print(f"Fetching {url}...")
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            # Get total record count from metadata (first request only)
            if total_records is None:
                total_records = data.get("metadata", {}).get("count", 0)

            # Add fetched records
            all_summaries.extend(data.get("DisasterDeclarationsSummaries", []))
            skip += BATCH_SIZE

            print(f"Fetched {len(all_summaries)} / {total_records} records...")

        # Sort summaries by declaration date (most recent first)
        all_summaries.sort(
            key=lambda s: datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ"),
            reverse=True
        )

        # Count hazard occurrences
        counts = {}
        for summary in all_summaries:
            incident_type = summary.get("incidentType")
            if incident_type:
                counts[incident_type] = counts.get(incident_type, 0) + 1

        # Find the oldest disaster year
        oldest_date = (
            min(
                (datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ") for s in all_summaries),
                default=None,
            )
        )
        oldest_year = oldest_date.year if oldest_date else None

        result = {
            "summaries": all_summaries,
            "counts": counts,
            "oldestYear": oldest_year,
            "title": "Disaster Type Distribution",
            "level": level,
            "total": len(all_summaries),
        }

        return jsonify(result)

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
        

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5001)