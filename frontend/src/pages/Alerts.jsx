// src/pages/Alerts.jsx
import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../components/Autocomplete";
import { useCounties } from "../hooks/useCounties";
import RecentEventsCard from "../components/RecentEventsCards.jsx"

const Alerts = () => {
  const navigate = useNavigate();
  const { data: counties } = useCounties();

  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);

  // If user navigates here without a selected county, optionally redirect to "/"
  useEffect(() => {
    if (!selectedCounty) {
      // navigate("/");
      // Or do nothing and show fallback below
    }
  }, [selectedCounty, navigate]);

  // Build the county-level route whenever a county is selected
  useEffect(() => {
    if (!selectedCounty) return;

    const baseDisasterRoute = `/api/disaster_summaries/`;
    setCountyDisasterRoute(
      `${baseDisasterRoute}?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`
    );
  }, [selectedCounty]);

  // When a user picks a county from Autocomplete
  const handleSelect = (event, value) => {
    if (!value) {
      setSelectedCounty(null);
      return;
    }
    if (typeof value === "string") {
      const found = counties?.find((c) => c.countyName === value);
      setSelectedCounty(found || null);
    } else {
      setSelectedCounty(value);
    }
  };

  // Fallback if no county is selected
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
      <h1 className="text-3xl font-bold mt-12 mb-4 pt-8">
        Hazard Alerts for {selectedCounty.countyName}
      </h1>

      {/* Display the county-level route's 10 most recent events */}
      {countyDisasterRoute && (
        <Suspense fallback={<div>Loading County Events...</div>}>
          <RecentEventsCard route={countyDisasterRoute} />
        </Suspense>
      )}
    </div>
  );
};

export default Alerts;
