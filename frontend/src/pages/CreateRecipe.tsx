import Layout from "components/Layout";
import SearchAsyncSelect from "components/selectors/SearchAsyncSelect";
import SearchSelect from "components/selectors/SearchSelect";
import Select from "components/selectors/Select";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createRecipeAsync,
  getCuisineAsync,
} from "redux/features/async_functions/recipesAsync";
import { useAppDispatch } from "redux/store";
import { HiX } from "react-icons/hi";
import Instructions from "components/Instructions";
import { useSelector } from "react-redux";
import {
  addAmount,
  addDesctiption,
  addDifficulty,
  addImage,
  addIngredientNotes,
  addServings,
  addTime,
  addTitle,
  created_recipe,
  removeIngredient,
} from "redux/features/slices/createRecipeSlice";
import { a_token, user } from "redux/features/slices/userSlice";
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firebaseConfig } from "config";
import { v4 as uuidv4 } from "uuid";
import { CreateRecipeMethod } from "redux/api/types";
import { MdAccessTime } from "react-icons/md";
import { LuChefHat } from "react-icons/lu";
import { GiBiceps } from "react-icons/gi";
import { GoPeople } from "react-icons/go";
import { useJwt } from "react-jwt";

const CreateRecipe = () => {
  const dispatch = useAppDispatch();
  const create_recipe = useSelector(created_recipe);
  const selfuser = useSelector(user);
  const difficultyOptions = ["Beginner", "Amateur", "Cook", "Chef"];
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const [image, setImage] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const access_token = useSelector(a_token) || "";
  const expired_access_token = useJwt(access_token).isExpired;

  useEffect(()=>{
    expired_access_token && navigate("/login")
  },[expired_access_token])

  useEffect(() => {
    dispatch(getCuisineAsync());
  }, [dispatch]);

  useEffect(() => {
    setImage(create_recipe.thumbnail.url);
  }, [create_recipe.thumbnail]);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0]; // Get the selected file
    const filename = uuidv4();
    const storageRef = ref(
      storage,
      `recipe_images/${selfuser.username}/${filename}`
    );

    try {
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Update the avatar URL and filename in the state to display the uploaded image
      dispatch(addImage({ url: downloadURL, filename: filename }));

      // You can save the downloadURL and filename in your database or use them as needed
      console.log("File uploaded:", downloadURL);
    } catch (error) {
      // Handle the error
      console.error("Error uploading file:", error);
    }
  };

  const handleImageRemove = async () => {
    if (image) {
      try {
        const storageRef = ref(
          storage,
          `recipe_images/${selfuser.username}/${create_recipe.thumbnail.filename}`
        );

        // Delete the image file from Firebase Storage
        await deleteObject(storageRef);

        // Update the state to remove the image
        setImage("");

        // You can also clear the filename from your Redux state or perform any other necessary actions
        dispatch(addImage({ url: "", filename: "" }));

        console.log("Image removed from Firebase Storage.");
      } catch (error) {
        console.error("Error removing image from Firebase Storage:", error);
      }
    }
  };

  const handleSelectionChange = (selectedValue: string, type: string) => {
    if (type === "difficulty") {
      dispatch(addDifficulty(selectedValue));
    } else if (type === "time") {
      const time_str = `${time} ${selectedValue}`;
      dispatch(addTime(time_str));
    }
  };

  const uploadRecipe = () => {
    setIsLoading(true);

    // Format your data object to match the API's expected structure
    const data: CreateRecipeMethod = {
      cuisine: create_recipe.cuisine,
      title: create_recipe.title,
      description: create_recipe.description,
      difficulty: create_recipe.difficulty,
      est_time: create_recipe.est_time,
      servings: create_recipe.servings,
      directions: create_recipe.instructions.map((instruction) => ({
        title: instruction.title,
        instructions: instruction.instructions,
      })),
      thumbnail: create_recipe.thumbnail.url,
      ingredients: create_recipe.ingredients.map((ingredient) => ({
        ingredient: ingredient.ingredient,
        amount: ingredient.amount,
        notes: ingredient.notes,
      })),
    };

    dispatch(createRecipeAsync(data))
      .then((action) => {
        if (createRecipeAsync.fulfilled.match(action)) {
          const uuid = action.payload.data.uuid;
          setTimeout(() => {
            setIsLoading(false);
            navigate(`/recipe/${uuid}`);
          }, 2000);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the dispatch
        console.error("Error creating recipe:", error);
      });
  };

  return (
    <Layout title="Create Recipe" content="Create a new recipe">
      <div className="flex flex-col">
        <div className="mt-28">
          <div className="container mx-auto p-4">
            <div className="flex xs:flex-col-reverse">
              {/* Recipe Details */}
              <div className="w-full p-4 relative">
                <div className="text-3xl font-semibold mb-2">
                  <div className="text-base-content font-bold text-base">
                    Title:
                  </div>
                  <input
                    placeholder="Recipe name"
                    className="input-text text-lg h-10"
                    onChange={(e) => dispatch(addTitle(e.target.value))}
                  />
                </div>
                <hr className="border-t-2 border-base-content" />
                <div className="max-h-[560px] overflow-y-scroll pb-52">
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center mt-4">
                      <LuChefHat className="text-base-content mr-1 h-5 w-5" />
                      <span className="text-lg font-medium">Cuisine:</span>
                    </div>
                    <SearchSelect />
                  </div>
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center">
                      <GiBiceps className="text-base-content mr-1 h-5 w-5" />
                      <span className="text-lg font-medium">Difficulty:</span>
                    </div>
                    <Select
                      options={difficultyOptions}
                      title="Select difficulty"
                      type="difficulty" // Specify the type as "difficulty"
                      onSelectChange={handleSelectionChange} // Pass the same callback for both selections
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center">
                      <MdAccessTime className="text-base-content mr-1 h-5 w-5" />
                      <span className="text-lg font-medium">
                        Estimated Time:
                      </span>
                    </div>
                    <input
                      type="number"
                      placeholder="amount of time"
                      className="border border-base-content bg-base-100 p-2"
                      onChange={(e) => {
                        setTime(e.target.value);
                        dispatch(addTime(e.target.value));
                      }}
                    />
                    <Select
                      options={["Minutes", "Hours"]}
                      title="min/hrs"
                      type="time" // Specify the type as "time"
                      onSelectChange={handleSelectionChange} // Pass the same callback for both selections
                    />
                  </div>
                  <div className="mb-4 flex items-end">
                    <GoPeople className="text-base-content mr-1 h-5 w-5 mb-1" />
                    <span className="text-lg font-medium">Servings:</span>
                    <input
                      type="number"
                      placeholder=""
                      className="border-b border-t-0 border-l-0 border-r-0 border-base-content bg-base-100 p-2 max-w-[80px]"
                      onChange={(e) => dispatch(addServings(e.target.value))}
                    />
                    People
                  </div>
                  <hr className="border-t-1 border-base-content" />
                  {/* Ingredients */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      Ingredients:
                    </h2>
                    <ul>
                      {create_recipe.ingredients.map((ing, index) => (
                        <li
                          className="border-2 p-2 border-base-content"
                          key={index}>
                          <div className="flex justify-between">
                            <span className="font-semibold text-lg">
                              {ing.ingredient}:
                            </span>
                            <HiX
                              className="h-5 w-5 text-rose-500 cursor-pointer hover:bg-red-800/30"
                              onClick={() => dispatch(removeIngredient(index))}
                            />
                          </div>
                          <div className="flex flex-wrap items-center">
                            <span className="">Amount:</span>
                            <input
                              className="max-w-[120px] bg-base-100 border-b border-base-content outline-none pl-2"
                              onChange={(e) =>
                                dispatch(
                                  addAmount({ index, text: e.target.value })
                                )
                              }
                            />
                            <div>
                              <span className="">Notes:</span>
                              <input
                                onChange={(e) =>
                                  dispatch(
                                    addIngredientNotes({
                                      index,
                                      text: e.target.value,
                                    })
                                  )
                                }
                                className="max-w-[120px] bg-base-100 border-b border-base-content outline-none pl-2"
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <SearchAsyncSelect />
                  </div>
                </div>
                <button
                  onClick={uploadRecipe}
                  className={`btn btn-primary mt-2 w-full ${
                    isLoading ? "opacity-70 cursor-wait" : ""
                  }`}>
                  {isLoading && (
                    <span className="loading loading-spinner loading-md"></span>
                  )}
                  {isLoading ? "Uploading recipe..." : "Upload Recipe"}
                </button>
              </div>

              {/* Recipe Image */}
              <div className="w-full p-4">
                <div className="flex items-center">
                  <span className="text-2xl font-medium mr-2">Recipe By:</span>
                  <Link to={`/profile/}`} className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={selfuser.my_profile_pic} alt=""></img>
                    </div>
                    <span className="text-xl mx-3 mt-2">
                      {selfuser.username}
                    </span>
                  </Link>
                </div>
                <div className="h-[600px] border border-base-content flex items-center justify-center flex-col">
                  {image === "" ? (
                    <input type="file" onChange={handleImageUpload} />
                  ) : (
                    <button
                      onClick={handleImageRemove}
                      className="btn btn-outline btn-error">
                      Remove
                    </button>
                  )}
                  <img src={image ? image : ""} alt="Recipe" />
                </div>
                <textarea
                  className="bg-base-100 w-full mt-1 italic"
                  placeholder="Description(optional)"
                  onChange={(e) =>
                    dispatch(addDesctiption(e.target.value))
                  }></textarea>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Instuctions:</h2>
              <Instructions />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRecipe;
