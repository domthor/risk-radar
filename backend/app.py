from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import time
import threading
import re
from datetime import datetime
import xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app) 

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

FBI_API_KEY = os.getenv('FBI_API_KEY')
FEMA_API_URL = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
CENSUS_API_URL = "https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt"
NOAA_API_URL = "https://api.weather.gov/alerts/active.atom"
FBI_API_BASE_URL = "https://api.usa.gov/crime/fbi/cde"
BATCH_SIZE = 10000  # Max records per request
MAX_THREADS = 10  # Tune based on API rate limits and system capacity
REMOVE_WORDS = ["city", "census", "area", "county"]
DATE_RANGES = [["01-2019", "12-2019"], 
               ["01-2020", "12-2020"], 
               ["01-2021", "12-2021"], 
               ["01-2022", "12-2022"], 
               ["01-2023", "12-2023"]]

# County Model
class County(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state_initials = db.Column(db.String(2), nullable=False)
    statefp = db.Column(db.String(2), nullable=False)
    countyfp = db.Column(db.String(3), nullable=False)
    county_name = db.Column(db.String(100), nullable=False)


def parse_date(date_str):
    """Converts mm-yyyy string to a datetime object"""
    return datetime.strptime(date_str, "%m-%Y")
    
# Get ORI's for a selected county
def get_ori(state_initials=None, county_name=None):
    if state_initials is None:
        return jsonify({"error": "Missing stateInitials parameter"}), 400
    
    url = f"{FBI_API_BASE_URL}/agency/byStateAbbr/{state_initials}?API_KEY={FBI_API_KEY}"
    # print(f"Fetching ORI data from {url}")
    response = requests.get(url)
    data = response.json()

    oris = []
    if county_name:
        # Loop through all county keys
        for county, agencies in data.items():
            # Check if the target county is in the county key
            if county_name.upper() in county.split(", "):
                oris.extend([agency["ori"] for agency in agencies])
    return oris

def fetch_crime_data(ori, date_range, county_name, state_initials):
    if county_name:
        url = f"{FBI_API_BASE_URL}/summarized/agency/{ori}/V?from={date_range[0]}&to={date_range[1]}&API_KEY={FBI_API_KEY}"
    elif state_initials:
        url = f"{FBI_API_BASE_URL}/summarized/state/{state_initials}/V?from={date_range[0]}&to={date_range[1]}&API_KEY={FBI_API_KEY}"
        # print(f"Fetching state data from {url}")
    else:
        url = f"{FBI_API_BASE_URL}/summarized/national/V?from={date_range[0]}&to={date_range[1]}&API_KEY={FBI_API_KEY}"
        # print(f"Fetching national data from {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        results = data['offenses']['actuals']
        return results
    except Exception as e:
        print(f"Error fetching data for {ori} in range {date_range}: {e}")
        return {}

@app.route("/api/crime_summaries/", methods=["GET"])
def get_crime_summaries():
    county_name = request.args.get("cleanedCountyName")
    state_initials = request.args.get("stateInitials")

    title = ""
    if county_name:
        title = "County Crime Counts"
    elif state_initials:
        title = "State Crime Counts"
    else:
        title = "National Crime Counts"

    oris = []
    if county_name:
        oris = get_ori(state_initials, county_name)
        # print(f"ORI's: {oris}")

    date_range_counts = {f"{date_range[0]} - {date_range[1]}": 0 for date_range in DATE_RANGES}  # Use tuple instead of list

    # Use ThreadPoolExecutor to fetch data concurrently
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(fetch_crime_data, ori, date_range, county_name, state_initials) for ori in oris for date_range in DATE_RANGES]

        # If no ORI's are found, fetch data for the entire state or nation
        if not oris:
            futures.extend([executor.submit(fetch_crime_data, None, date_range, county_name, state_initials) for date_range in DATE_RANGES])

        for future in as_completed(futures):
            actuals = future.result()
            if actuals:
                for agency, date_counts in actuals.items():
                    for date, count in date_counts.items():
                        if count:
                            for date_range in DATE_RANGES:
                                if parse_date(date_range[0]) <= parse_date(date) <= parse_date(date_range[1]):
                                    date_range_counts[f"{date_range[0]} - {date_range[1]}"] += count

    # Extract counts and dynamic date range labels for xLabels
    counts = list(date_range_counts.values())
    xLabels = [str(date_range[0].split("-")[1]) for date_range in DATE_RANGES]  # Extract year part

    result = {
        "counts": counts,
        "xLabels": xLabels,
        "title": title,
    }

    return jsonify(result)

# Fetch county data from the Census Bureau's national file
@app.route("/api/set_counties/", methods=["GET"])
def set_counties():
    # URL to the national county file
    url = CENSUS_API_URL
    response = requests.get(url)
    
    data = response.text.splitlines()
    data = data[1:]
    if data is not None:
        # print("Clearing duplicate county data.")
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
    
    # print("Adding counties to the database")
    db.session.commit()
    return jsonify({"message": "Counties added to the database"})
    
def clean_county_name(county_name):
    # Create a regex pattern to match the words (case-insensitive, word boundaries)
    pattern = r'\b(?:' + '|'.join(REMOVE_WORDS) + r')\b'
    # Remove the words and strip any extra whitespace
    cleaned_name = re.sub(pattern, '', county_name, flags=re.IGNORECASE).strip()
    return cleaned_name

# Get all the counties from the database
@app.route("/api/counties/", methods=["GET"])
def get_counties():
    counties = County.query.all()
    results = []
    for county in counties:
        cleaned_county_name = clean_county_name(county.county_name)
        # print(f"County Name: {county.county_name}, Cleaned Name: {cleaned_county_name}, State Initials: {county.state_initials}")

        results.append({
            "stateInitials": county.state_initials,
            "countyName": f"{county.county_name}, {county.state_initials}",
            "cleanedCountyName": cleaned_county_name,
            "fipsStateCode": county.statefp,
            "fipsCountyCode": county.countyfp,
        })

    return jsonify(results)

