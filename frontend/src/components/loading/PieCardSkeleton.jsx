import React from 'react'

const PieCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full animate-pulse min-h-130">
      <div className="rounded-md text-transparent text-2xl mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer">
        Filler Text
      </div>
      <div className="w-full min-h-110 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"></div>
    </div>
  );
}

export default PieCardSkeleton