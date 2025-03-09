import React from 'react'
import { Button } from "@mui/material";

const Settings = () => {

    const fetchAndSetCounties = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/set_counties/`);
            alert("Counties have been set!");
        } catch (error) {
            console.error("There was an error fetching the counties!", error);
        }
    }

  return (
    <div className="">
      <h1>Settings Page</h1>
      <Button
        variant='contained'
        color='primary'
        onClick={fetchAndSetCounties}
      >
        Set Counties
      </Button>
    </div>
  );
}

export default Settings