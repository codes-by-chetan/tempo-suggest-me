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
  Heart,
  MessageCircle,
  Music,
  Share2,
  SmilePlus,
  Tv,
  Youtube,
  Loader2,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  addContent,
  checkContent,
  updateContentStatus,
} from "@/services/contentList.service";
import { toast } from "@/services/toast.service";

interface Position {
  top: number;
  left: number;
}

interface SuggestionItem {
  id: string;
  contentId?: string;
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
  suggestedAt: string;
  [key: string]: any;
}

interface SuggestedToMeCardProps {
  item: SuggestionItem;
  onToggleEmojiPicker: (id: string, position: Position) => void;
  onToggleCommentBox: (id: string, position: Position) => void;
  cardReactions?: Record<string, string[]>;
}

function SuggestedToMeCard({
  item,
  onToggleEmojiPicker,
  onToggleCommentBox,
  cardReactions = {},
}: SuggestedToMeCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [status, setStatus] = useState<
    "WantToConsume" | "Consuming" | "Consumed" | "NotInterested" | null
  >(null);
  const [userContentId, setUserContentId] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    consumed: false,
    consuming: false,
    wantToConsume: false,
    notInterested: false,
  });
  const reactionBtnRef = useRef<HTMLButtonElement>(null);
  const commentBtnRef = useRef<HTMLButtonElement>(null);

  // Fetch content status on mount
  useEffect(() => {
    const fetchContentStatus = async () => {
      try {
        const response = await checkContent({
          contentId: item.contentId,
          suggestionId: item.id,
        });
        if (response.success && response.data) {
          setStatus(response.data.status);
          setUserContentId(response.data.id);
        }
      } catch (error) {
        console.error("Error checking content:", error);
        toast.error("Abe, content check nahi hua!");
      }
    };
    if (item.contentId) {
      fetchContentStatus();
    }
  }, [item.contentId, item.id]);

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

  const toggleWatchList = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite
        ? "Bhai, favorite se hata diya!"
        : "Bhai, favorite mein jod diya!"
    );
  };

  const handleReactionClick = () => {
    if (reactionBtnRef.current) {
      const rect = reactionBtnRef.current.getBoundingClientRect();
      const position: Position = {
        top: rect.bottom + window.scrollY,
        left: Math.max(rect.left + window.scrollX - 150, 10),
      };
      onToggleEmojiPicker(item.id, position);
    }
  };

  const handleCommentClick = () => {
    if (commentBtnRef.current) {
      const rect = commentBtnRef.current.getBoundingClientRect();
      const position: Position = {
        top: rect.bottom + window.scrollY,
        left: Math.max(rect.left + window.scrollX - 150, 10),
      };
      onToggleCommentBox(item.id, position);
    }
  };

  const handleStatusUpdate = async (
    newStatus: "Consumed" | "Consuming" | "WantToConsume" | "NotInterested"
  ) => {
    if (!item.contentId) {
      toast.error("Abe, content ID nahi hai!");
      return;
    }

    setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: true }));
    try {
      if (userContentId) {
        // Update existing content
        const response = await updateContentStatus(userContentId, {
          status: newStatus,
        });
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
      } else {
        // Add new content
        const response = await addContent({
          content: { id: item.contentId, type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1) },
          status: newStatus,
          suggestionId: item.id,
        });
        if (response.success) {
          setStatus(newStatus);
          setUserContentId(response.data.id);
          toast.success(
            newStatus === "NotInterested"
              ? "Bhai, content ko not interested mark kar diya!"
              : "Bhai, content watchlist mein jod diya!"
          );
        } else {
          toast.error("Abe, content add nahi hua!");
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Abe, kuch gadbad ho gaya!");
    } finally {
      setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: false }));
    }
  };

  const reactions = cardReactions[item.id] || [];
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
        className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0 cursor-pointer bg-card"
      >
        <CardContent className="p-4">
          <div className="flex mb-4 relative">
            {status && (
              <div className="absolute top-1 right-1 z-10">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadgeColor(
                    status
                  )}`}
                >
                  {status === "Consumed" ? (
                    <>
                      <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(status, item.type)}
                      </span>
                    </>
                  ) : status === "Consuming" ? (
                    <>
                      <Clock className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(status, item.type)}
                      </span>
                    </>
                  ) : status === "NotInterested" ? (
                    <>
                      <XCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(status, item.type)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate">
                        {getContentSpecificStatusLabel(status, item.type)}
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
                  {new Date(item.suggestedAt).toLocaleDateString()}
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
                {item.creator} • {item.year}
              </p>
            </div>
          </div>
          <div className="mb-4">
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
              className={`rounded-full text-xs flex-1 min-w-[100px] ${
                status === "Consumed" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleStatusUpdate("Consumed")}
              disabled={loading.consumed}
            >
              {loading.consumed ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {item.type === "book"
                ? "Finished"
                : item.type === "music" || item.type === "song"
                ? "Listened"
                : "Watched"}
            </Button>
            <Button
              variant={status === "Consuming" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${
                status === "Consuming" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleStatusUpdate("Consuming")}
              disabled={loading.consuming}
            >
              {loading.consuming ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {item.type === "book"
                ? "Reading"
                : item.type === "music" || item.type === "song"
                ? "Listening"
                : "Watching"}
            </Button>
            <Button
              variant={status === "WantToConsume" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${
                status === "WantToConsume" ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleStatusUpdate("WantToConsume")}
              disabled={loading.wantToConsume}
            >
              {loading.wantToConsume ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Bookmark className="h-3 w-3 mr-1" />
              )}
              {item.type === "book"
                ? "Reading List"
                : item.type === "music" || item.type === "song"
                ? "Listening List"
                : "Watchlist"}
            </Button>
            <Button
              variant={status === "NotInterested" ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-xs flex-1 min-w-[100px] ${
                status === "NotInterested" ? "bg-gray-600 text-white" : ""
              }`}
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
          <div className="flex items-center justify-between mb-4">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
                onClick={toggleWatchList}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "text-red-500" : "text-muted-foreground"
                  }`}
                  fill={isFavorite ? "red" : "none"}
                />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                ref={reactionBtnRef}
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
                onClick={handleReactionClick}
              >
                {reactions.length > 0 ? (
                  <div className="flex gap-1 items-center">
                    <div className="flex">
                      {reactions.map((emoji, index) => (
                        <span key={index} className="text-sm">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                      <SmilePlus size={15} />
                    </div>
                  </div>
                ) : (
                  <SmilePlus className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                ref={commentBtnRef}
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
                onClick={handleCommentClick}
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
              >
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </motion.div>
          </div>
          <div className="flex items-center pt-3 border-t border-border">
            <span className="text-xs font-medium text-foreground mr-2">
              Suggested by:
            </span>
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
              <span className="text-xs font-medium text-foreground">
                {item?.suggestedBy?.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SuggestedToMeCard;
