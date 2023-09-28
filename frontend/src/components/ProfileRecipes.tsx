import React from "react";
import { useSelector } from "react-redux";
import { user } from "redux/features/slices/userSlice";
import RecipeCard from "./RecipeCard";
import { PiSmileySadThin } from "react-icons/pi"

// Displays the recipes in a profile

const ProfileRecipes = () => {
  const current_user = useSelector(user);
  const recipes = current_user.recipes;
  return (
    <div className="flex flex-wrap">
      {recipes.length > 0 ? (
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
        <div className="w-screen flex  justify-center items-start mt-12">
          <span className="text-base-content/80 text-3xl">
            No Recipes Found
          </span>
          <PiSmileySadThin className="text-base-content mt-1 ml-2 h-8 w-8"/>
        </div>
      )}
    </div>
  );
};

export default ProfileRecipes;
