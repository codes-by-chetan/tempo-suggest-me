import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  connectSocket,
  disconnectSocket,
  subscribeToNotifications,
  Notification,
} from "@/services/notification.service";


interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Fetch notifications and set up socket when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    // Fetch initial notifications
    const loadNotifications = async () => {
      try {
        await fetchNotifications().then((res) => {
          console.log(res);
          setNotifications((res.data ) || []);
          setUnreadCount(
            res.data.filter((n: Notification) => n.status === "Unread").length
          );
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    loadNotifications();

    // Connect to socket and subscribe
    const socket = connectSocket();
    socket.on("connect", () => {
      socket.emit("joinRoom", `user-${user._id}`);
    });

    // Subscribe to new notifications
    subscribeToNotifications((newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      if (newNotification.status === "Unread") {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user?._id]);

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "Read" } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user._id);
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "Read" })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
