import { createSlice } from "@reduxjs/toolkit"


const connectionSlice = createSlice({
    name: "connection",
    initialState: {
        connections: []
    },
    reducers: {
        setConnections: (state, action) => {
            state.connections = action.payload
        },
        removeConnections: (state) => {
            state.connections = []
        }
    }
})

export const { setConnections, removeConnections } = connectionSlice.actions
export default connectionSlice.reducer