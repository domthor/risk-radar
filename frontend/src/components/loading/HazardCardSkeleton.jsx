export const HazardCardSkeleton = () => {

  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 rounded-md animate-pulse text-transparent text-2xl m-4 mt-8">
        Incident Type Distribution since XXXX
      </div>
      <div className="w-4/5 lg:w-3/5 h-96 bg-white dark:bg-gray-800 rounded-xl animate-pulse"></div>
    </div>
  );
};

export default HazardCardSkeleton;
