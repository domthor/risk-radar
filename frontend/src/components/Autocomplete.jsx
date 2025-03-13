import React, { useState, useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidDownArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Autocomplete = ({ options, setSelectedCounty }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted index

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Auto-focus input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter options based on the input value
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setFilteredOptions(
        options.filter((option) =>
          option.countyName.toLowerCase().includes(value.toLowerCase())
        )
      );
      setIsOpen(true);
      setHighlightedIndex(0); // Reset highlight to first option
    } else {
      setFilteredOptions(options);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setInputValue(option.countyName);
    setSelectedCounty(option);
    setIsOpen(false);
    navigate("/score/");
  };

  // Handle clear input value
  const handleClear = () => {
    setInputValue(""); // Clear input value
    setFilteredOptions(options); // Reset filtered options
    setIsOpen(false); // Close dropdown
    setHighlightedIndex(-1); // Reset highlighted index
  };

  const handleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleOptionSelect(filteredOptions[highlightedIndex]);
    }
  };

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <>
      <div className="flex items-center">
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className="w-full p-2 pr-10 border border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
              className={`p-2 cursor-pointer ${
                highlightedIndex === index ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
            >
              {option.countyName}
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
    </>
  );
};

export default Autocomplete;
