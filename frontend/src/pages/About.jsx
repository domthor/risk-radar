import React from 'react';
import { PiPoliceCarBold } from "react-icons/pi";
import { GoAlert } from "react-icons/go";
import { FaHouseChimney } from "react-icons/fa6";

const About = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center dark:bg-black dark:text-neutral-300 bg-light text-black p-8 space-y-8">

      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold mb-4">
          About RiskRadar
        </h2>
        <p className="mb-6 leading-relaxed">
          RiskRadar is an advanced safety application designed to provide users 
          with real-time statistics on disaster and crime rates for specific U.S. 
          counties.
        </p>

        <h3 className="text-2xl font-semibold mb-2">
          Data-Driven Safety Insights
        </h3>
        <p className="mb-6 leading-relaxed">
          By leveraging trusted sources such as OpenFEMA APIs and FBI/DOJ crime 
          reports, RiskRadar helps users make informed safety decisions.
        </p>

        <h3 className="text-2xl font-semibold mb-2">
          Who Can Benefit?
        </h3>
        <ul className="list-disc list-inside mb-6 leading-relaxed">
          <li>
            <span className="inline-flex items-center gap-2">
              Individuals moving to a new county
              <FaHouseChimney />
            </span>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              Residents in disaster-prone areas
              <GoAlert />
            </span>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              Anyone concerned about local safety trends
              <PiPoliceCarBold />
            </span>
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mb-2">
          Why RiskRadar?
        </h3>
        <p className="leading-relaxed">
          Currently, no centralized platform offers this type of safety data in 
          an accessible format. RiskRadar bridges that gap by providing clear, 
          up-to-date insights, helping users better prepare for potential risks.
        </p>
      </div>
    </div>
  );
}

export default About;
