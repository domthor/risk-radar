import React, { useEffect, useState, useRef } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useData } from "../hooks/useData";
import { useDrawingArea } from "@mui/x-charts/hooks";

export const PieCard = ({ route, darkMode, selectedCounty }) => {
  const response = useData(route);
  const data = response.data;
  

  const pieChartData = Object.entries(data.counts).map(
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

  // Custom center label for the pie chart

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <text
        x={left + width / 2}
        y={top + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-dark dark:fill-light font-semibold text-lg"
      >
        {children}
      </text>
    );
  }

  const customColors = [
    "#FF5733", // Vibrant Red-Orange
    "#FFBD33", // Warm Yellow
    "#FFD700", // Golden Yellow
    "#28A745", // Deep Green
    "#20C997", // Teal Green
    "#17A2B8", // Cyan Blue
    "#007BFF", // Bright Blue
    "#6F42C1", // Deep Purple
    "#D63384", // Vibrant Pink
    "#FD7E14", // Warm Orange
    "#DC3545", // Bold Red
    "#FFC107", // Mustard Yellow
    "#198754", // Rich Green
    "#6610F2", // Electric Purple
    "#6C757D", // Muted Gray
    "#343A40", // Dark Gray
    "#F8F9FA", // Soft White
    "#E83E8C", // Hot Pink
    "#AA00FF", // Intense Violet
    "#00BFA6", // Aqua Green
  ];

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-1/3 h-auto flex flex-col items-center">
      <h2 className="text-2xl mb-4 font-semibold">{data.title}</h2>
      <div
        ref={chartWrapper}
        className="w-full h-auto"
        style={{ maxWidth: "1000px" }}
      >
        <PieChart
          series={[
            {
              data: pieChartData
                .sort((a, b) => b.value - a.value)
                .map((item, index) => ({
                  ...item,
                  color: customColors[index % customColors.length], // Assign custom colors cyclically
                })),
              innerRadius:
                Math.min(chartDimensions.width, chartDimensions.height) * 0.36, // 25% of the smallest dimension
              outerRadius:
                Math.min(chartDimensions.width, chartDimensions.height) * 0.45, // 40% of the smallest dimension
              highlightScope: { fade: "global", highlight: "item" },
            },
          ]}
          height={chartDimensions.height}
          width={chartDimensions.width}
          slotProps={{
            legend: {
              labelStyle: { fill: darkMode ? "#d4d4d4" : "#171717" },
            },
          }}
        >
          <PieCenterLabel>{selectedCounty.countyName}</PieCenterLabel>
        </PieChart>
      </div>
      {/* <h2 className="text-2xl mt-8">Disaster Details</h2>
      <div className="flex flex-col items-center w-full mt-4">
        {data.summaries.map((disasterSummary) => (
          <div
            key={disasterSummary.id}
            className="border p-2 my-2 w-full text-start rounded-lg shadow-md text-sm"
          >
            <div>Declaration Date: {disasterSummary.declarationDate}</div>
            <div>Title: {disasterSummary.declarationTitle}</div>
            <div>Incident Type: {disasterSummary.incidentType}</div>
            <div>Designated Area: {disasterSummary.designatedArea}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default PieCard;
