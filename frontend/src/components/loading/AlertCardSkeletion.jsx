import React from 'react'

const AlertCardSkeletion = () => {
  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-center animate-pulse min-h-50">
      <div className="rounded-md text-transparent text-2xl mb-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer">
        Recent Alerts
      </div>

      <div className="w-full min-h-95 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"></div>
    </div>
  );
}

export default AlertCardSkeletion