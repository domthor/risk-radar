import React, { useState, useEffect, Suspense } from "react";
import { PieCard } from "../components/PieCard";
import PieCardSkeleton from "../components/loading/PieCardSkeleton";
import BarCardSkeleton from "../components/loading/BarCardSkeleton";
import ScoreCard from "../components/ScoreCard";
import BarCard from "../components/BarCard";
import { useNavigate } from "react-router-dom";


const Score = ({ selectedCounty }) => {
  const navigate = useNavigate();
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);
  const [stateDisasterRoute, setStateDisasterRoute] = useState(null);
  const [nationalDisasterRoute, setNationalDisasterRoute] = useState(null);
  const [countyCrimeRoute, setCountyCrimeRoute] = useState(null);
  const [stateCrimeRoute, setStateCrimeRoute] = useState(null);
  const [nationalCrimeRoute, setNationalCrimeRoute] = useState(null);
  const [activeTab, setActiveTab] = useState("overall");

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    } else {
      const base_disaster_route = `/api/disaster_summaries/`;
      setCountyDisasterRoute(
        `${base_disaster_route}?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`
      );
      setStateDisasterRoute(
        `${base_disaster_route}?fipsStateCode=${selectedCounty.fipsStateCode}`
      );
      setNationalDisasterRoute(`${base_disaster_route}`);

      const base_crime_route = `/api/crime_summaries/`;
      setCountyCrimeRoute(
        `${base_crime_route}?stateInitials=${selectedCounty.stateInitials}&cleanedCountyName=${selectedCounty.cleanedCountyName}`
      );
      setStateCrimeRoute(`${base_crime_route}?stateInitials=${selectedCounty.stateInitials}`);
      setNationalCrimeRoute(`${base_crime_route}`);
    }
  }, [selectedCounty, navigate]);

  if (!selectedCounty) return null; // Prevent rendering if already redirecting

  return (
    <div className="dark:bg-black dark:text-light bg-light text-dark p-8 flex flex-col items-center pt-32 min-h-screen space-y-4">
      <h1 className="text-4xl mt-12 font-bold">{selectedCounty.countyName}</h1>

      {/* Tab Buttons */}
      <div className="flex border-b border-gray-300 ">
        <button
          className={`cursor-pointer px-4 py-2 text-lg font-semibold ${
            activeTab === "overall"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "border-b-1 text-gray-500"
          }`}
          onClick={() => setActiveTab("overall")}
        >
          Overall
        </button>
        <button
          className={`cursor-pointer px-4 py-2 text-lg font-semibold ${
            activeTab === "disaster"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "border-b-1 text-gray-500"
          }`}
          onClick={() => setActiveTab("disaster")}
        >
          Disaster Data
        </button>
        <button
          className={`cursor-pointer px-4 py-2 text-lg font-semibold ${
            activeTab === "crime"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "border-b-1 text-gray-500"
          }`}
          onClick={() => setActiveTab("crime")}
        >
          Crime Data
        </button>
      </div>

      {/* Overall Tab */}
      {activeTab === "overall" && countyDisasterRoute && (
        <div className="">
          <ScoreCard route={countyDisasterRoute} />
        </div>
      )}

      {/* Disaster Data Tab*/}
      {activeTab === "disaster" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full justify-center space-x-4">
          {countyDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard route={countyDisasterRoute} />
            </Suspense>
          )}
          {stateDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard route={stateDisasterRoute} />
            </Suspense>
          )}
          {nationalDisasterRoute && (
            <Suspense fallback={<PieCardSkeleton />}>
              <PieCard route={nationalDisasterRoute} />
            </Suspense>
          )}
        </div>
      )}

      {/* Crime Data Tab */}
      {activeTab === "crime" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 w-full justify-center space-x-4">
          {countyCrimeRoute && (
            <Suspense fallback={<BarCardSkeleton />}>
              <BarCard route={countyCrimeRoute} />
            </Suspense>
          )}
          {countyCrimeRoute && (
            <Suspense fallback={<BarCardSkeleton />}>
              <BarCard route={stateCrimeRoute} />
            </Suspense>
          )}
          {countyCrimeRoute && (
            <Suspense fallback={<BarCardSkeleton />}>
              <BarCard route={nationalCrimeRoute} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
};

export default Score;
