import React from 'react'

const SearchSkeleton = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 w-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
      <h1 className="text-2xl font-semibold text-dark dark:text-light">
        Select Your County
      </h1>

      <div className="relative w-1/5">
        <div className="bg-white dark:bg-gray-800 h-10.5 w-full rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default SearchSkeleton