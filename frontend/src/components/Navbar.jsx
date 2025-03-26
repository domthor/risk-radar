import React from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { TbWorldSearch } from "react-icons/tb";
import { FaCircleInfo } from "react-icons/fa6";
import { FaBell } from "react-icons/fa6";
// import { IoSettingsSharp } from "react-icons/io5";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";


import "react-tooltip/dist/react-tooltip.css";

const Navbar = ({darkMode, setDarkMode}) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-light dark:bg-black py-6 px-8 shadow-md shadow-gray-400 dark:shadow-gray-800 z-50 flex items-center justify-between">
      <div className="pl-8 flex items-center">
        <a
          href="/"
          className="text-5xl font-bold hover:text-black dark:hover:text-white transition duration-200 text-dark dark:text-light"
        >
          RiskRadar
        </a>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex gap-16 text-neutral-300 text-lg pr-8">
        <li
          className="text-dark dark:text-light hover:text-black dark:hover:text-white transition duration-200"
          data-tooltip-id="search"
          data-tooltip-content="Search"
        >
          <Link to="/">
            <TbWorldSearch className="text-3xl"></TbWorldSearch>
          </Link>
        </li>
        <li
          className="text-dark dark:text-light hover:text-black dark:hover:text-white transition duration-200"
          data-tooltip-id="alerts"
          data-tooltip-content="Alerts"
        >
          <Link to="/alerts">
            <FaBell className="text-3xl"></FaBell>
          </Link>
        </li>
        <li
          className="text-dark dark:text-light hover:text-black dark:hover:text-white transition duration-200"
          data-tooltip-id="about"
          data-tooltip-content="About"
        >
          <Link to="/about">
            <FaCircleInfo className="text-3xl"></FaCircleInfo>
          </Link>
        </li>
        <li
          className="text-dark dark:text-light hover:text-black dark:hover:text-white transition duration-200 cursor-pointer"
          data-tooltip-id="theme"
          data-tooltip-content="Theme"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <MdLightMode className="text-3xl"></MdLightMode>
          ) : (
            <MdDarkMode className="text-3xl"></MdDarkMode>
          )}
        </li>
        {/* <li
          className="text-dark dark:text-light hover:text-black dark:hover:text-white transition duration-200"
          data-tooltip-id="settings"
          data-tooltip-content="Settings"
        >
          <Link to="/settings">
            <IoSettingsSharp className="text-3xl"></IoSettingsSharp>
          </Link>
        </li> */}
      </ul>
      <Tooltip id="search" />
      <Tooltip id="about" />
      <Tooltip id="alerts" />
      <Tooltip id="theme" />
      {/* <Tooltip id="settings" /> */}
    </nav>
  );
};

export default Navbar;