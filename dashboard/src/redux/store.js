import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slice/authSlice.js";
import layoutReducer from "../redux/slice/layoutSlice.js";
import themeReducer from "../redux/slice/themeSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    theme: themeReducer,
  },
});

export default store;
