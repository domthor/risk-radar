// src/components/RecentEventsCard.jsx
import React from "react";
import { useData } from "../hooks/useData";

const RecentEventsCard = ({ route }) => {
  // useData fetches from VITE_API_URL + route
  const { data, isLoading, error } = useData(route, { enabled: !!route });

  if (isLoading) return <p>Loading recent events...</p>;
  if (error) return <p className="text-red-500">Error fetching events</p>;

  // Log the raw data for debugging
  console.log("Fetched data:", data);

  // Process the data from the nested DisasterDeclarationsSummaries array
  const events = (data?.summaries || [])
    .map((record) => ({
      title: record.declarationTitle,
      designatedArea: record.designatedArea,
      timestamp: record.declarationDate,
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  console.log("Processed events:", events);

  if (events.length === 0) {
    return <p>No recent events found.</p>;
  }

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-start shadow">
      <h2 className="text-xl font-semibold mb-2">Recent Alerts</h2>
      {events.map((event, index) => (
        <div
          key={index}
          className="mb-2 p-3 border border-gray-300 rounded shadow-sm w-full"
        >
          <h3 className="font-bold">{event.title || "Event Title"}</h3>
          <p className="mb-1">
            {event.designatedArea || "No description available."}
          </p>
          <p className="text-sm text-gray-600">
            {event.timestamp
              ? new Date(event.timestamp).toLocaleString()
              : "No date provided"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentEventsCard;
