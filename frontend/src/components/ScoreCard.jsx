import { useState, useEffect, useRef } from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

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

const ScoreCard = () => {
  const score = 80; // Set your target value here
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1; // Increment value
      setAnimatedValue(Math.min(current, score)); // Ensure it does not exceed targetValue
      if (current >= score) clearInterval(interval); // Stop when target is reached
    }, 10); // Adjust speed by changing interval time (smaller is faster)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [score]);

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-white dark:bg-dark rounded-md p-4 m-4">
        <h2 className="text-4xl font-semibold -mb-12">Overall Score</h2>
        <GaugeContainer
          className
          startAngle={-110}
          endAngle={110}
          width={500}
          height={500}
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
        <div className="text-center -mt-30">
          <p className="text-6xl font-semibold">{animatedValue}</p>
        </div>
      </div>
    </>
  );
};

export default ScoreCard;
