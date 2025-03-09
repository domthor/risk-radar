import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

const Search = () => {
  const [counties, setCounties] = useState([]); // To store counties
  const [selectedCounty, setSelectedCounty] = useState(""); // To store selected county

  // Fetch counties when the component mounts
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/counties/`
        ); // Using fetch with relative path
        const data = await response.json(); // Parse the JSON response
        setCounties(data); // Set the counties data to state
      } catch (error) {
        console.error("There was an error fetching the counties!", error);
      }
    };
    fetchCounties();
  }, []);

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
