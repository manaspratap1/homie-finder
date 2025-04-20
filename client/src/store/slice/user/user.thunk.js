import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../utilities/axiosinstance";
import { setUser } from "./user.slice";

export const getUserProfileThunk = createAsyncThunk(
  'user/getUserProfile',
  async (id, { rejectWithValue }) => {
    console.log("User ID passed to thunk:", id);  // Log the ID
    const token = localStorage.getItem("token");
    console.log("Token in getUserProfileThunk:", token);  // Log the token

    if (!id) {
      return rejectWithValue("User ID is undefined");
    }

    if (token) {
      try {
        const response = await axiosInstance.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;  // Return the user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return rejectWithValue("Error fetching user profile: " + error.message);
      }
    } else {
      return rejectWithValue("Token not found");
    }
  }
);




// Login User
export const loginUserThunk = createAsyncThunk(
  "user/login",
  async (credentials, { dispatch }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);
      const userData = response.data;

      dispatch(setUser(userData.user));
      localStorage.setItem("token", userData.token);

      return userData;
    } catch (error) {
      throw new Error("Login failed");
    }
  }
);

// Register User
export const registerUserThunk = createAsyncThunk(
  "user/registerUser",
  async (userDetails) => {
    try {
      console.log("User details in thunk:", userDetails);  // Log the user details
      const response = await axiosInstance.post("/api/auth/register", userDetails);
      return response.data;
    } catch (error) {
      throw new Error("Failed to register");
    }
  }
);

// Logout User
export const logoutUserThunk = createAsyncThunk(
  "user/logoutUser",
  async () => {
    localStorage.removeItem("token");
    return { success: true };
  }
);
