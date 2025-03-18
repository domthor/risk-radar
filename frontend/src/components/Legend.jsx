import { useState } from "react";

const Legend = ({ counts, colors }) => {
  const [showAll, setShowAll] = useState(false);

  // Sort counts by value
  const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a);

  // Show only top 6 by default
  const displayedCounts = showAll ? sortedCounts : sortedCounts.slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 items-start mt-4">
      {displayedCounts.map(([type, count], index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="legend-color w-5 h-5 rounded-md"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span>
            {type} ({count})
          </span>
        </div>
      ))}
      {sortedCounts.length > 6 && (
        <button
          className="col-span-2 text-blue-500 mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Legend;
