import React, { useEffect, Suspense } from "react";
import { HazardCard } from "../components/HazardCard";
import { CrimeCard } from "../components/CrimeCard";
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
      <h1 className="text-4xl mt-12 font-bold">Score Page</h1>

      <div className="flex flex-row w-full items-center justify-center space-x-4">
        <Suspense fallback={<HazardCardSkeleton />}>
          <HazardCard selectedCounty={selectedCounty} darkMode={darkMode} />
        </Suspense>
        <Suspense fallback={<HazardCardSkeleton />}>
          <CrimeCard selectedCounty={selectedCounty} darkMode={darkMode} />
        </Suspense>
      </div>
    </div>
  );
};

export default Score;
