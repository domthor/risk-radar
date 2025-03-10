import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Score = ({ selectedCounty }) => {
  const [disasterSummaries, setDisasterSummaries] = useState([]);
  const [hazardCounts, setHazardCounts] = useState({});
  const [oldestDate, setOldestDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/disaster_summaries/?fipsStateCode=${
            selectedCounty.fipsStateCode
          }&fipsCountyCode=${selectedCounty.fipsCountyCode}`
        );
        const data = await response.json();
        const summaries = data.DisasterDeclarationsSummaries || [];
        
        // Sort disasters by date (most recent first)
        summaries.sort((a, b) => new Date(b.declarationDate) - new Date(a.declarationDate));
        setDisasterSummaries(summaries);

        // Compute incident type counts
        const counts = summaries.reduce((acc, summary) => {
          const incidentType = summary.incidentType;
          if (incidentType) {
            acc[incidentType] = (acc[incidentType] || 0) + 1;
          }
          return acc;
        }, {});

        setHazardCounts(counts);

        // Find the oldest declaration date
        const dates = summaries.map(s => new Date(s.declarationDate)).filter(d => !isNaN(d));
        if (dates.length > 0) {
          setOldestDate(new Date(Math.min(...dates)).getFullYear());
        }
      } catch (error) {
        console.error("There was an error fetching the score!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [selectedCounty]);

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-col items-center pt-32">
      {loading ? (
        <div className="w-screen h-screen flex justify-center"><CircularProgress /></div>
      ) : (
        <>
          <h1 className="text-4xl mb-6">Score Page</h1>
          <div className="text-lg mb-2">County Name: {selectedCounty.countyName}</div>
          <div className="text-lg mb-2">State Code: {selectedCounty.fipsStateCode}</div>
          <div className="text-lg mb-6">County Code: {selectedCounty.fipsCountyCode}</div>

          <h2 className="text-2xl mt-8">Hazard Summary since {oldestDate || "unknown"}</h2>
          <ul>
            {Object.entries(hazardCounts).map(([type, count]) => (
              <li key={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl mt-8">Disaster Details</h2>
          <div className="flex flex-col items-center w-full mt-4">
            {disasterSummaries.map((disasterSummary) => (
              <div key={disasterSummary.id} className="border p-2 my-2 w-2/5 text-center rounded-lg shadow-md text-sm">
                <div>Declaration Date: {disasterSummary.declarationDate}</div>
                <div>Title: {disasterSummary.declarationTitle}</div>
                <div>Incident Type: {disasterSummary.incidentType}</div>
                <div>Designated Area: {disasterSummary.designatedArea}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Score;