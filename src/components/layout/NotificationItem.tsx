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
import { useNavigate } from "react-router";
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
    profile: any
  };
}
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  closePopup?: () => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  closePopup,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const getIconForContentType = (type?: string, notificationType?: string) => {
    if (!type && !notificationType) return <Bell className="h-4 w-4" />;

    // Handle notification types without contentType (e.g., FollowRequest)
    if (!type) {
      switch (notificationType) {
        case "FollowRequest":
        case "FollowAccepted":
          return <Users className="h-4 w-4" />;
        case "System":
        case "Mention":
        case "Other":
          return <Bell className="h-4 w-4" />;
        default:
          return null;
      }
    }

    // Handle contentType-based icons
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
  const handleUserClick = () => {
    closePopup();
    if (notification.user?.id) {
      navigate(`/profile/${notification.user.id}`);
    }
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors cursor-pointer",
        !notification.read && "bg-primary/5 dark:bg-primary/10"
      )}
      onClick={handleClick}
    >
      {notification.user ? (
        <Avatar
          className="h-8 w-8 ring-1 ring-primary/20"
          onClick={handleUserClick}
        >
          <AvatarImage
            src={notification.user.avatar}
            alt={notification.user.fullNameString}
          />
          <AvatarFallback className="bg-primary-100 font-bold text-primary-800">
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
          <div className="flex justify-center items-center gap-1">
            <p
              className="font-medium text-sm line-clamp-1"
              onClick={handleUserClick}
            >
              {notification.user.fullNameString}
            </p>
            {notification.user?.profile.isVerified && (
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
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

export default NotificationItem;
