import { createSlice } from "@reduxjs/toolkit"

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        feedData: [],
    },
    reducers: {
        setFeedData: (state, action) => {
            state.feedData = action.payload
        },
        removeUserFromFeed: (state, action) => {
            const newArray = state.feedData.filter((e) => e._id !== action.payload)
            state.feedData = newArray
        }
    }
}
)

export const { setFeedData, removeUserFromFeed } = feedSlice.actions
export default feedSlice.reducer