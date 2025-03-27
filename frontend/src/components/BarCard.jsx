import { useData } from "../hooks/useData";
import { BarChart } from "@mui/x-charts/BarChart";
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

  const formatLargeNumbers = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`; // 1M+
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`; // 1K+
    return value; // Less than 1K
  };

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold">{data.title}</h2>
      <div ref={chartWrapper} className="flex w-full">
        <BarChart
          height={chartHeight}
          yAxis={[{ valueFormatter: formatLargeNumbers }]} // Format large numbers
          series={[
            {
              data: data.counts,
              label: "Violent Crime",
              id: "violentCrime",
            },
          ]}
          xAxis={[{ data: data.xLabels, scaleType: "band" }]}
        />
      </div>
    </div>
  );
};

export default BarCard;
