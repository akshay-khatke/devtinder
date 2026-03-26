import { io } from "socket.io-client";

let socket;
const localHost = false

export const createSocketConnection = () => {
    if (localHost) {


        if (!socket) {
            socket = io("http://localhost:3000");
        }
    } else {
        socket = io("/", { path: "/api/socket.io" }) //for production only
    }
    return socket;
};