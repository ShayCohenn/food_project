import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Ingredient } from "redux/api/types";
import { getIngredientsAsync } from "redux/features/async_functions/recipesAsync";
import { addIngredient, created_recipe } from "redux/features/slices/createRecipeSlice";
import { useAppDispatch } from "redux/store";

const SearchAsyncSelect = () => {
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [SelectedValue, setSelectedValue] = useState("");
  const ingredients = useSelector(created_recipe).getData.ingredients;

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleSearch = async (param: string) => {
    setIsDropdownOpen(true);
    setIsLoading(true);
    setSelectedValue(param);
    dispatch(getIngredientsAsync(param)).then(() => {
      setIsLoading(false);
    });
  };

  const handleSelect = (ing: string) => {
    setSelectedValue(ing);
    setIsDropdownOpen(false); // Close the dropdown

    // Create a new Ingredient object
    const newIngredient: Ingredient = {
      ingredient: ing,
      amount: "", // Set the amount later
      notes: "", // Set the notes later
    };

    // Dispatch the addIngredient action to add the new ingredient to Redux store
    dispatch(addIngredient(newIngredient));
  };

  return (
    <div ref={containerRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center border border-base-content p-2">
        <MagnifyingGlassIcon className="w-6 h-6 mx-1 text-base-content" />
        <input
          placeholder="Search here"
          value={SelectedValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-base-100 placeholder:text-base text-lg outline-none w-full"
        />
        {isLoading && (
          <span className="loading loading-dots loading-sm mr-2"></span>
        )}
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
        {ingredients.map((ing, index) => (
          <div
            key={index}
            className="flex items-center p-2 cursor-pointer hover:bg-base-300 border-b border-base-300"
            onClick={() => handleSelect(ing.ingredient)}>
            {ing.ingredient}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchAsyncSelect;
