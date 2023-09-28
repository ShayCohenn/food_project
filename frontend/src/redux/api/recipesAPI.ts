import axios from "axios";
import { API_URL } from "config/index";
import { CreateRecipeMethod } from "./types";

export const getRecipe = async (uuid: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/recipes/search?recipe_id=${uuid}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCuisines = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes/cuisine/search`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getIngredients = async (ingredient: string) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/ing?q=${ingredient}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createRecipe = async (data: CreateRecipeMethod) => {
  try {
    const response = await axios.post(`${API_URL}/recipes/new/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchRecipes = async (param: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/recipes/search?title=${param}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createRating = async ({
  id,
  rating,
}: {
  id: string;
  rating: number;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/reviews/recipe/rate/${id}/`,
      { rating: rating }, // Send rating as a JSON object
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRatings = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/rate/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createComment = async ({
  id,
  comment,
}: {
  id: string;
  comment: string;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/reviews/recipe/comment/${id}/`,
      { comment: comment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getComment = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/comment/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};
