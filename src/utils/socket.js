import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket;

export const createSocketConnection = () => {
    if (!socket) {
        if (location.hostname === "localhost") {
            socket = io("http://localhost:3000");
        } else {
            socket = io(BASE_URL, {
                withCredentials: true
            });
        }
    }
    return socket;
};