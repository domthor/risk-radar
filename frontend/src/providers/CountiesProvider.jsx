import React, { createContext, useState } from "react";
import { useData } from "../hooks/useData";

export const CountiesContext = createContext();

const CountiesProvider = ({ children }) => {
  const response = useData("/api/counties/");
  const counties = response.data;

  const [selectedCounty, setSelectedCounty] = useState(null);

  return (
    <CountiesContext.Provider
      value={{ counties, selectedCounty, setSelectedCounty }}
    >
      {children}
    </CountiesContext.Provider>
  );
};

export default CountiesProvider;
