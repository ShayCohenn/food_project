import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterCreds, UpdateUserData, VerifyEmail, resetData } from "redux/api/types";
import * as API from "redux/api/userAPI";

// Define an async thunk for login
export const loginAsync = createAsyncThunk(
  "user/login",
  async ({
    username,
    password,
    rememberMe,
  }: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const credentials = { username, password };
    try {
      const response = await API.loginUser(credentials);
      return { response, rememberMe };
    } catch (error) {
      // This is where you handle errors within the async function
      console.error("Async function error:", error);
      throw error; // Make sure to rethrow the error for it to be caught by the rejection case
    }
  }
);

export const verifyEmailAsync = createAsyncThunk(
  "users/email",
  async (emailData: VerifyEmail) => {
    try {
      const response = await API.verifyEmail(emailData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteVerifyEmailAsync = createAsyncThunk(
  "users/delete/email",
  async (email: string) => {
    try {
      const response = await API.deleteVerifyEmail({ email }); // Pass an object with 'email' property
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  "users/refresh",
  async ({ refresh_token }: { refresh_token: string }) => {
    try {
      const response = await API.refreshToken({ refresh_token: refresh_token });
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  "users/register",
  async (registerData: RegisterCreds) => {
    try {
      const response = await API.registerUser(registerData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const checkUserExistsAsync = createAsyncThunk(
  "user/checkUserExists",
  async (username: string) => {
    try {
      const response = await API.checkUserExists(username);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getUserDataAsync = createAsyncThunk(
  "user/getUser",
  async (username: string) => {
    try {
      const response = await API.getUserData(username);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async ({ data, username }: { data: UpdateUserData; username: string }) => {
    try {
      const response = await API.updateUser(data, username);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async ({
    follower,
    following,
    isFollowing,
  }: {
    follower: string;
    following: string;
    isFollowing: boolean;
  }) => {
    try {
      const response = await API.followUser(follower, following, isFollowing);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  "user/search",
  async (param: string) => {
    try {
      const response = await API.searchUsers(param);
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const sendPasswordResetEmailAsync = createAsyncThunk(
  "user/resetemail",
  async (email: string) => {
      try {
          const response = await API.sendPasswordResetEmail(email);
          return response;
      } catch (error) {
          throw error;
      }
  }
);

export const deleteResetPasswordAsync = createAsyncThunk(
  "user/deleteResetEmail",
  async (email: string) => {
      try {
          const response = await API.deleteResetPassword(email);
          return response;
      } catch (error) {
          throw error;
      }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "user/resetemail",
  async (data: resetData) => {
      try {
          const response = await API.resetPassword(data);
          return response;
      } catch (error) {
          throw error;
      }
  }
);