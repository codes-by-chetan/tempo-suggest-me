import { useNavigate } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Bookmark,
  BookOpen,
  CheckCircle,
  Clapperboard,
  Clock,
  Film,
  Music,
  Share2,
  Tv,
  Youtube,
  Loader2,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/services/toast.service";
import { updateContentStatus } from "@/services/contentList.service";

interface ContentItem {
  id: string;
  userContentId: string;
  contentId: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator?: string;
  description?: string;
  suggestedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  addedAt: string;
  status: "WantToConsume" | "Consuming" | "Consumed" | "NotInterested" | null;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

interface MyWatchListCardProps {
  item: ContentItem;
}

function MyWatchListCard({ item }: MyWatchListCardProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(item.status);
  const [loading, setLoading] = useState({
    consumed: false,
    consuming: false,
    wantToConsume: false,
    notInterested: false,
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-5 w-5" />;
      case "series":
        return <Clapperboard className="h-5 w-5" />;
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "anime":
        return <Tv className="h-5 w-5" />;
      case "music":
      case "song":
        return <Music className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      default:
        return <Film className="h-5 w-5" />;
    }
  };

  const getRouteForType = (type: string, id: string) => {
    switch (type) {
      case "movie":
        return `/movies/${id}`;
      case "series":
        return `/series/${id}`;
      case "book":
        return `/books/${id}`;
      case "music":
      case "song":
        return `/music/${id}`;
      case "video":
        return `/videos/${id}`;
      case "people":
        return `/people/${id}`;
      case "users":
        return `/profile/${id}`;
      default:
        return "#";
    }
  };

  const getContentSpecificStatusLabel = (status: string | null, type: string): string => {
    if (!status) return "";
    if (status === "NotInterested") return "Not Interested";
    if (status === "WantToConsume") {
      return type === "book" ? "Reading List" : type === "music" || type === "song" ? "Listening List" : "Watchlist";
    }
    switch (type) {
      case "book":
        return status === "Consumed" ? "Finished" : "Reading";
      case "music":
      case "song":
        return status === "Consumed" ? "Listened" : "Listening";
      default:
        return status === "Consumed" ? "Watched" : "Watching";
    }
  };

  const getStatusBadgeColor = (status: string | null) => {
    if (status === "Consumed") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (status === "Consuming") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    } else if (status === "WantToConsume") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else if (status === "NotInterested") {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleStatusUpdate = async (newStatus: "Consumed" | "Consuming" | "WantToConsume" | "NotInterested") => {
    if (!item.userContentId) {
      toast.error("Abe, user content ID nahi hai!");
      return;
    }

    setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: true }));
    try {
      const response = await updateContentStatus(item.userContentId, { status: newStatus });
      if (response.success) {
        setStatus(newStatus);
        toast.success(
          newStatus === "NotInterested"
            ? "Bhai, content ko not interested mark kar diya!"
            : "Bhai, status update ho gaya!"
        );
      } else {
        toast.error("Abe, status update nahi hua!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Abe, kuch gadbad ho gaya!");
    } finally {
      setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: false }));
    }
  };

  const getImageClass = (type: string) => {
    switch (type) {
      case "music":
      case "song":
        return "aspect-square";
      default:
        return "aspect-[2/3]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card
        key={item.id}
        className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0 cursor-pointer bg-card min-h-[420px] flex flex-col"
      >
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex mb-4 relative">
            {status && (
              <div className={cn("absolute top-1 right-1 z-10")}>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeColor(status)}`}
                >
                  {status === "Consumed" ? (
                    <>
                      <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">{getContentSpecificStatusLabel(status, item.type)}</span>
                    </>
                  ) : status === "Consuming" ? (
                    <>
                      <Clock className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">{getContentSpecificStatusLabel(status, item.type)}</span>
                    </>
                  ) : status === "NotInterested" ? (
                    <>
                      <XCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">{getContentSpecificStatusLabel(status, item.type)}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">{getContentSpecificStatusLabel(status, item.type)}</span>
                    </>
                  )}
                </motion.span>
              </div>
            )}
            <div
              className={cn(
                "relative overflow-hidden rounded-md cursor-pointer w-24 md:w-32 flex-shrink-0 mr-4",
                getImageClass(item.type),
                item.type === "music" ? "mt-10":""
              )}
              onClick={() => navigate(getRouteForType(item.type, item.contentId))}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="w-full flex flex-col justify-center">
              <div className={cn("flex items-center gap-2 mb-1", item.type === "music" ? "pt-10":"")}>
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  {getIconForType(item.type)}
                </div>
                <span className="text-xs font-medium text-primary capitalize">{item.type}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(item.addedAt).toLocaleDateString()}
                </span>
              </div>
              <h3
                className="font-semibold text-lg mb-1 line-clamp-1 text-foreground cursor-pointer"
                onClick={() => navigate(getRouteForType(item.type, item.contentId))}
              >
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.creator || "Unknown"} • {item.year || "N/A"}
              </p>
            </div>
          </div>
          <div className="mb-4 min-h-[42px] flex-1">
            <p
              className="text-sm line-clamp-2 text-foreground"
              dangerouslySetInnerHTML={{
                __html: item.description || "No description available.",
              }}
            ></p>
          </div>
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <Button
              variant={status === "Consumed" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${status === "Consumed" ? "bg-primary text-white" : ""}`}
              onClick={() => handleStatusUpdate("Consumed")}
              disabled={loading.consumed}
            >
              {loading.consumed ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {item.type === "book" ? "Finished" : item.type === "music" || item.type === "song" ? "Listened" : "Watched"}
            </Button>
            <Button
              variant={status === "Consuming" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${status === "Consuming" ? "bg-primary text-white" : ""}`}
              onClick={() => handleStatusUpdate("Consuming")}
              disabled={loading.consuming}
            >
              {loading.consuming ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {item.type === "book" ? "Reading" : item.type === "music" || item.type === "song" ? "Listening" : "Watching"}
            </Button>
            <Button
              variant={status === "WantToConsume" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${status === "WantToConsume" ? "bg-primary text-white" : ""}`}
              onClick={() => handleStatusUpdate("WantToConsume")}
              disabled={loading.wantToConsume}
            >
              {loading.wantToConsume ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Bookmark className="h-3 w-3 mr-1" />
              )}
              {item.type === "book" ? "Reading List" : item.type === "music" || item.type === "song" ? "Listening List" : "Watchlist"}
            </Button>
            <Button
              variant={status === "NotInterested" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${status === "NotInterested" ? "bg-gray-600 text-white" : ""}`}
              onClick={() => handleStatusUpdate("NotInterested")}
              disabled={loading.notInterested}
            >
              {loading.notInterested ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              Not Interested
            </Button>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center">
              <span className="text-xs font-medium text-foreground mr-2">Suggested by:</span>
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-1 ring-1 ring-primary/20">
                  <AvatarImage
                    src={item?.suggestedBy?.avatar || "/placeholder.svg"}
                    alt={item?.suggestedBy?.name}
                  />
                  <AvatarFallback className="bg-primary-100 text-primary-800">
                    {item?.suggestedBy?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground">{item?.suggestedBy?.name}</span>
              </div>
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
                onClick={() => toast.success("Bhai, share link copy ho gaya!")}
              >
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MyWatchListCard;