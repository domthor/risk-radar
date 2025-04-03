import { useData } from "../hooks/useData";

const AlertCard = ({ route }) => {
  const response = useData(route);
  const data = response.data;

  return (
    <div className="bg-white dark:bg-dark rounded-md p-4 w-full flex flex-col items-center shadow">
      <h2 className="text-xl font-semibold mb-2">Recent Alerts</h2>
      {data.length === 0 && (
        <div>
          No alerts available for this county.
        </div>
      )}

      {data.length > 0 &&
        data.map((alert, index) => (
          <div
            key={index}
            className="mb-2 p-3 border border-gray-300 rounded shadow-sm w-full flex flex-col space-y-2"
          >
            <div>
              {" "}
              <span className="font-semibold mr-2">Event:</span>
              <span className="">{alert.capEvent}</span>
            </div>
            <div>
              <span className="font-semibold mr-2">
                Effective:
              </span>
              <span>{alert.capEffective}</span>
            </div>
            <div>
              <span className="font-semibold mr-2">Expires:</span>
              <span>{alert.capExpires}</span>
            </div>
            <div>
              <span className="font-semibold mr-2">Urgency:</span>
              <span>{alert.capUrgency}</span>
            </div>
            <div>
              <span className="font-semibold mr-2">
                Severity:
              </span>
              <span
                className={`
                ${
                  alert.capSeverity === "Severe" ? "text-red-600 font-bold" : ""
                }
                ${
                  alert.capSeverity === "Moderate"
                    ? "text-yellow-600 font-bold"
                    : ""
                }
                ${alert.capSeverity === "Minor" ? "text-blue-600" : ""}
            `}
              >
                {alert.capSeverity}
              </span>
            </div>
            <div>
              <span className="font-semibold mr-2">
                Certainty:
              </span>
              <span>{alert.capCertainty}</span>
            </div>
            <div>
              <span className="font-semibold mr-2">
                Area Description:
              </span>
              <span>{alert.capAreaDesc}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AlertCard;
