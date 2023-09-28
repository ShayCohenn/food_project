import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import {
  loginAsync,
  checkUserExistsAsync,
  getUserDataAsync,
  refreshTokenAsync,
} from "../async_functions/userAsyncSlice";
import { UserProperties } from "redux/api/types";
import jwtDecode from "jwt-decode";
import { profile_pic_placeholder } from "config";

const token = localStorage.getItem("access_token") || null;
let username = ""; // Define username with a default value

if (token) {
  const decodedToken: { username?: string } = jwtDecode(token);
  username = decodedToken.username || ""; // Update username if the token exists
}

const initialState: UserProperties = {
  access: localStorage.getItem("access_token") || "",
  refresh: localStorage.getItem("refresh_token") || "",
  isUserExists: "yes" || "no" || "waiting",
  theme: localStorage.getItem("theme") || "light",
  user: {
    username: username || "",
    email: "",
    id: "",
    profile_pic: "",
    my_profile_pic:
      localStorage.getItem("profile_pic") || profile_pic_placeholder,
    total_followers: 0,
    total_following: 0,
    total_recipes: 0,
    my_followers: [],
    my_following: [],
    followers: [],
    following: [],
    isFollowing: false,
    isOwner: false,
    recipes: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.access = "";
      state.refresh = "";
      state.user.username = "";
      state.user.email = "";
      state.user.profile_pic = profile_pic_placeholder;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("profile_pic");
    },
    theme_change(state, action) {
      state.theme = action.payload;
    },
    updateAccessToken(state, action) {
      state.access = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { response, rememberMe } = action.payload;
        state.access = response.access;
        state.refresh = response.refresh;
        state.user.username = response.username;

        if (rememberMe && state.refresh)
          localStorage.setItem("refresh_token", state.refresh);

        state.access && localStorage.setItem("access_token", state.access);
      })
      .addCase(checkUserExistsAsync.fulfilled, (state, action) => {
        state.isUserExists = "yes";
        const res = action.payload.data;
        if (res.isOwner === true) {
          state.user.email = res.user.email;
          state.user.id = res.user.id;
          state.user.profile_pic = res.user_properties.profile_pic;
        } else {
          state.user.profile_pic = res.profile_pic;
        }
        state.user.total_followers = res.total_followers;
        state.user.total_following = res.total_following;
        state.user.total_recipes = res.total_recipes;
        state.user.isFollowing = res.isFollowing;
        state.user.isOwner = res.isOwner;
        state.user.followers = res.followers;
        state.user.following = res.following;
        state.user.recipes = res.recipes;
      })
      .addCase(checkUserExistsAsync.pending, (state) => {
        state.isUserExists = "waiting";
        state.user.profile_pic = profile_pic_placeholder;
      })
      .addCase(checkUserExistsAsync.rejected, (state) => {
        state.isUserExists = "no";
      })
      .addCase(getUserDataAsync.fulfilled, (state, action) => {
        const res = action.payload.data;
        localStorage.setItem("profile_pic", res.user_properties.profile_pic);
        state.user.my_followers = res.followers;
        state.user.my_following = res.following;
        state.user.isOwner = res.isOwner;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        const res = action.payload.data;
        localStorage.setItem("access_token", res.access_token);
        state.access = res.access_token;
      });
  },
});

export default userSlice.reducer;
export const a_token = (state: RootState) => state.user.access;
export const user = (state: RootState) => state.user.user;
export const isUserExists = (state: RootState) => state.user.isUserExists;
export const user_theme = (state: RootState) => state.user.theme;
export const { logout, theme_change, updateAccessToken } = userSlice.actions;
