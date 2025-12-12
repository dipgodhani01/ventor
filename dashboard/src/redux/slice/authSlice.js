import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api.js";
import toast from "react-hot-toast";

export const fetchAdmin = createAsyncThunk(
  "auth/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`admin-user`);
      return data.user;
    } catch (error) {
      toast.error(error.response?.data.message);
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch user"
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (navigate, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`admin/logout`);
      toast.success(data.message);
      navigate("/login");
      return true;
    } catch (error) {
      toast.error(error.response?.data.message);
      return rejectWithValue(error.response?.data.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    isAuth: false,
    authLoading: true,
  },

  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuth = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isAuth = true;
        state.authLoading = false;
      })
      .addCase(fetchAdmin.rejected, (state) => {
        state.admin = null;
        state.isAuth = false;
        state.authLoading = false;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuth = false;
        state.authLoading = false;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.authLoading = false;
      });
  },
});

export const { setAdmin } = authSlice.actions;
export default authSlice.reducer;
