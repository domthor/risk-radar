import React, { useEffect, useState } from "react";

const Score = ({ selectedCounty }) => {
  const [disasterSummaries, setDisasterSummaries] = useState([]);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/disaster_summaries/?fipsStateCode=${
            selectedCounty.fipsStateCode
          }&fipsCountyCode=${selectedCounty.fipsCountyCode}`
        );
        const data = await response.json();
        setDisasterSummaries(data.DisasterDeclarationsSummaries);
      } catch (error) {
        console.error("There was an error fetching the score!", error);
      }
    };
    fetchScore();
  }, [selectedCounty]);

  return (
    <div className="dark:bg-black dark:text-neutral-300 bg-light text-black p-8 flex flex-row">
      <div className="w-1/3"></div>
      <div className="w-1/3 flex flex-col items-start justify-start pt-30 space-y-8">
        <h1 className="text-4xl">Score Page</h1>
        <div className="">countyName: {selectedCounty.countyName}</div>
        <div className="">fipsStateCode: {selectedCounty.fipsStateCode}</div>
        <div className="">fipsCountyCode: {selectedCounty.fipsCountyCode}</div>
        {disasterSummaries.map((disasterSummary) => (
          <div key={disasterSummary.id}>
            <div className="">
              declarationDate: {disasterSummary.declarationDate}
            </div>
            <div className="">
              declarationTitle: {disasterSummary.declarationTitle}
            </div>
            <div className="">incidentType: {disasterSummary.incidentType}</div>
            <div className="">
              designatedArea: {disasterSummary.designatedArea}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Score;
