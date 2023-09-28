import Layout from "components/Layout";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch } from "redux/store";
import { searchRecipesAsync } from "redux/features/async_functions/recipesAsync";
import RecipeSearchResults from "components/RecipeSearchResults";
import RecipeCardSkeleton from "components/skeletons/RecipeCardSkeleton";

const RecipeSearchPage = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(searchRecipesAsync(""));
  }, [dispatch]);

  const handleSearch = async () => {
    setIsLoading(true);
    await dispatch(searchRecipesAsync(input));
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Enter key was pressed (key code 13)
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout title="Search Recipes" content="search">
      <div className="mt-28 w-full flex flex-col items-center">
        <div className="border border-base-content w-10/12 max-w-[1000px] flex rounded-full h-12 items-center">
          <MagnifyingGlassIcon className="w-6 h-6 ml-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder={`Search Recipes here`}
            className="bg-transparent w-full h-full rounded-r-full text-xl pl-3 outline-none"
            onKeyPress={handleKeyPress} // Attach handleKeyPress to onKeyPress event
          />
          {input && (
            <FaTimes
              onClick={() => setInput("")}
              className="h-4 w-4 text-rose-800/80 mr-4"
            />
          )}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`${
              isLoading ? "opacity-50" : ""
            } hover:bg-base-300 xs:text-sm w-2/6 max-w-[90px] h-full rounded-r-full border-l border-base-content bg-base-200 text-xl`}>
            search
          </button>
        </div>
        {isLoading ? (
          <RecipeSearchResults loading={true} />
        ) : (
          <RecipeSearchResults loading={false} />
        )}
      </div>
    </Layout>
  );
};

export default RecipeSearchPage;
