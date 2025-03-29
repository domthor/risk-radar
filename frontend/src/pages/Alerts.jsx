// src/pages/Alerts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import { useCounties } from "../hooks/useCounties";

const Alerts = () => {
  const { data: counties } = useCounties();
  // Expect a county object with stateInitials, countyName, etc.
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [disasterData, setDisasterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Flag to ensure a fetch has been attempted
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();

  // Fetch FEMA disaster alerts when a valid county is selected.
  useEffect(() => {
    if (
      !selectedCounty ||
      !selectedCounty.stateInitials ||
      !selectedCounty.countyName
    )
      return;

    // Hardcoded endpoint for now.
    const disasterEndpoint =
      "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=designatedArea eq 'Washtenaw (County)'";

    const fetchDisasterData = async () => {
      setLoading(true);
      setError(null);
      setHasFetched(false);
      try {
        const res = await fetch(disasterEndpoint);
        const data = await res.json();
        // FEMA API returns disaster records in DisasterDeclarationsSummaries.
        const events = data.DisasterDeclarationsSummaries || [];
        setDisasterData(events);
      } catch (err) {
        console.error("Error fetching disaster data:", err);
        setError("Error fetching disaster data.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchDisasterData();
  }, [selectedCounty]);

  // If no alerts are found after fetching, wait 5 seconds then redirect.
  useEffect(() => {
    if (
      !loading &&
      !error &&
      selectedCounty &&
      hasFetched &&
      disasterData.length === 0
    ) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, selectedCounty, hasFetched, disasterData, navigate]);

  // When a county is selected from Autocomplete.
  // If Autocomplete returns a string, attempt to find the matching county object.
  const handleSelect = (event, value) => {
    if (typeof value === "string") {
      const found = counties.find((c) => c.countyName === value);
      setSelectedCounty(found || null);
    } else {
      setSelectedCounty(value);
    }
  };

  return (
    <div className="min-h-screen dark:bg-black dark:text-neutral-300 bg-light text-black">
      {/* Main content with extra top padding so it's not flush with the nav bar */}
      <div className="p-8 pt-20">
        {/* Message on top left */}
        <h1 className="text-2xl font-semibold mb-4 text-left pt-8">
          Showing hazard alerts for{" "}
          {selectedCounty ? selectedCounty.countyName : "Your County"}
        </h1>

        {/* Search bar area remains on the right */}
        <div className="flex justify-end mb-4">
          <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
            <Autocomplete
              options={counties || []}
              value={selectedCounty}
              onChange={handleSelect}
              setSelectedCounty={setSelectedCounty}
            />
            <h1 className="text-2xl font-semibold mb-4 text-right">
              Select your county
            </h1>
          </div>
        </div>

        {loading && <p>Loading disaster alerts...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && selectedCounty && disasterData.length === 0 && (
          <p>
            No hazard alerts found for {selectedCounty.countyName}. Redirecting in 5
            seconds for debugging purposes...
          </p>
        )}

        {/* Render disaster alerts */}
        <div className="grid grid-cols-1 gap-4">
          {disasterData.map((alert, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded shadow">
              <h3 className="font-bold mb-2">
                {alert.declarationTitle || "Alert Title"}
              </h3>
              <p className="mb-1">
                {alert.incidentType || "No incident type available."}
              </p>
              <p className="text-sm text-gray-500">
                {alert.incidentBeginDate
                  ? new Date(alert.incidentBeginDate).toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
