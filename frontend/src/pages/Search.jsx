import React from "react";
import Autocomplete from "../components/Autocomplete";
import { useCounties } from "../hooks/useCounties";

const Search = ({ selectedCounty, setSelectedCounty }) => {
  const { data: counties } = useCounties();

  const handleSelect = (event, value) => {
    setSelectedCounty(value);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 w-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
      <h1 className="text-2xl font-semibold text-dark dark:text-light">
        Select Your County
      </h1>

      <div className="relative w-1/5">
        <Autocomplete
          options={counties || []}
          value={selectedCounty}
          onChange={handleSelect}
          setSelectedCounty={setSelectedCounty}
        />
      </div>
    </div>
  );
};

export default Search;
