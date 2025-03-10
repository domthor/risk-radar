import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Search from "./Components/Search";
import About from "./Components/About";
import Settings from "./Components/Settings";
import Navbar from "./Components/Navbar";
import Alerts from "./Components/Alerts";
import Score from "./Components/Score";

const App = () => {
  const [counties, setCounties] = useState([]); // To store counties
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [selectedCounty, setSelectedCounty] = useState(""); // To store selected county

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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

  return (
    <Router>
      <Navbar />

      {/* Define your routes */}
      <Routes>
        <Route path="/" element={<Search counties={counties} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route
          path="/settings"
          element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route path="/score" element={<Score selectedCounty={selectedCounty}/>} />
      </Routes>
    </Router>
  );
};

export default App;
