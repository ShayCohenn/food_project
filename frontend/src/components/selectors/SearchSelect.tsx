import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Cuisines } from "redux/api/types";
import { FaChevronDown } from "react-icons/fa";
import {
  addCuisine,
  created_recipe,
} from "redux/features/slices/createRecipeSlice";
import { useAppDispatch } from "redux/store";

const SearchSelect = () => {
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [SelectedValue, setSelectedValue] = useState("");
  const cuisines = useSelector(created_recipe).getData.cuisines;
  const [filteredOptions, setFilteredOptions] = useState<Cuisines[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null); // Specify the type as HTMLDivElement | null

  useEffect(() => {
    setFilteredOptions(cuisines);
  }, [cuisines]);

  // Add a click event listener to the document
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Check if the click occurred outside the component container
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSearch = (param: string) => {
    setSelectedValue(param);
    const filtered = cuisines.filter((cuisine) =>
      cuisine.cuisine.toLowerCase().includes(param.toLowerCase()) ||
      cuisine.country.toLowerCase().includes(param.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (cuisine: Cuisines) => {
    setSelectedValue(cuisine.cuisine);
    setIsDropdownOpen(false); // Close the dropdown
    dispatch(addCuisine(cuisine.cuisine));
  };

  return (
    <div ref={containerRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center border border-base-content p-2">
        <MagnifyingGlassIcon className="w-6 h-6 mx-1 text-base-content" />
        <input
          value={SelectedValue}
          placeholder="Search here"
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-base-100 placeholder:text-base text-lg outline-none w-full"
        />
        <div className="w-6 h-5 border-l border-base-content">
          <FaChevronDown
            className={`w-full h-3 mt-1 ml-1 transition-transform transform duration-200
          ${isDropdownOpen ? "opacity-50" : "-rotate-90 opacity-100"}`}
          />
        </div>
      </div>
      <div
        className={`${
          isDropdownOpen ? "" : "hidden"
        } bg-base-100 border border-base-content w-full shadow-lg max-h-36 overflow-y-scroll`}>
        {filteredOptions.map((cuisine) => (
          <div
            key={cuisine.cuisine}
            className="flex items-center p-2 cursor-pointer hover:bg-base-300 border-b border-base-300"
            onClick={() => handleSelect(cuisine)}>
            <img
              className="w-7 h-5 mr-2"
              src={cuisine.flag}
              alt={cuisine.cuisine}
            />
            {cuisine.cuisine}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSelect;
