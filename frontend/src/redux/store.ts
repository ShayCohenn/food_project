import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from 'redux/features/slices/userSlice'
import recipeReducer from 'redux/features/slices/recipeSlice'
import createRecipeReducer from 'redux/features/slices/createRecipeSlice'
import searchedUsers from 'redux/features/slices/searchUserSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    recipe: recipeReducer,
    createRecipe:createRecipeReducer,
    searchedUsers:searchedUsers
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>