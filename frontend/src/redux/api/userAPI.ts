import axios from "axios";
import { API_URL } from "config/index";
import { RegisterCreds, UpdateUserData, VerifyEmail, resetData } from "./types";

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/users/login/`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (emailData: VerifyEmail) => {
  try {
    const response = await axios.post(`${API_URL}/users/email/`, emailData);
    return response; // Return response data on success
  } catch (error: any) {
    // Provide a type annotation for error
    if (error.response && error.response.data) {
      throw error.response.data; // Throw the response data on error
    } else {
      throw error; // Throw the original error if no response data is available
    }
  }
};

export const deleteVerifyEmail = async ({ email }: { email: string }) => {
  try {
    const response = await axios.delete(`${API_URL}/users/email/`, {
      data: { email }, // Pass email in the request body
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async ({
  refresh_token,
}: {
  refresh_token: string;
}) => {
  try {
    console.log(refresh_token);
    
    const response = await axios.post(
      `${API_URL}/users/refresh/`,
      refresh_token
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (credentials: RegisterCreds) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/register/`,
      credentials
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkUserExists = async (username: string) => {
  try {
    const headers: Record<string, string> = {}; // Specify the type of headers

    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(`${API_URL}/users/profile/${username}/`, {
      headers,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (username: string) => {
  try {
    const headers: Record<string, string> = {}; // Specify the type of headers

    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(`${API_URL}/users/profile/${username}/`, {
      headers,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data: UpdateUserData, username: string) => {
  try {
    const response = await axios.put(`${API_URL}/users/user/${username}/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (
  follower: string,
  following: string,
  isFollowing: boolean
) => {
  if (!isFollowing) {
    try {
      const response = await axios.post(
        `${API_URL}/users/follow/${follower}/${following}/`,
        {}, // Empty request body
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
  } else {
    try {
      const response = await axios.delete(
        `${API_URL}/users/follow/${follower}/${following}/`,
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
  }
};

export const searchUsers = async (param: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/search?q=${param}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const sendPasswordResetEmail = async (data: string) => {
  try {
      const response = await axios.post(`${API_URL}/users/password-reset/email/`, { email: data });
      return response;
  } catch (error) {
      throw error;
  }
};

export const deleteResetPassword = async (email: string) => {
  try {
      const response = await axios.delete(`${API_URL}/users/password-reset/email/`, { data: { email } });
      return response;
  } catch (error) {
      throw error;
  }
};

export const resetPassword = async (data: resetData) => {
  try {
      const response = await axios.post(`${API_URL}/users/password-reset/`, data);
      return response;
  } catch (error) {
      throw error;
  }
};