import React, { useEffect, useState, useRef } from "react";
import { PieChart } from "@mui/x-charts/PieChart"; // Import the PieChart component
import { useHazardData } from "../hooks/useHazardData";

export const HazardCard = ({ selectedCounty, darkMode }) => {
  const { data } = useHazardData(selectedCounty);
  const { summaries, hazardCounts, oldestDate } = data;

  const pieChartData = Object.entries(hazardCounts).map(
    ([type, count], index) => ({
      id: index,
      value: count,
      label: `${type} (${count})`,
    })
  );

  // Responsive chart dimensions
  const chartWrapper = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (chartWrapper.current) {
        setChartDimensions({
          width: chartWrapper.current.offsetWidth,
          height: chartWrapper.current.offsetWidth * 0.5, // Maintain aspect ratio
        });
      }
    };

    updateDimensions(); // Set initial size
    window.addEventListener("resize", updateDimensions); // Update on resize
    return () => window.removeEventListener("resize", updateDimensions); // Cleanup on unmount
  }, []);

  return (
    <>
      <h2 className="text-2xl mb-4 mt-8">
        Incident Type Distribution since {oldestDate || "unknown"}
      </h2>
      <div
        ref={chartWrapper}
        className="w-full h-auto"
        style={{ maxWidth: "700px" }}
      >
        <PieChart
          series={[
            {
              data: pieChartData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },
            },
          ]}
          height={chartDimensions.height}
          width={chartDimensions.width}
          valueFormatter={(value) => `${value}`}
          slotProps={{
            legend: {
              labelStyle: { fill: darkMode ? "#d4d4d4" : "#171717" },
            },
          }}
        />
      </div>

      <h2 className="text-2xl mt-8">Disaster Details</h2>
      <div className="flex flex-col items-center w-full mt-4">
        {summaries.map((disasterSummary) => (
          <div
            key={disasterSummary.id}
            className="border p-2 my-2 lg:w-2/5 text-start rounded-lg shadow-md text-sm"
          >
            <div>Declaration Date: {disasterSummary.declarationDate}</div>
            <div>Title: {disasterSummary.declarationTitle}</div>
            <div>Incident Type: {disasterSummary.incidentType}</div>
            <div>Designated Area: {disasterSummary.designatedArea}</div>
          </div>
        ))}
      </div>
    </>
  );
};
