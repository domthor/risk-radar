// src/pages/Alerts.jsx
import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import { useCounties } from "../hooks/useCounties";
import RecentEventsCard from "../components/RecentEventsCard";

const Alerts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: counties } = useCounties();
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);

  // Clear the selected county when the location changes (e.g., when clicking the nav bar icon)
  useEffect(() => {
    if (location.pathname === "/alerts") {
      setSelectedCounty(null);
    }
  }, [location.key, location.pathname]);

  // Build the county-level route whenever a county is selected.
  useEffect(() => {
    if (!selectedCounty) {
      setCountyDisasterRoute(null);
      return;
    }
    const baseDisasterRoute = `/api/disaster_summaries/`;
    const route = `${baseDisasterRoute}?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`;
    setCountyDisasterRoute(route);
  }, [selectedCounty]);

  // When a county is selected from Autocomplete.
  const handleSelect = (event, value) => {
    if (!value || value === "") {
      setSelectedCounty(null);
      return;
    }
    if (typeof value === "string") {
      const found = counties.find((c) => c.countyName === value);
      setSelectedCounty(found || null);
    } else {
      setSelectedCounty(value);
    }
  };

  // Fallback view: if no county is selected, show only the search bar.
  if (!selectedCounty) {
    return (
      <div className="min-h-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
        <div className="pt-20">
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
          <p>Please select a county to view hazard alerts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
      {/* Main content with extra top padding */}
      <div className="pt-20">
        {/* Heading on top left */}
        <h1 className="text-3xl font-bold mt-12 mb-4">
          Hazard Alerts for {selectedCounty.countyName}
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

        {/* Display the recent events from the county-level disaster route */}
        {countyDisasterRoute && (
          <Suspense fallback={<div>Loading events...</div>}>
            <RecentEventsCard route={countyDisasterRoute} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Alerts;
