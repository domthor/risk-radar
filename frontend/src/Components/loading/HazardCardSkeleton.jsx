import React from 'react'

const HazardCardSkeleton = () => {
  return (
    <>
      <div className="bg-gray-300 w-1/4 rounded-md animate-pulse text-transparent text-2xl mb-4 mt-8">
        Incident Type Distribution since 1975
      </div>
      <div className="cursor-pointer"></div>
    </>
  );
}

export default HazardCardSkeleton