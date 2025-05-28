import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Film,
  BookOpen,
  Tv,
  Youtube,
  Users,
  Bell,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import UserService from "@/services/user.service";
import VerifiedBadgeIcon from "../profile/VerifiedBadgeIcon";

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
    isVerified: boolean;
  };
  metadata: {
    followRequestStatus: string;
    followRequestId: string;
    _id: string;
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

// Base Notification Item for shared logic
const BaseNotificationItem = ({
  notification,
  onMarkAsRead,
  children,
}: NotificationItemProps & { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const getIconForContentType = (type?: string, notificationType?: string) => {
    if (!type && !notificationType) return <Bell className="h-4 w-4" />;

    if (!type) {
      switch (notificationType) {
        case "FollowRequest":
        case "FollowAccepted":
        case "FollowedYou":
          return <Users className="h-4 w-4" />;
        case "System":
        case "Mention":
        case "Other":
          return <Bell className="h-4 w-4" />;
        default:
          return null;
      }
    }

    switch (type) {
      case "movie":
        return <Film className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "series":
        return <Tv className="h-4 w-4" />;
      case "video":
        return <Youtube className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "other":
        return <Bell className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleUserClick = () => {
    if (notification.user?.id) {
      navigate(`/profile/${notification.user.id}`);
    }
  };
console.log("notification: ", notification)
  return (
    <div
      className={cn(
        "flex min-w-[90%] items-start gap-3 p-3 hover:bg-accent/50 transition-colors cursor-pointer rounded-md",
        !notification.read && "bg-primary/5 dark:bg-primary/10"
      )}
      onClick={handleClick}
    >
      {notification.user ? (
        <Avatar
          className="h-8 w-8 ring-1 ring-primary/20 cursor-pointer"
          onClick={handleUserClick}
        >
          <AvatarImage
            src={notification.user.avatar}
            alt={notification.user.fullNameString}
          />
          <AvatarFallback className="bg-primary-100 text-primary-800">
            {notification.user.fullName.firstName.charAt(0)}
            {notification.user.fullName.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {getIconForContentType(notification.contentType, notification.type)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center justify-center gap-1">
            <p
            className="font-medium text-sm line-clamp-1 cursor-pointer"
            onClick={handleUserClick}
          >
            {notification.user.fullNameString}
          </p>
          {notification.user?.isVerified && (
                <VerifiedBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.timestamp), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        {children}
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

// Follow Request Notification
const FollowRequestNotification = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const userService = new UserService();

  const handleAccept = () => {
    console.log(`Accept follow request for ${notification.user?.id}`);
    // TODO: Add API call for accept
    userService
      .acceptFollowRequest(notification.metadata.followRequestId)
      .then((res) => {
        if (res.success) {
        }
      });
  };

  const handleReject = () => {
    console.log(`Reject follow request for ${notification.user?.id}`);
    // TODO: Add API call for reject
  };

  const handleReview = () => {
    console.log(`Review profile for ${notification.user?.id}`);
    // TODO: Add API call or navigation for review
    navigate(`/profile/${notification.user?.id}`);
  };

  return (
    <BaseNotificationItem
      notification={notification}
      onMarkAsRead={onMarkAsRead}
    >
      <div className="flex gap-2 mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="default"
            size="sm"
            className="text-xs"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleReject}
          >
            Reject
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={handleReview}
          >
            Review
          </Button>
        </motion.div>
      </div>
    </BaseNotificationItem>
  );
};

// Suggested Content Notification
const SuggestedContentNotification = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const getRouteForType = (type: string, contentId: string) => {
    switch (type) {
      case "Movie":
        return `/movies/${contentId}`;
      case "Series":
        return `/series/${contentId}`;
      case "Book":
        return `/books/${contentId}`;
      case "Music":
      case "albums":
        return `/music/${contentId}`;
      case "Video":
        return `/videos/${contentId}`;
      case "People":
        return `/people/${contentId}`;
      case "Users":
        return `/profile/${contentId}`;
      default:
        return "#";
    }
  };
  return (
    <BaseNotificationItem
      notification={notification}
      onMarkAsRead={onMarkAsRead}
    >
      <div className="flex gap-2 mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            className="w-22 h-6  !p-2 text-xs "
            onClick={() => {
              navigate(notification?.actionUrl);
            }}
          >
            View Suggestion
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Button
            variant="outline"
            className="w-22 h-6  !p-2 text-xs"
            onClick={() => {
              console.log("content details : ", notification);
              console.log(
                "navigating to : ",
                getRouteForType(
                  notification?.relatedContent?.contentType,
                  notification?.relatedContent?.content
                )
              );

              navigate(
                getRouteForType(
                  notification?.relatedContent?.contentType,
                  notification?.relatedContent?.content
                )
              );
            }}
          >
            View Content
          </Button>
        </motion.div>
      </div>
    </BaseNotificationItem>
  );
};

// Followed You Notification
const FollowedYouNotification = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  return (
    <BaseNotificationItem
      notification={notification}
      onMarkAsRead={onMarkAsRead}
    >
      {/* No additional actions for now */}
      <></>
    </BaseNotificationItem>
  );
};

// Generic Notification (for Like, Comment, System, etc.)
const GenericNotification = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  return (
    <BaseNotificationItem
      notification={notification}
      onMarkAsRead={onMarkAsRead}
    >
      {/* No additional actions for now */}
      <></>
    </BaseNotificationItem>
  );
};

// Main Notification Item to dispatch to specific components
const NotificationItem2 = ({
  notification,
  onMarkAsRead,
}: NotificationItemProps) => {
  switch (notification.type) {
    case "FollowRequest":
      return (
        <FollowRequestNotification
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
    case "Suggestion":
      return (
        <SuggestedContentNotification
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
    case "FollowedYou":
      return (
        <FollowedYouNotification
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
    case "Like":
    case "Comment":
    case "System":
    case "FollowAccepted":
    case "NewContent":
    case "Mention":
    default:
      return (
        <GenericNotification
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      );
  }
};

export default NotificationItem2;
