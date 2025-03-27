import { useState, useEffect, useRef } from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { useData } from "../hooks/useData";

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

const ScoreCard = ({ route }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const response = useData(route);
  const data = response.data;
  const score = data.score;

  const [chartHeight, setChartHeight] = useState(350);
  const chartWrapper = useRef(null);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1; // Increment value
      setAnimatedValue(Math.min(current, score)); // Ensure it does not exceed targetValue
      if (current >= score) clearInterval(interval); // Stop when target is reached
    }, 10); // Adjust speed by changing interval time (smaller is faster)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [score]);

  // Set the chart height based on the width of the chart wrapper
  useEffect(() => {
    const handleResize = () => {
      console.log(chartWrapper.current.offsetWidth);
      setChartHeight(Math.min(chartWrapper.current.offsetWidth, 350));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="bg-white dark:bg-dark rounded-md p-4 flex w-full sm:w-1/2 lg:w-1/3 flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Overall Score</h2>
        <div ref={chartWrapper} className="flex -my-12 w-full">
          <GaugeContainer
            className
            startAngle={-110}
            endAngle={110}
            width={chartHeight}
            height={chartHeight}
            value={animatedValue}
            sx={() => ({
              [`& .value-arc`]: {
                fill:
                  animatedValue < 25
                    ? "red"
                    : animatedValue > 75
                    ? "green"
                    : "orange",
              },
            })}
          >
            <GaugeReferenceArc />
            <GaugeValueArc className="value-arc" />
            <GaugePointer />
          </GaugeContainer>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold">{animatedValue}</p>
        </div>
      </div>
    </>
  );
};

export default ScoreCard;
