import React from 'react'
import { Button } from "@mui/material";
import Switch from "@mui/material/Switch";

const Settings = ({ darkMode, setDarkMode }) => {

    const fetchAndSetCounties = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/set_counties/`);
            alert("Counties have been set!");
        } catch (error) {
            console.error("There was an error fetching the counties!", error);
        }
    }

  return (
    <div className="h-screen w-screen dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-row">
      <div className="w-1/3"></div>
      <div className="w-1/3 flex flex-col items-start justify-start pt-30 space-y-8">
        <h1 className="text-4xl">Settings</h1>
        <button
          onClick={fetchAndSetCounties}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Set Counties
        </button>
        <div className="flex flex-row w-full justify-between items-center border">
          <span className="p-4 items-start">
            Dark Mode
          </span>
          <div className="items-end"><Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} /></div>
        </div>
      </div>
    </div>
  );
}

export default Settings