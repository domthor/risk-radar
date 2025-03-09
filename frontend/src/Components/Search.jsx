import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

const Search = ({ counties }) => {
  const [selectedCounty, setSelectedCounty] = useState(""); // To store selected county

  // Handle county selection
  const handleSelect = (event, value) => {
    setSelectedCounty(value);
  };

  return (
      <div className="container">
        <div className="">
          <Autocomplete
            value={selectedCounty}
            onChange={handleSelect}
            options={counties}
            getOptionLabel={(option) => option.county_name || ""}
            isOptionEqualToValue={(option, value) =>
              option.county_name === value.county_name
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a County"
                variant="outlined"
                fullWidth
                className="p-2"
              />
            )}
          />
        </div>
      </div>
    );
};

export default Search;
