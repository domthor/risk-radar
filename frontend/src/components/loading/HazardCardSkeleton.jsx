export const HazardCardSkeleton = () => {

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 mt-8 w-1/3 animate-pulse">
      <div className="rounded-md animate-pulse text-transparent text-2xl mb-4">
        Incident Type Distribution since XXXX
      </div>
      <div className="w-full aspect-[2/1] rounded-xl"></div>
    </div>
  );
};

export default HazardCardSkeleton;
