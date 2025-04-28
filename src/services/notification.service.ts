import {
  initializeSocket,
  getSocket,
  disconnectSocket as disconnect,
} from "@/lib/socket";
import api from "./api.service";
import { response } from "@/interfaces/auth.interfaces";

const API_BASE_URL = "http://192.168.0.39:3200";

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
  [key: string]: any;
}

interface Metadata {
  followRequestStatus: string;
  followRequestId: string;
  _id: string;
  id: string;
  [key: string]: any;
}

interface Sender {
  _id: string;
  fullName: FullName;
  profile: Profile;
  fullNameString: string;
  id: string;
  [key: string]: any;
}

interface Profile {
  _id: string;
  isComplete: boolean;
  avatar: { url: string; publicId: string; [key: string]: any };
  id: string;
  [key: string]: any;
}

interface FullName {
  firstName: string;
  lastName: string;
  _id: string;
  [key: string]: any;
}

function getAccessToken() {
  const token: string | null = localStorage.getItem("token");
  console.log(token);
  return token;
}

export const connectSocket = (userId: string) => {
  const socket = initializeSocket();
  const userIdString = userId.toString(); // Ensure string format
  socket.emit("join", userIdString);

  socket.on("connect", () => {
    console.log("Socket connected, joining room:", userIdString);
    socket.emit("join", userIdString);
  });

  socket.on("reconnect", () => {
    console.log("Socket reconnected, rejoining room:", userIdString);
    socket.emit("join", userIdString);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const disconnectSocket = () => {
  disconnect();
};

export const subscribeToNotifications = (
  callback: (notification: Notification) => void
) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("notification", (notification: Notification) => {
    console.log("Received notification:", notification);
    callback(notification);
  });
};

// Fetch notifications for a user
export const fetchNotifications = async (): Promise<NotificationResponse> => {
  return api
    .get(`notifications`, {
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
    .post(
      `notifications/mark/read/${notificationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
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
    .post(
      `notifications/mark/all/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const dismissNotification = async (notificationId: string) => {
  return api
    .post(
      `notifications/mark/dismiss/${notificationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const dismissAllNotifications = async () => {
  return api
    .post(
      `notifications/mark/all/dismiss`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};