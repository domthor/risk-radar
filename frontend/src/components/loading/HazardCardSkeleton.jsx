export const HazardCardSkeleton = () => {

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 mt-8 w-1/3  animate-pulse">
      <div className="rounded-md animate-pulse text-transparent text-2xl m-4 mt-8">
        Incident Type Distribution since XXXX
      </div>
      <div className="w-4/5 lg:w-3/5 h-96 rounded-xl"></div>
    </div>
  );
};

export default HazardCardSkeleton;
