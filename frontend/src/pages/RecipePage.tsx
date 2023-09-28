import Layout from "components/Layout";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getRecipeAsync } from "redux/features/async_functions/recipesAsync";
import {
  clearRecipeState,
  selected_recipe,
} from "redux/features/slices/recipeSlice";
import { useAppDispatch } from "redux/store";
import { MdAccessTime } from "react-icons/md";
import { LuChefHat } from "react-icons/lu";
import { GiBiceps } from "react-icons/gi";
import { GoPeople } from "react-icons/go";
import { Rating, Typography } from "@material-tailwind/react";
import Reviews from "components/Reviews";
import RecipePageSkeleton from "components/skeletons/RecipePageSkeleton";

const RecipePage = () => {
  const { uuid } = useParams();
  const recipe = useSelector(selected_recipe)[0];
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearRecipeState());
    uuid && dispatch(getRecipeAsync(uuid));
  }, [uuid, dispatch]);

  if (!recipe) {
    return <RecipePageSkeleton />; // You can show a loading indicator
  }

  return (
    <Layout title={recipe.title} content="recipe">
      <div className="flex flex-col">
        <div className="mt-28">
          <div className="container mx-auto p-4">
            <div className="flex xs:flex-col-reverse">
              {/* Recipe Details */}
              <div className="w-full p-4 relative">
                <h1 className="text-2xl font-semibold mb-2">{recipe.title}</h1>
                <hr className="border-t-2 border-base-content" />
                <div className="max-h-[600px] overflow-y-scroll">
                  <div className="flex items-center mb-4">
                    <LuChefHat className="text-gray-500 mr-1 h-5 w-5" />
                    <span className="text-gray-500 font-bold">Cuisine: </span>
                    <span className="text-base-content font-medium ml-2">
                      {recipe.cuisine.cuisine}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <GiBiceps className="text-gray-500 mr-1 h-5 w-5" />
                    <span className="text-gray-500 font-bold">
                      Difficulty:{" "}
                    </span>
                    <span className="text-base-content font-medium ml-2">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <MdAccessTime className="text-gray-500 mr-1 h-5 w-5" />
                    <span className="text-gray-500 font-bold">
                      Estimated Time:
                    </span>
                    <span className="text-base-content font-medium ml-2">
                      {recipe.est_time}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <GoPeople className="text-gray-500 mr-1 h-5 w-5" />
                    <span className="text-gray-500 font-bold">Servings:</span>
                    <span className="text-base-content font-medium ml-2">
                      {recipe.servings}
                    </span>
                  </div>
                  <hr className="border-t-1 border-base-content" />

                  {/* Ingredients */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
                    <ul className="list-disc pl-4">
                      {recipe.ingredients.map((ingredient) => (
                        <li className="ml-1">
                          <span className="font-semibold text-lg">
                            {ingredient.amount} {ingredient.ingredient}
                          </span>{" "}
                          {ingredient.notes ? `- ${ingredient.notes}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr className="border-t-1 border-base-content" />

                  {/* Instructions */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Instructions:
                    </h2>
                    <ol className="list-decimal pl-4">
                      {recipe.instructions.map((step) => (
                        <li className="my-2">
                          <h3 className="text-xl font-medium">{step.title}:</h3>
                          {step.instructions}
                          <hr className="border-t-1 border-base-content" />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-base-100 via-base-100 to-transparent shadow-inner"></div>
              </div>

              {/* Recipe Image */}
              <div className="w-full p-4">
                <div className="flex items-center gap-2">
                  <Rating
                    value={Math.round(parseFloat(recipe.average_rating))}
                    readonly
                  />
                  <Typography color="blue-gray" className="font-medium">
                    {recipe.average_rating} Rated, ({recipe.user_count} Ratings)
                  </Typography>
                </div>
                <div className="flex items-center"></div>
                <div>
                  <img
                    src={recipe.thumbnail}
                    alt="Recipe"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-medium mr-2">Recipe By:</span>
                  <Link
                    to={`/profile/${recipe.user.username}`}
                    className="avatar">
                    <div className="w-7 h-7 rounded-full mt-2">
                      <img src={recipe.user.profile_pic} alt={recipe.title} />
                    </div>
                    <span className="text-xl mx-1 mt-2">
                      {recipe.user.username}
                    </span>
                  </Link>
                </div>
                <hr className="border-t-1 border-base-content" />
                <p className="font-mono italic">"{recipe.description}"</p>
              </div>
            </div>
            <Reviews />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipePage;
