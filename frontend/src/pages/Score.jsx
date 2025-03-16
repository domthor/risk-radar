import React, { useState, useEffect, Suspense } from "react";
import { PieCard } from "../components/PieCard";
import PieCardSkeleton from "../components/loading/PieCardSkeleton";
import { useNavigate } from "react-router-dom";

const Score = ({ selectedCounty, darkMode }) => {
  const navigate = useNavigate();
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);
  const [stateDisasterRoute, setStateDisasterRoute] = useState(null);
  const [nationalDisasterRoute, setNationalDisasterRoute] = useState(null);
  const [activeTab, setActiveTab] = useState("overall");

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    }
    else {
      const base_disaster_route = `/api/disaster_summaries/`;
      setCountyDisasterRoute(`${base_disaster_route}?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`);
      setStateDisasterRoute(`${base_disaster_route}?fipsStateCode=${selectedCounty.fipsStateCode}`);
      setNationalDisasterRoute(`${base_disaster_route}`);
    }
  }, [selectedCounty, navigate]);


  if (!selectedCounty) return null; // Prevent rendering if already redirecting

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-col items-center pt-32 min-h-screen space-y-4">
      <h1 className="text-4xl mt-12 font-bold">{selectedCounty.countyName}</h1>

      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "overall"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("overall")}
        >
          Overall
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "disaster"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("disaster")}
        >
          Disaster Data
        </button>
        <button
          className={`ml-4 px-4 py-2 text-lg font-semibold ${
            activeTab === "crime"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("crime")}
        >
          Crime Data
        </button>
      </div>

      {/* Overall Tab */}
      {activeTab === "overall" && (
        <div className="">Overall</div>
      )}

      {/* Disaster Data Tab*/}
      {activeTab === "disaster" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full justify-center space-x-4">
          {countyDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard
                route={countyDisasterRoute}
                darkMode={darkMode}
                selectedCounty={selectedCounty}
              />
            </Suspense>
          )}
          {stateDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard
                route={stateDisasterRoute}
                darkMode={darkMode}
                selectedCounty={selectedCounty}
              />
            </Suspense>
          )}
          {nationalDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard
                route={nationalDisasterRoute}
                darkMode={darkMode}
                selectedCounty={selectedCounty}
              />
            </Suspense>
          )}
        </div>
      )}

      {/* Crime Data Tab */}
      {activeTab === "crime" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full justify-center space-x-4">
          {stateDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard
                route={stateDisasterRoute}
                darkMode={darkMode}
                selectedCounty={selectedCounty}
              />
            </Suspense>
          )}
          {nationalDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard
                route={nationalDisasterRoute}
                darkMode={darkMode}
                selectedCounty={selectedCounty}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
};

export default Score;
