import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`me`);
      console.log(data);

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (navigate, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`user/logout`);
      toast.success(data.message);
      navigate("/login");
      return true;
    } catch (error) {
      toast.error(error.response?.data.message);
      return rejectWithValue(error.response?.data.message || "Logout failed!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuth: false,
    authLoading: true,
    error: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    clearAuthLoading: (state) => {
      state.authLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.authLoading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        console.log("action", action);

        state.user = null;
        state.isAuth = false;
        state.authLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.authLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuthLoading } = authSlice.actions;
export default authSlice.reducer;
