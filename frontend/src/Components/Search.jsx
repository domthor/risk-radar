import React from "react";
// import { Autocomplete, TextField } from "@mui/material";
import Autocomplete from "./Autocomplete";

const Search = ({ counties, selectedCounty, setSelectedCounty }) => {

  // Handle county selection
  const handleSelect = (event, value) => {
    setSelectedCounty(value);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 w-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8">
      <h1 className="text-2xl font-semibold text-dark dark:text-light">
        Select Your County
      </h1>
      <Autocomplete
        options={counties}
        value={selectedCounty}
        onChange={handleSelect}
        selectedCounty={selectedCounty}
        setSelectedCounty={setSelectedCounty}
      />
      
    </div>
  );
};

export default Search;
