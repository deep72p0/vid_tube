// store/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playingVideo: null, // stores the currently playing video
  shouldDispose: false // Flag to dispose player
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Set the current playing video in Redux state
    setPlayingVideo:(state, action) => {
      state.playingVideo =action.payload;
      state.shouldDispose = false; // Reset disposal when a new video is set
    },
    // ✅ Manually dispose of the player
    disposePlayer: (state) => {
      state.shouldDispose = true;
    },
  },
});

export const { setPlayingVideo, disposePlayer } = videoSlice.actions;
export default videoSlice.reducer;