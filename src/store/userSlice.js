


import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isLoaded: false,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isLoaded = true;
        },
        removeUserData: (state) => {
            state.userData = null;
            state.isLoaded = true;
        }
    }
})

export const { setUserData, removeUserData } = userSlice.actions
export default userSlice.reducer