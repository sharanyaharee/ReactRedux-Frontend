import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            firstName: "",
            lastName: "",
            email: "",
            profileImage: "",
        }
    },
    reducers: {
        addUser: (state, action) => {
          const { profileImage, ...userData } = action.payload;
          state.users = { ...state.users, ...userData };
          if (profileImage !== undefined) {
            state.users.profileImage = profileImage;
          }
        },
      },
})


 export const {addUser} = userSlice.actions;
export default userSlice.reducer;