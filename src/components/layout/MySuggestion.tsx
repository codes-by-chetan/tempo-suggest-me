import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Film,
  BookOpen,
  Tv,
  Music,
  Youtube,
  Instagram,
  CheckCircle,
  Clock,
  Bookmark,
  Clapperboard,
  Share2,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/services/toast.service";
import { ContentItem } from "@/interfaces/content.interfaces";

interface MySuggestionCardProps {
  item: ContentItem;
}

function MySuggestionCard({ item }: MySuggestionCardProps) {
  const navigate = useNavigate();

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
      case "reels":
        return <Instagram className="h-5 w-5" />;
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
      case "albums":
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

  const getContentSpecificStatusLabel = (
    status: string | null,
    type: string
  ): string => {
    if (!status) return "";
    if (status === "NotInterested") return "Not Interested";
    if (status === "WantToConsume") {
      return type === "book"
        ? "Reading List"
        : type === "music" || type === "song"
        ? "Listening List"
        : "Watchlist";
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
        className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0 cursor-pointer bg-card min-h-[340px] flex flex-col"
      >
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex mb-4 relative">
            {item.status && (
              <div className="absolute top-1 right-1 z-10">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeColor(
                    item.status
                  )}`}
                >
                  {item.status === "Consumed" ? (
                    <>
                      <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  ) : item.status === "Consuming" ? (
                    <>
                      <Clock className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  ) : item.status === "NotInterested" ? (
                    <>
                      <XCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  )}
                </motion.span>
              </div>
            )}
            <div
              className={cn(
                "relative overflow-hidden rounded-md cursor-pointer w-24 md:w-32 flex-shrink-0 mr-4",
                getImageClass(item.type)
              )}
              onClick={() =>
                navigate(getRouteForType(item.type, item.contentId || item.id))
              }
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  {getIconForType(item.type)}
                </div>
                <span className="text-xs font-medium text-primary capitalize">
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(
                    item.suggestedAt || item.addedAt || Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
              <h3
                className="font-semibold text-lg mb-1 line-clamp-1 text-foreground cursor-pointer"
                onClick={() =>
                  navigate(
                    getRouteForType(item.type, item.contentId || item.id)
                  )
                }
              >
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.creator || "Unknown"} • {item.year || "N/A"}
              </p>
            </div>
          </div>
          <div className="mb-4  flex-1">
            <p
              className="text-sm line-clamp-2 text-foreground"
              dangerouslySetInnerHTML={{
                __html: item.description || "No description available.",
              }}
            ></p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center">
              <span className="text-xs font-medium text-foreground mr-2">
                Suggested to:
              </span>
              <div className="flex items-center">
                {item.suggestedTo && item.suggestedTo.length > 0 ? (
                  item.suggestedTo.map((recipient, index) => (
                    <>
                      <Avatar
                        key={recipient.id}
                        className={cn(
                          "h-5 w-5 ring-1 ring-primary/20",
                          index > 0 ? "-ml-2" : "mr-1"
                        )}
                      >
                        <AvatarImage
                          src={recipient.avatar || "/placeholder.svg"}
                          alt={recipient.name}
                        />
                        <AvatarFallback className="bg-primary-100 text-primary-800">
                          {recipient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">
                        {recipient?.name}
                      </span>
                    </>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No recipients
                  </span>
                )}
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

export default MySuggestionCard;
