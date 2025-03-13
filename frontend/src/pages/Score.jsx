import React, { useEffect, Suspense } from "react";
import { HazardCard } from "../components/HazardCard";
import { useNavigate } from "react-router-dom";
import HazardCardSkeleton from "../components/loading/HazardCardSkeleton";

const Score = ({ selectedCounty, darkMode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    }
  }, [selectedCounty, navigate]);

  if (!selectedCounty) return null; // Prevent rendering if already redirecting

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-col items-center pt-32 min-h-screen">
      <h1 className="text-4xl mb-6">Score Page</h1>
      <div className="text-lg mb-2">
        County Name: {selectedCounty.countyName}
      </div>
      <div className="text-lg mb-2">
        State Code: {selectedCounty.fipsStateCode}
      </div>
      <div className="text-lg mb-6">
        County Code: {selectedCounty.fipsCountyCode}
      </div>

      <Suspense fallback={<HazardCardSkeleton />}>
        <HazardCard selectedCounty={selectedCounty} darkMode={darkMode} />
      </Suspense>
    </div>
  );
};

export default Score;
