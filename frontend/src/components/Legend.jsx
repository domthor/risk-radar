const Legend = ({ counts, colors }) => {

    // sort the counts object by value
    const sortedCounts = Object.fromEntries(
        Object.entries(counts).sort(([, a], [, b]) => b - a)
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 items-start mt-4">
      {Object.entries(sortedCounts).map(([type, count], index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="legend-color w-5 h-5 rounded-md"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span className="">
            {type} ({count})
          </span>
        </div>
      ))}
    </div>
  );
}

export default Legend