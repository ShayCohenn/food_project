import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const Select = ({
  options,
  title,
  onSelectChange,
  type, // Add a "type" prop to specify the selection type
}: {
  options: string[];
  title: string;
  onSelectChange: (selectedValue: string, type: string) => void; // Include "type" in the callback
  type: string; // Define the "type" prop
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const clearSelection = () => {
    setSelectedValue("");
  };

  return (
    <div ref={containerRef}>
      <div
        className="flex items-center border border-base-content p-2 "
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="bg-base-100 text-base outline-none w-full">
          {selectedValue ? selectedValue : title}
        </div>
        {selectedValue && (
          <button className="mx-1" onClick={clearSelection}>
            <FaTimes />
          </button>
        )}
        <div className="w-6 h-5 border-l border-base-content">
          <FaChevronDown
            className={`${
              isDropdownOpen ? "opacity-50" : "-rotate-90 opacity-100"
            } w-full h-3 mt-1 ml-1 transition-transform transform duration-200`}
          />
        </div>
      </div>
      <div
        className={`${
          isDropdownOpen ? "" : "hidden"
        } bg-base-100 border border-base-content w-full shadow-lg max-h-44 overflow-y-scroll`}>
        {options.map((option) => (
          <div
            key={option}
            onClick={() => {
              setSelectedValue(option);
              setIsDropdownOpen(false);
              onSelectChange(option, type); // Pass the "type" to the callback
            }}
            className="flex items-center p-2 cursor-pointer hover:bg-base-300 border-b border-base-300">
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