def fetch_disaster_data(skip, filter_query, results, index):
    """Fetches a batch of disaster summaries from the FEMA API and stores it in results."""
    url = f"{FEMA_API_URL}?$top={BATCH_SIZE}&$skip={skip}&$inlinecount=allpages"
    if filter_query:
        url += f"&{filter_query}"

    # print(f"Fetching {url}...")
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    results[index] = data.get("DisasterDeclarationsSummaries", [])
    # print(f"Fetched {len(results[index])} records from skip={skip}")

def get_total_disaster_records(filter_query=None):
    """Gets the total number of records available in the API."""
    url = f"{FEMA_API_URL}?$top=1&$inlinecount=allpages"
    if filter_query:
        url += f"&{filter_query}"

    response = requests.get(url)
    response.raise_for_status()
    data = response.json()

    return data.get("metadata", {}).get("count", 0)

def fetch_all_disaster_records(filter_query=None):
    """Fetches all disaster declarations in parallel using threads."""
    total_records = get_total_disaster_records(filter_query)
    # print(f"Total records to fetch: {total_records}")

    all_summaries = []
    skip_values = list(range(0, total_records, BATCH_SIZE))
    num_batches = len(skip_values)
    results = [None] * num_batches  # Placeholder for fetched data

    threads = []
    for i, skip in enumerate(skip_values):
        thread = threading.Thread(target=fetch_disaster_data, args=(skip, filter_query, results, i))
        threads.append(thread)
        thread.start()

        # Limit active threads to MAX_THREADS
        if len(threads) >= MAX_THREADS:
            for t in threads:
                t.join()  # Wait for the batch of threads to complete
            threads = []

    # Wait for any remaining threads to finish
    for t in threads:
        t.join()

    # Merge results
    for batch in results:
        if batch:
            all_summaries.extend(batch)

    # print(f"Total records fetched: {len(all_summaries)}")
    return all_summaries

def calculate_score(count):
    if count <= 0:
        return 100
    elif count >= 80:
        return 1
    else:
        score = 100 - (min(100, max(0, (count / 80) * 100)))
        return round(score)
    
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

    # print(f"Fetching FEMA Data with filter: {filter_query}")

    try:
        all_summaries = fetch_all_disaster_records(filter_query)

        filtered_summaries = [
            summary
            for summary in all_summaries
            if summary.get("declarationTitle") not in ["COVID-19 PANDEMIC", "HURRICANE KATRINA EVACUATION", "COVID-19 "]
        ]

        # Sort summaries by declaration date (most recent first)
        filtered_summaries.sort(
            key=lambda s: datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ"),
            reverse=True
        )

        # Count hazard occurrences
        counts = {}
        for summary in filtered_summaries:
            incident_type = summary.get("incidentType")
            if incident_type:
                counts[incident_type] = counts.get(incident_type, 0) + 1

        total_incident_count = sum(counts.values())
        score = calculate_score(total_incident_count)

        # Find the oldest disaster year
        oldest_date = (
            min(
                (datetime.strptime(s["declarationDate"], "%Y-%m-%dT%H:%M:%S.%fZ") for s in filtered_summaries),
                default=None,
            )
        )
        oldest_year = oldest_date.year if oldest_date else None

        result = {
            "summaries": filtered_summaries,
            "counts": counts,
            "score": score,
            "oldestYear": oldest_year,
            "title": "Disaster Type Distribution",
            "level": level,
            "total": len(filtered_summaries),
        }
        return jsonify(result)

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
# Get alerts from NOAA
@app.route("/api/alerts/", methods=["GET"])
def get_alerts():
    time.sleep(4)
    # Get query parameters
    zone = request.args.get("zone")

    url = f"{NOAA_API_URL}?zone={zone}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        xml_content = response.text
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
    # Parse the XML content
    parsed_alerts = parse_alerts(xml_content)

    return jsonify(parsed_alerts)


# Define the namespaces. You MUST provide a prefix for the default namespace
# for use with find/findall. 'atom' is a common choice.
namespaces = {
    'atom': 'http://www.w3.org/2005/Atom',
    'cap': 'urn:oasis:names:tc:emergency:cap:1.2'
}

datetime_format = "%m/%d/%Y %I:%M %p"

def parse_alerts(xml_content):
    alerts = []
    try:
        root = ET.fromstring(xml_content)
        # Find all entry elements using the namespace map
        entries = root.findall('atom:entry', namespaces)

        for entry in entries:
            alert_data = {}

            # --- Helper function to safely get text ---
            def get_text(element_name, namespace_key):
                element = entry.find(f"{namespace_key}:{element_name}", namespaces)
                return element.text.strip() if element is not None and element.text else None
            
            # --- Extract CAP elements ---
            alert_data['capEvent'] = get_text('event', 'cap')
            alert_data['capEffective'] = (datetime.fromisoformat(get_text('effective', 'cap'))).strftime(datetime_format)
            alert_data['capExpires'] = (datetime.fromisoformat(get_text('expires', 'cap'))).strftime(datetime_format)
            alert_data['capUrgency'] = get_text('urgency', 'cap')
            alert_data['capSeverity'] = get_text('severity', 'cap')
            alert_data['capCertainty'] = get_text('certainty', 'cap')
            alert_data['capAreaDesc'] = get_text('areaDesc', 'cap')

            alerts.append(alert_data)

    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        return None # Indicate failure
    except Exception as e:
        print(f"An unexpected error occurred during parsing: {e}")
        return None

    print("Alerts:", alerts)
    return alerts



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5001)