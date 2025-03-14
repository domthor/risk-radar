import React, { useState, useEffect, Suspense } from "react";
import { PieCard } from "../components/PieCard";
import PieCardSkeleton from "../components/loading/PieCardSkeleton";
import { useNavigate } from "react-router-dom";

const Score = ({ selectedCounty, darkMode }) => {
  const navigate = useNavigate();
  const [countyDisasterRoute, setCountyDisasterRoute] = useState(null);

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    }
    else {
      const hazard_route = `/api/disaster_summaries/?fipsStateCode=${selectedCounty.fipsStateCode}&fipsCountyCode=${selectedCounty.fipsCountyCode}`;
      setCountyDisasterRoute(hazard_route);
    }
  }, [selectedCounty, navigate]);


  if (!selectedCounty) return null; // Prevent rendering if already redirecting

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-col items-center pt-32 min-h-screen space-y-4">
      <h1 className="text-4xl mt-12 font-bold">Score Page</h1>

      <div className="flex flex-row w-full items-center justify-center space-x-4">
        { countyDisasterRoute && (
          <Suspense fallback={<PieCardSkeleton />}>
            <PieCard
              route={countyDisasterRoute}
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
