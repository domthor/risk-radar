import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useData } from "../hooks/useData";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export const PieCard = ({ route }) => {
  const response = useData(route);
  const data = response.data;

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
    height: 500,
    margin: { right: 5 },
    slotProps: { legend: { hidden: true } },
  };

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-1/3 h-auto flex flex-col items-center">
      <h2 className="text-2xl mb-4 font-semibold">
        {data.level} {data.title}
      </h2>
      <div className="text-xl">Total: {data.total}</div>
      <Stack direction="row" width="100%" textAlign="center" spacing={2}>
        <Box flexGrow={1}>
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
                arcLabel: (params) => params.label ?? "",
                arcLabelMinAngle: 20,
                arcLabelRadius: 150,
              },
            ]}
            {...pieParams}
          ></PieChart>
        </Box>
      </Stack>
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
