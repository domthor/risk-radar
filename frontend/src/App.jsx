import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Search from "./pages/Search";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import Alerts from "./pages/Alerts";
import Score from "./pages/Score";
import SearchSkeleton from "./components/loading/SearchSkeleton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [selectedCounty, setSelectedCounty] = useState(null);

  const newTheme = createTheme({ palette: { mode: darkMode ? "dark" : "light" } });

  return (
    <ThemeProvider theme={newTheme}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Define your routes */}
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<SearchSkeleton />}>
                <Search
                  selectedCounty={selectedCounty}
                  setSelectedCounty={setSelectedCounty}
                />
              </Suspense>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route
            path="/settings"
            element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route
            path="/score"
            element={<Score selectedCounty={selectedCounty} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
