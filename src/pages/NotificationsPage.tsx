import { useState, useEffect } from "react";
import { useNotifications } from "@/lib/notification-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { subDays, isAfter } from "date-fns";
import NotificationItem2 from "@/components/layout/NotificationItem-2";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  contentType?: string;
  user?: {
    id: string;
    fullName: {
      firstName: string;
      lastName: string;
      _id: string;
      [key: string]: any;
    };
    avatar: string;
    fullNameString: string;
  };
  metadata: {
    followRequestStatus: string;
    followRequestId: string;
    _id: string;
    id: string;
    [key: string]: any;
  };
}

const NotificationsPage = () => {
  const { notifications, markAsRead, dismiss } = useNotifications();
  const [currentPage, setCurrentPage] = useState({
    followRequests: 1,
    suggestions: 1,
    others: 1,
  });
  const [dateFilter, setDateFilter] = useState("all");
  const notificationsPerPage = 10;

  // Categorize and filter notifications
  const followRequests = notifications.filter(
    (n) => n.type === "FollowRequest" && applyDateFilter(n.createdAt)
  );
  const suggestions = notifications.filter(
    (n) => n.type === "Suggestion" && applyDateFilter(n.createdAt)
  );
  const others = notifications.filter(
    (n) =>
      !["FollowRequest", "Suggestion"].includes(n.type) &&
      applyDateFilter(n.createdAt)
  );

  // Apply date filter
  function applyDateFilter(createdAt: string) {
    const notificationDate = new Date(createdAt);
    if (dateFilter === "today") {
      return notificationDate.toDateString() === new Date().toDateString();
    } else if (dateFilter === "week") {
      return isAfter(notificationDate, subDays(new Date(), 7));
    } else if (dateFilter === "month") {
      return isAfter(notificationDate, subDays(new Date(), 30));
    }
    return true; // "all"
  }

  // Pagination logic for each category
  const getPaginatedNotifications = (
    categoryNotifications: any[],
    page: number
  ) => {
    const startIndex = (page - 1) * notificationsPerPage;
    return categoryNotifications.slice(
      startIndex,
      startIndex + notificationsPerPage
    );
  };

  const totalPages = {
    followRequests: Math.ceil(followRequests.length / notificationsPerPage),
    suggestions: Math.ceil(suggestions.length / notificationsPerPage),
    others: Math.ceil(others.length / notificationsPerPage),
  };

  // Reset pages when filter changes
  useEffect(() => {
    setCurrentPage({ followRequests: 1, suggestions: 1, others: 1 });
  }, [dateFilter]);

  // Animation variants for columns
  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
      <main className="w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Follow Requests Column */}
            <motion.div
              className="space-y-4"
              variants={columnVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold">Follow Requests</h2>
              <Separator />
              {followRequests.length > 0 ? (
                getPaginatedNotifications(
                  followRequests,
                  currentPage.followRequests
                ).map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-center gap-2"
                  >
                    <NotificationItem2
                      notification={{
                        id: notification._id,
                        type: notification.type,
                        title: "Follow Request",
                        message: notification.message,
                        timestamp: notification.createdAt,
                        read: notification.status === "Read",
                        contentType: notification.relatedContent?.contentType,
                        user: notification.sender
                          ? {
                              id: notification.sender._id,
                              fullName: notification.sender.fullName,
                              fullNameString:
                                notification.sender.fullNameString,
                              avatar: notification.sender.avatar?.url || null,
                            }
                          : undefined,
                        metadata: notification.metadata,
                        ...notification,
                      }}
                      onMarkAsRead={() => markAsRead(notification._id)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dismiss(notification._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No follow requests
                </div>
              )}
              {totalPages.followRequests > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage.followRequests === 1}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        followRequests: prev.followRequests - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage.followRequests} of{" "}
                    {totalPages.followRequests}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage.followRequests === totalPages.followRequests
                    }
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        followRequests: prev.followRequests + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Suggestions Column */}
            <motion.div
              className="space-y-4"
              variants={columnVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold">Suggestions</h2>
              <Separator />
              {suggestions.length > 0 ? (
                getPaginatedNotifications(
                  suggestions,
                  currentPage.suggestions
                ).map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-center gap-2"
                  >
                    <NotificationItem2
                      notification={{
                        id: notification._id,
                        type: notification.type,
                        title: "New Suggestion",
                        message: notification.message,
                        timestamp: notification.createdAt,
                        read: notification.status === "Read",
                        contentType: notification.relatedContent?.contentType,
                        user: notification.sender
                          ? {
                              id: notification.sender._id,
                              fullName: notification.sender.fullName,
                              fullNameString:
                                notification.sender.fullNameString ||
                                `${notification.sender.fullName.firstName} ${notification.sender.fullName.lastName}`,
                              avatar: notification.sender.avatar?.url || null,
                            }
                          : undefined,
                        metadata: notification.metadata,
                        ...notification,
                      }}
                      onMarkAsRead={() => markAsRead(notification._id)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dismiss(notification._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No suggestions
                </div>
              )}
              {totalPages.suggestions > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage.suggestions === 1}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        suggestions: prev.suggestions - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage.suggestions} of {totalPages.suggestions}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage.suggestions === totalPages.suggestions
                    }
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        suggestions: prev.suggestions + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Others Column */}
            <motion.div
              className="space-y-4"
              variants={columnVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold">Others</h2>
              <Separator />
              {others.length > 0 ? (
                getPaginatedNotifications(others, currentPage.others).map(
                  (notification) => (
                    <div
                      key={notification._id}
                      className="flex items-center gap-2 min-w-full"
                    >
                      <NotificationItem2
                        notification={{
                          id: notification._id,
                          type: notification.type,
                          title:
                            notification.type === "Like"
                              ? "New Like"
                              : notification.type === "Comment"
                              ? "New Comment"
                              : notification.type === "System"
                              ? "System Notification"
                              : notification.type === "FollowAccepted"
                              ? "Follow Accepted"
                              : notification.type === "FollowedYou"
                              ? "Followed You"
                              : notification.type === "NewContent"
                              ? "New Content"
                              : notification.type === "Mention"
                              ? "Mention"
                              : "Notification",
                          message: notification.message,
                          timestamp: notification.createdAt,
                          read: notification.status === "Read",
                          contentType: notification.relatedContent?.contentType,
                          user: notification.sender
                            ? {
                                id: notification.sender._id,
                                fullName: notification.sender.fullName,
                                fullNameString:
                                  notification.sender.fullNameString ||
                                  `${notification.sender.fullName.firstName} ${notification.sender.fullName.lastName}`,
                                avatar: notification.sender.avatar?.url || null,
                              }
                            : undefined,
                          metadata: notification.metadata,
                          ...notification,
                        }}
                        onMarkAsRead={() => markAsRead(notification._id)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => dismiss(notification._id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  )
                )
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No other notifications
                </div>
              )}
              {totalPages.others > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage.others === 1}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        others: prev.others - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage.others} of {totalPages.others}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage.others === totalPages.others}
                    onClick={() =>
                      setCurrentPage((prev) => ({
                        ...prev,
                        others: prev.others + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
  );
};

export default NotificationsPage;
