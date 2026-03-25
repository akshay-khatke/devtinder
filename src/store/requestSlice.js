import { createSlice } from "@reduxjs/toolkit"


const requestSlice = createSlice({
    name: "request",
    initialState: {
        requests: []
    },
    reducers: {
        setRequests: (state, action) => {
            state.requests = action.payload
        },
        removeRequests: (state, action) => {
            const newArray = state.requests.filter((e) => e._id !== action.payload)
            state.requests = newArray
        }
    }
})

export const { setRequests, removeRequests } = requestSlice.actions
export default requestSlice.reducer