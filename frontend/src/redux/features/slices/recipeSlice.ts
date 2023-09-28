import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import {
  getRecipeAsync,
  searchRecipesAsync,
} from "../async_functions/recipesAsync";
import { Ingredient, Recipe } from "redux/api/types";

const initialState: Recipe[] = [];

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    clearRecipeState: (state) => {
      state.length = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipeAsync.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.length = 0;

        if (data.length > 0) {
          data.forEach((result: any) => {
            state.push({
              uuid: result.uuid,
              cuisine: {
                cuisine: result.cuisine.cuisine,
                flag: result.cuisine.flag,
                country: result.cuisine.country,
              },
              title: result.title,
              description: result.description,
              thumbnail: result.thumbnail,
              instructions: result.directions,
              post_date: result.post_date,
              difficulty: result.difficulty,
              est_time: result.est_time,
              servings: result.servings,
              ratings: result.ratings,
              comments: result.comments,
              tags: result.tags,
              user: result.user,
              average_rating: result.average_rating,
              user_count: result.user_count,
              ingredients: result.ingredients.map((ingredient: Ingredient) => ({
                ingredient: ingredient.ingredient,
                amount: ingredient.amount,
                notes: ingredient.notes,
              })),
            });
          });
        }
      })
      .addCase(searchRecipesAsync.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.length = 0;

        if (data.length > 0) {
          data.forEach((result: any) => {
            state.push({
              uuid: result.uuid,
              cuisine: {
                cuisine: result.cuisine.cuisine,
                flag: result.cuisine.flag,
                country: result.cuisine.country,
              },
              title: result.title,
              description: result.description,
              thumbnail: result.thumbnail,
              instructions: result.directions,
              post_date: result.post_date,
              difficulty: result.difficulty,
              est_time: result.est_time,
              servings: result.servings,
              tags: result.tags,
              ratings: result.ratings,
              comments: result.comments,
              user: result.user,
              average_rating: result.average_rating,
              user_count: result.user_count,
              ingredients: result.ingredients.map((ingredient: Ingredient) => ({
                ingredient: ingredient.ingredient,
                amount: ingredient.amount,
                notes: ingredient.notes,
              })),
            });
          });
        }
      });
  },
});

export default recipeSlice.reducer;
export const { clearRecipeState } = recipeSlice.actions;
export const selected_recipe = (state: RootState) => state.recipe;
