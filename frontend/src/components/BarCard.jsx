import { useData } from "../hooks/useData";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import { useEffect, useState, useRef } from "react";

const BarCard = ({ route }) => {
  const response = useData(route);
  const data = response.data;
  const [chartHeight, setChartHeight] = useState(400);
  const chartWrapper = useRef(null);

  // Set the chart height based on the width of the chart wrapper
  useEffect(() => {
    const handleResize = () => {
      setChartHeight(Math.min(chartWrapper.current.offsetWidth, 400));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-center">
      <h2 className="text-2xl mb-4 font-semibold">
        {data.level} {data.title}
      </h2>
      <Box width="100%" ref={chartWrapper}>
        <BarChart
          height={chartHeight}
          series={[
            { data: data.counts, label: "Violent Crime", id: "violentCrime" },
          ]}
          xAxis={[{ data: data.xLabels, scaleType: "band" }]}
        />
      </Box>
    </div>
  );
};

export default BarCard;
