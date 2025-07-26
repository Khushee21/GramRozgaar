// socket.js
import { io } from "socket.io-client";
import { API_URL } from "@/services/API";

export const socket = io(API_URL, {
    transports: ['websocket'],
    autoConnect: false,
});
