import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Search from "./Components/Search";
import About from "./Components/About";
import Settings from "./Components/Settings";

const App = () => {
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
          <Route path="/" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
