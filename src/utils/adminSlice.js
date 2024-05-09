// Redux slice file (adminSlice.js)

import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
  },
  reducers: {
    fetchAllUsers: (state, action) => {
        console.log("Payload received:", action.payload);
      state.users = action.payload; 
    }
  },
});

export const { fetchAllUsers } = adminSlice.actions;
export default adminSlice.reducer;
