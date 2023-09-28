import React from "react";
import { useSelector } from "react-redux";
import { selected_recipe } from "redux/features/slices/recipeSlice";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./skeletons/RecipeCardSkeleton";

// Results of the Recipes Search page

const RecipeSearchResults = ({ loading }: { loading: boolean }) => {
  const recipes = useSelector(selected_recipe);

  return (
    <div>
      <div className="mt-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="flex flex-wrap">
          {!loading ? (
            recipes.map((recipe, index) => (
              <div key={index} className="m-4">
                <RecipeCard
                  image={recipe.thumbnail}
                  title={recipe.title}
                  uuid={recipe.uuid}
                  avg_rating={recipe.average_rating}
                  rating_count={recipe.user_count}
                />
              </div>
            ))
          ) : (
            <div className="m-4 flex flex-wrap">
              <RecipeCardSkeleton />
              <RecipeCardSkeleton/>
              <RecipeCardSkeleton/>
              <RecipeCardSkeleton/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchResults;
