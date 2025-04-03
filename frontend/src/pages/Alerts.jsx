import { Suspense, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CountiesContext } from "../providers/CountiesProvider";
import AlertCard from "../components/AlertCard";
import AlertCardSkeletion from "../components/loading/AlertCardSkeletion";

const Alerts = () => {
  const { selectedCounty } = useContext(CountiesContext);
  const navigate = useNavigate();

  const [countyAlertRoute, setCountyAlertRoute] = useState(null);

  useEffect(() => {
    if (!selectedCounty) {
      navigate("/");
    } else {
      const base_alert_route = `/api/alerts/`;
      setCountyAlertRoute(
        `${base_alert_route}?zone=${selectedCounty.stateInitials}C${selectedCounty.fipsCountyCode}`
      );
    }
  }, [selectedCounty, navigate]);

  return (
    <>
      {selectedCounty && (
        <div className="dark:bg-black dark:text-light bg-light text-dark p-8 flex flex-col items-center pt-18 min-h-screen space-y-4">
          <h1 className="text-4xl mt-12 font-bold">
            {selectedCounty.countyName}
          </h1>
          {countyAlertRoute && (
            <Suspense fallback={<AlertCardSkeletion/>}>
              <AlertCard route={countyAlertRoute} />
            </Suspense>
          )}
        </div>
      )}
    </>
  );
};

export default Alerts;
