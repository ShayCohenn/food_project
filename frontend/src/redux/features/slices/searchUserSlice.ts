import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/store";
import { SearchedUser } from "redux/api/types";
import { searchUsersAsync } from "../async_functions/userAsyncSlice";

const initialState: SearchedUser[] = [];

const searchedUsersSlice = createSlice({
  name: "searchedUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchUsersAsync.fulfilled, (state, action) => {
      // Assuming the API response contains an array of SearchedUser objects
      const searchData = action.payload.data;
      return searchData.map((apiUser: any) => ({
        username: apiUser.user.username,
        profile_pic: apiUser.user_properties.profile_pic,
        first_name: apiUser.user.first_name,
        last_name: apiUser.user.last_name,
        follower_count: apiUser.user.followers_count,
        following_count: apiUser.user.following_count,
        follower_list: apiUser.user.follower_usernames,
        following_list: apiUser.user.following_usernames,
        recipe_count: apiUser.user.recipes_count,
      }));
    });
  },
});

export default searchedUsersSlice.reducer;
export const users = (state: RootState) => state.searchedUsers;
