import React, { useState, useEffect, Suspense } from "react";
import { PieCard } from "../components/PieCard";
import PieCardSkeleton from "../components/loading/PieCardSkeleton";
import { useNavigate } from "react-router-dom";

const Score = ({ selectedCounty, darkMode }) => {
  const navigate = useNavigate();
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);
  const [stateDisasterRoute, setStateDisasterRoute] = useState(null);
  const [nationalDisasterRoute, setNationalDisasterRoute] = useState(null);

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    }
    else {
      const base_hazard_route = `/api/disaster_summaries/`;
      setCountyDisasterRoute(`${base_hazard_route}?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`);
      setStateDisasterRoute(`${base_hazard_route}?fipsStateCode=${selectedCounty.fipsStateCode}`);
      setNationalDisasterRoute(`${base_hazard_route}`);
    }
  }, [selectedCounty, navigate]);


  if (!selectedCounty) return null; // Prevent rendering if already redirecting

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-col items-center pt-32 min-h-screen space-y-4">
      <h1 className="text-4xl mt-12 font-bold">{selectedCounty.countyName}</h1>

      <h2 className="text-2xl">Disaster Summaries</h2>
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
    </div>
  );
};

export default Score;
