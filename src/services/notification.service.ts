import io from "socket.io-client";
import api from "./api.service";
import { response } from "@/interfaces/auth.interfaces";

const API_BASE_URL = "http://192.168.0.39:3200";
let socket = null;

interface NotificationResponse {
  statusCode: number;
  data: Notification[] | null;
  message: string;
  success: boolean;
  redirect: null;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: Sender;
  type: string;
  message: string;
  status: string;
  metadata: Metadata;
  isVerified: boolean;
  isActive: boolean;
  createdBy: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  [key: string]: any
}

interface Metadata {
  followRequestStatus: string;
  _id: string;
  id: string;
  [key: string]: any
}

interface Sender {
  _id: string;
  fullName: FullName;
  profile: Profile;
  fullNameString: string;
  id: string;
  [key: string]: any
}

interface Profile {
  _id: string;
  isComplete: boolean;
  avatar: { url: string; publicId: string; [key: string]: any };
  id: string;
  [key: string]: any
}

interface FullName {
  firstName: string;
  lastName: string;
  _id: string;
  [key: string]: any
}

// Connect to Socket.IO
export const connectSocket = () => {
  socket = io(API_BASE_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  });
  return socket;
};
function getAccessToken() {
  const token: string | null = localStorage.getItem("token");
  return token;
}
// Disconnect from Socket.IO
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Subscribe to new notifications
export const subscribeToNotifications = (callback) => {
  if (!socket) return;

  socket.on("newNotification", (notification:Notification) => {
    console.log(notification);
    callback(notification);
  });
};

// Fetch notifications for a user
export const fetchNotifications = async (): Promise<NotificationResponse> => {
  return api
    .get(`user/notifications`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

// Mark a notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<response> => {
  return api
    .get(`notifications/${notificationId}/read`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<response> => {
  return api
    .get(`notifications/read-all`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};
