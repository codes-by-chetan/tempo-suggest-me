"use client";

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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Position {
  top: number;
  left: number;
}

function SuggestedToMeCard({
  item,
  handleMarkAsWatched,
  handleMarkAsWatching,
  handleAddToWatchlist,
  onToggleEmojiPicker,
  onToggleCommentBox,
  cardReactions = {},
}) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const reactionBtnRef = useRef<HTMLButtonElement>(null);
  const commentBtnRef = useRef<HTMLButtonElement>(null);

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
    status: string,
    type: string
  ): string => {
    if (status === "watchlist") return "In Watchlist";
    if (status === "readlist") return "In Reading List";
    if (status === "listenlist") return "In Listening List";

    switch (type) {
      case "book":
        return status === "finished" ? "Finished" : "Reading";
      case "song":
        return status === "listened" ? "Listened" : "Listening";
      default:
        return status === "watched" ? "Watched" : "Watching";
    }
  };
  const getStatusBadgeColor = (status: string) => {
    if (
      status === "watched" ||
      status === "finished" ||
      status === "listened"
    ) {
      return "bg-green-600 text-white";
    } else if (
      status === "watching" ||
      status === "reading" ||
      status === "listening"
    ) {
      return "bg-blue-600 text-white";
    } else {
      return "bg-amber-600 text-white";
    }
  };
  const toggleWatchList = (id: string) => {
    console.log(`Added ${id} to watchlist`);
    setIsFavorite(!isFavorite);
  };

  const handleReactionClick = () => {
    if (reactionBtnRef.current) {
      const rect = reactionBtnRef.current.getBoundingClientRect();
      const position: Position = {
        top: rect.bottom + window.scrollY,
        left: Math.max(rect.left + window.scrollX - 150, 10), // Ensure it's not too far left
      };
      onToggleEmojiPicker(item.id, position);
    }
  };

  const handleCommentClick = () => {
    if (commentBtnRef.current) {
      const rect = commentBtnRef.current.getBoundingClientRect();
      const position: Position = {
        top: rect.bottom + window.scrollY,
        left: Math.max(rect.left + window.scrollX - 150, 10), // Ensure it's not too far left
      };
      onToggleCommentBox(item.id, position);
    }
  };

  // Get reactions for this card
  const reactions = cardReactions[item.id] || [];

  // Determine image aspect ratio based on content type
  const getImageClass = (type: string) => {
    switch (type) {
      case "music":
      case "song":
        return "aspect-square"; // 1:1 ratio for music
      default:
        return "aspect-[2/3]"; // 2:3 ratio for movies, books, etc.
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
          {/* Top section with image on left, title/type/year on right */}
          <div className="flex mb-4 relative">
            {/* Left side - Image with appropriate aspect ratio */}
            {/* Status indicator */}
            {item.status && (
              <div className="absolute top-1 right-1 z-10">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    item.status === "watched" ||
                    item.status === "finished" ||
                    item.status === "listened"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : item.status === "watching" ||
                        item.status === "reading" ||
                        item.status === "listening"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {item.status === "watched" ||
                  item.status === "finished" ||
                  item.status === "listened" ? (
                    <>
                      <CheckCircle className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate ">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  ) : item.status === "watching" ||
                    item.status === "reading" ||
                    item.status === "listening" ? (
                    <>
                      <Clock className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate ">
                        {getContentSpecificStatusLabel(item.status, item.type)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-0.5 h-2.5 w-2.5" />
                      <span className="truncate ">
                        {item.status === "readlist"
                          ? "Reading List"
                          : item.status === "listenlist"
                          ? "Listen List"
                          : "Watchlist"}
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
                navigate(getRouteForType(item.type, item?.contentId || item.id))
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

            {/* Right side - Title, type, year */}
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
                    getRouteForType(item.type, item?.contentId || item.id)
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

          {/* Description - Full width */}
          <div className="mb-4">
            <p
              className="text-sm line-clamp-2 text-foreground"
              dangerouslySetInnerHTML={{
                __html: item.description || "No description available.",
              }}
            ></p>
          </div>

          {/* Action buttons - Full width */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <Button
              variant={
                item.status === "finished" ||
                item.status === "listened" ||
                item.status === "watched"
                  ? "default"
                  : "outline"
              }
              size="sm"
              className={`rounded-full text-xs flex-1 ${
                item.status === "finished" ||
                item.status === "listened" ||
                item.status === "watched"
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => handleMarkAsWatched(item.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {item.type === "book"
                ? "Finished"
                : item.type === "song"
                ? "Listened"
                : "Watched"}
            </Button>

            <Button
              variant={
                item.status === "reading" ||
                item.status === "listening" ||
                item.status === "watching"
                  ? "default"
                  : "outline"
              }
              size="sm"
              className={`rounded-full text-xs flex-1 ${
                item.status === "reading" ||
                item.status === "listening" ||
                item.status === "watching"
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => handleMarkAsWatching(item.id)}
            >
              <Clock className="h-3 w-3 mr-1" />
              {item.type === "book"
                ? "Reading"
                : item.type === "song"
                ? "Listening"
                : "Watching"}
            </Button>

            <Button
              variant={
                item.status === "readlist" ||
                item.status === "listenlist" ||
                item.status === "watchlist"
                  ? "default"
                  : "outline"
              }
              size="sm"
              className={`rounded-full text-xs flex-1 ${
                item.status === "readlist" ||
                item.status === "listenlist" ||
                item.status === "watchlist"
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => handleAddToWatchlist(item.id)}
            >
              <Bookmark className="h-3 w-3 mr-1" />
              {item.type === "book"
                ? "Reading List"
                : item.type === "song"
                ? "Listening List"
                : "Watchlist"}
            </Button>
          </div>

          {/* Social media style interaction buttons - Full width */}
          <div className="flex items-center justify-between mb-4">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 h-auto"
                onClick={() => toggleWatchList(item.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "text-red-500" : "text-muted-foreground"
                  }`}
                  fill={isFavorite ? "red" : "none"}
                />
              </Button>
            </motion.div>

            {/* Reaction Button */}
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

            {/* Comment Button */}
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

            {/* Share Button */}
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

          {/* Suggested by - Full width */}
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
