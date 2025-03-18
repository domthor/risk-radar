import { useEffect, useState, useRef } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useData } from "../hooks/useData";
import Box from "@mui/material/Box";
import Legend from "./Legend";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";

export const PieCard = ({ route }) => {
  const response = useData(route);

  // Remove noise from data
  const filteredSummaries = response.data.summaries.filter(
    (summary) =>
      summary.declarationTitle !== "COVID-19 PANDEMIC" &&
      summary.declarationTitle !== "HURRICANE KATRINA EVACUATION" &&
      summary.declarationTitle !== "COVID-19 "
  );

  // Recompute counts
  const counts = filteredSummaries.reduce((acc, summary) => {
    acc[summary.incidentType] = (acc[summary.incidentType] || 0) + 1;
    return acc;
  }, {});

  // Create the new filtered data object
  const data = {
    ...response.data,
    summaries: filteredSummaries,
    counts,
  };

  const [chartHeight, setChartHeight] = useState(400);
  const chartWrapper = useRef(null);

  const [legendShow, setLegendShow] = useState(true);

  // Set the chart height based on the width of the chart wrapper
  useEffect(() => {
    const handleResize = () => {
      setChartHeight(chartWrapper.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pieChartData = Object.entries(data.counts).map(
    ([type, count], index) => ({
      id: index,
      value: count,
      label: `${type}`,
    })
  );

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

  const pieParams = {
    height: chartHeight, // Responsive height of the chart
    margin: { right: 0 }, // Center the chart
    slotProps: { legend: { hidden: true } }, // Hide the legend
  };

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-center">
      <h2 className="text-2xl mb-4 font-semibold">
        {data.level} {data.title}
      </h2>
      <div className="text-xl">Total: {filteredSummaries.length}</div>
      <Box width="100%" ref={chartWrapper}>
        <PieChart
          series={[
            {
              data: pieChartData
                .sort((a, b) => b.value - a.value)
                .map((item, index) => ({
                  ...item,
                  color: customColors[index % customColors.length], // Assign custom colors cyclically
                })),
              highlightScope: { fade: "global", highlight: "item" },
            },
          ]}
          {...pieParams}
        ></PieChart>
      </Box>
      {legendShow && <Legend counts={data.counts} colors={customColors} />}
    </div>
  );
};

export default PieCard;
