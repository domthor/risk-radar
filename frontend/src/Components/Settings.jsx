import React from 'react'

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
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={fetchAndSetCounties}
      >
        Set Counties
      </button>
    </div>
  );
}

export default Settings