// src/pages/Alerts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import { useCounties } from "../hooks/useCounties";

const Alerts = () => {
  const { data: counties } = useCounties();
  // Expect a county object with stateInitials, fipsCountyCode, countyName, etc.
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // New flag to ensure a fetch has been attempted
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();

  // Fetch weather alerts when a valid county is selected.
  useEffect(() => {
    if (
      !selectedCounty ||
      !selectedCounty.stateInitials ||
      !selectedCounty.fipsCountyCode
    )
      return;

    // Build zone code as State initials + county FIPS code (e.g., MI161)
    const zoneCode = `${selectedCounty.stateInitials}${selectedCounty.fipsCountyCode}`;
    // Build the weather.gov alerts endpoint (Atom feed format)
    const weatherEndpoint = `https://api.weather.gov/alerts/active.atom?zone=${zoneCode}`;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setHasFetched(false);
      try {
        const res = await fetch(weatherEndpoint);
        const text = await res.text();

        // Parse the XML Atom feed
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        const alerts = [];
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const titleEl = entry.getElementsByTagName("title")[0];
          const summaryEl = entry.getElementsByTagName("summary")[0];
          const updatedEl = entry.getElementsByTagName("updated")[0];
          alerts.push({
            title: titleEl ? titleEl.textContent : "No title",
            description: summaryEl
              ? summaryEl.textContent
              : "No description available.",
            timestamp: updatedEl ? updatedEl.textContent : null,
          });
        }
        setWeatherData(alerts);
      } catch (err) {
        console.error("Error fetching weather alerts:", err);
        setError("Error fetching weather alerts.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchWeatherData();
  }, [selectedCounty]);

  // If no alerts are found after fetching, wait 5 seconds then redirect.
  useEffect(() => {
    if (
      !loading &&
      !error &&
      selectedCounty &&
      hasFetched &&
      weatherData.length === 0
    ) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, selectedCounty, hasFetched, weatherData, navigate]);

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
      <div className="p-8 pt-12">
        <h1 className="text-2xl font-semibold mb-4">
          Weather Alerts for {selectedCounty ? selectedCounty.countyName : "Your County"}
        </h1>

        {/* Search bar area, aligned to the right */}
        <div className="flex justify-end mb-4 pt-8">
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

        {loading && <p>Loading weather alerts...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && selectedCounty && weatherData.length === 0 && (
          <p>
            No weather alerts found for {selectedCounty.countyName}. Redirecting in 5
            seconds for debugging purposes...
          </p>
        )}

        {/* Render weather alerts */}
        <div className="grid grid-cols-1 gap-4">
          {weatherData.map((alert, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded shadow">
              <h3 className="font-bold mb-2">{alert.title || "Alert Title"}</h3>
              <p className="mb-1">{alert.description || "No description available."}</p>
              <p className="text-sm text-gray-500">
                {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
