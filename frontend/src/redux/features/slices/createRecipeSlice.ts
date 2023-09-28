import { createSlice } from "@reduxjs/toolkit";
import { CreateRecipe } from "redux/api/types";
import { RootState } from "redux/store";
import {
  getCuisineAsync,
  getIngredientsAsync,
} from "../async_functions/recipesAsync";

const initialState: CreateRecipe = {
  cuisine: "",
  title: "",
  description: "",
  thumbnail: {
    url: "",
    filename: "",
  },
  instructions: [],
  difficulty: "",
  est_time: "",
  servings:"",
  ingredients: [],
  getData: {
    cuisines: [],
    ingredients: [],
  },
};

const createRecipeSlice = createSlice({
  name: "createRecipe",
  initialState,
  reducers: {
    addTitle: (state, action) => {
      state.title = action.payload;
    },
    addServings: (state, action) => {
      state.servings = `${action.payload} people`;
    },
    addCuisine: (state, action) => {
      state.cuisine = action.payload;
    },
    addDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    addTime: (state, action) => {
      state.est_time = action.payload;
    },
    addInstruction: (state, action) => {
      state.instructions.push({ title: "", instructions: "" });
    },
    updateInstructionTitle: (state, action) => {
      const { index, title } = action.payload;
      state.instructions[index].title = title;
    },
    updateInstructionText: (state, action) => {
      const { index, text } = action.payload;
      state.instructions[index].instructions = text;
    },
    removeInstruction: (state, action) => {
      const index = action.payload;
      state.instructions.splice(index, 1);
    },
    addIngredient: (state, action) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action) => {
      const indexToRemove = action.payload;
      state.ingredients.splice(indexToRemove, 1);
    },
    addAmount: (state, action) => {
      const { index, text } = action.payload;
      state.ingredients[index].amount = text;
    },
    addIngredientNotes: (state, action) => {
      const { index, text } = action.payload;
      state.ingredients[index].notes = text;
    },
    addDesctiption: (state, action) => {
      state.description = action.payload;
    },
    addImage: (state, action) => {
      state.thumbnail.url = action.payload.url;
      state.thumbnail.filename = action.payload.filename;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCuisineAsync.fulfilled, (state, action) => {
        state.getData.cuisines = action.payload.data;
      })
      .addCase(getIngredientsAsync.fulfilled, (state, action) => {
        const data = action.payload.data;

        if (data.length > 0) {
          // Assign the new data to replace the existing array
          state.getData.ingredients = data.map((item: any) => ({
            ingredient: item.ingredient,
            amount: "", // Set the amount later
            notes: "", // Set the notes later
          }));
        } else {
          // Clear the array if there are no results
          state.getData.ingredients = [];
        }
      })
      .addCase(getIngredientsAsync.rejected, (state) => {
        state.getData.ingredients = [];
      });
  },
});

export default createRecipeSlice.reducer;
export const {
  addInstruction,
  updateInstructionTitle,
  updateInstructionText,
  removeInstruction,
  addIngredient,
  removeIngredient,
  addAmount,
  addIngredientNotes,
  addDesctiption,
  addImage,
  addDifficulty,
  addTime,
  addCuisine,
  addTitle,
  addServings
} = createRecipeSlice.actions;
export const created_recipe = (state: RootState) => state.createRecipe;
