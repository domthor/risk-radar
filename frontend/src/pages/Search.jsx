import { useContext, useEffect } from "react";
import Autocomplete from "../components/Autocomplete";
import { CountiesContext } from "../providers/CountiesProvider";

const Search = () => {
  const { counties, selectedCounty, setSelectedCounty } = useContext(CountiesContext);

  const handleSelect = (value) => {
    setSelectedCounty(value);
  };

  useEffect(() => {
    setSelectedCounty(null);
  }
  , []);


  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 w-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
      <h1 className="text-2xl font-semibold text-dark dark:text-light">
        Select Your County
      </h1>

      <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <Autocomplete
          options={counties || []}
          value={selectedCounty}
          onChange={handleSelect}
          setSelectedCounty={setSelectedCounty}
          navRoute={"/score/"}
        />
      </div>
    </div>
  );
};

export default Search;
