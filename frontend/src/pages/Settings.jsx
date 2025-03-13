import React from 'react';
import Switch from '@mui/material/Switch';

const Settings = ({ darkMode, setDarkMode }) => {
  const fetchAndSetCounties = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/set_counties/`);
      alert("Counties have been set!");
    } catch (error) {
      console.error("There was an error fetching the counties!", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col dark:bg-black dark:text-neutral-300 bg-light text-black pt-30">
      {/* Main content */}
      <div className="flex-1 px-8">
        {/* Centered Page Title with extra spacing */}
        <h1 className="text-2xl font-bold mb-8 text-center">
          Settings
        </h1>

        {/* Settings Card */}
        <div className="bg-blue-50 dark:bg-gray-700 rounded-md p-4 w-full max-w-xl mx-auto space-y-4">
          {/* 1. Dark Mode */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium">Dark Mode</span>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>

          {/* 2. Temperature Units (°C) */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium">Temperature Units (°C)</span>
            <Switch />
          </div>

          {/* 3. Distance Units (Imperial) */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium">Distance Units (Imperial)</span>
            <Switch />
          </div>

          {/* 4. Reduced Motion */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium">Reduced Motion</span>
            <Switch />
          </div>

          {/* 5. Receive Email Notifications */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium">Receive Email Notifications</span>
            <Switch />
          </div>

          {/* Set Counties Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={fetchAndSetCounties}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Set Counties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
