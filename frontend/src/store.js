// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./components/VideoPlayer/videoSlice.js";

export const store = configureStore({
  reducer: {
    video: videoReducer,
  },
});