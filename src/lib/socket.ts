import io from "socket.io-client";

const API_BASE_URL = "http://192.168.0.39:3200";
let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socket.on("connect", () => {
      console.log("Socket connected globally:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected globally");
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};