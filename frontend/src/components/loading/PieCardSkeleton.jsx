import React from 'react'

const PieCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full animate-pulse">
      <div className="rounded-md animate-pulse text-transparent text-2xl mb-4">
        Filler Text
      </div>
      <div className="w-full rounded-xl"></div>
    </div>
  );
}

export default PieCardSkeleton