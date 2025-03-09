import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Search from "./Components/Search";
import About from "./Components/About";
import Settings from "./Components/Settings";

const App = () => {
    const [counties, setCounties] = useState([]); // To store counties

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
      <div>
        {/* Add navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Search</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Search counties={counties} />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
