import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidDownArrow } from "react-icons/bi";

const Autocomplete = ({ options }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState();
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on the input value
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setFilteredOptions(
        options.filter(
          (option) => option.toLowerCase().includes(value.toLowerCase()) // Access county_name property
        )
      );
    } else {
      setFilteredOptions(options);
    }

    setIsOpen(value.length > 0);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setInputValue(option);
    setIsOpen(false);
  };

  // Handle clear input value
  const handleClear = () => {
    setInputValue(""); // Clear input value
    setFilteredOptions(options); // Reset filtered options
    setIsOpen(false); // Close dropdown
  };

  const handleDropdown = () => {
    console.log("filter options", filteredOptions);
    setIsOpen(!isOpen); // Toggle dropdown
  };

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div className="relative w-1/5">
      <div className="flex items-center">
        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to search..."
          className="w-full p-2 pr-10 border border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />

        {/* Clear Button */}
        {inputValue && (
          <button onClick={handleClear} className="absolute right-10">
            <RxCross2 />
          </button>
        )}

        {/* Dropdown Arrow */}
        <button className="absolute right-2 " onClick={handleDropdown}>
          <BiSolidDownArrow />
        </button>
      </div>

      {/* Suggestions List */}
      {isOpen && filteredOptions.length > 0 && (
        <ul className="custom-scrollbar absolute left-0 right-0 mt-1 bg-light border border-dark rounded-md shadow-lg max-h-60 overflow-auto z-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* No options found */}
      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute left-0 right-0 mt-1 p-2 text-gray-500 dark:text-gray-400">
          No options found
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
