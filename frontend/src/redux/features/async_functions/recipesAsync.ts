import { createAsyncThunk } from "@reduxjs/toolkit";
import * as API from "redux/api/recipesAPI"
import { createRating, getRatings } from "redux/api/recipesAPI";
import { CreateRecipeMethod } from "redux/api/types";

export const getRecipeAsync = createAsyncThunk(
    "recipes/getById",
    async (uuid:string) => {
      try {
        const response = await API.getRecipe(uuid);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getCuisineAsync = createAsyncThunk(
    "recipes/getCuisine",
    async () => {
      try {
        const response = await API.getCuisines();
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getIngredientsAsync = createAsyncThunk(
    "recipes/getIng",
    async (ingredient:string) => {
      try {
        const response = await API.getIngredients(ingredient);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const createRecipeAsync = createAsyncThunk(
    "recipes/create",
    async (data:CreateRecipeMethod) => {
      try {
        const response = await API.createRecipe(data);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const searchRecipesAsync = createAsyncThunk(
    "recipes/search",
    async (param:string) => {
      try {
        const response = await API.searchRecipes(param);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  
  export const createRatingAsync = createAsyncThunk(
    "reviews/create",
    async ({ id, rating }: { id: string; rating: number }) => {
      try {
        const response = await createRating({ id, rating }); // Pass an object with id and review properties
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getRating = createAsyncThunk(
    "reviews/get",
    async (id:string) => {
      try {
        const response = await getRatings(id); // Pass an object with id and review properties
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const createCommentAsync = createAsyncThunk(
    "reviews/create",
    async ({ id, comment }: { id: string; comment: string }) => {
      try {
        const response = await API.createComment({ id, comment }); // Pass an object with id and review properties
        return response;
      } catch (error) {
        throw error;
      }
    }
  );