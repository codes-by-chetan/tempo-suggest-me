import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Film,
  BookOpen,
  Tv,
  Music,
  Youtube,
  Instagram,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  Clock,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import LikeCommentShare from "../reusables/LikeCommentShare";

function MySuggestionCard({ item }) {
  const navigate = useNavigate();

  const getIconForType = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-5 w-5" />;
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "anime":
        return <Tv className="h-5 w-5" />;
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

  return (
    <Card
      key={item.id}
      className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0 cursor-pointer"
    >
      <div className="flex flex-col h-full relative">
        {item.imageUrl && (
          <div
            className="w-full h-40 bg-muted"
            onClick={() =>
              navigate(getRouteForType(item.type, item?.contentId || item.id))
            }
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardContent className="flex-1 p-5">
          {/* Status indicator */}
          {item.status && (
            <div className="absolute top-2 right-2 z-10">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {getContentSpecificStatusLabel(item.status, item.type)}
                  </>
                ) : item.status === "watching" ||
                  item.status === "reading" ||
                  item.status === "listening" ? (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    {getContentSpecificStatusLabel(item.status, item.type)}
                  </>
                ) : item.status === "watchlist" ? (
                  <>
                    <Bookmark className="mr-1 h-3 w-3" />
                    In Watchlist
                  </>
                ) : item.status === "readlist" ? (
                  <>
                    <Bookmark className="mr-1 h-3 w-3" />
                    In Reading List
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-1 h-3 w-3" />
                    In Listening List
                  </>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                {getIconForType(item.type)}
              </div>
              <span className="text-xs font-medium text-primary capitalize">
                {item.type}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(item.suggestedAt).toLocaleDateString()}
            </span>
          </div>
          <h3
            className="font-semibold text-lg mb-1 line-clamp-1"
            onClick={() =>
              navigate(getRouteForType(item.type, item?.contentId || item.id))
            }
          >
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {item.creator} • {item.year}
          </p>
          <p
            className="text-sm line-clamp-2 mb-4"
            dangerouslySetInnerHTML={{
              __html: item.description || "No description available.",
            }}
          ></p>

          <LikeCommentShare />
          <div className="flex flex-col pt-3 border-t border-border">
            <span className="text-xs font-medium text-foreground mb-2">
              Suggested to:
            </span>
            <div className="flex flex-wrap gap-1">
              {item.suggestedTo.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center bg-accent hover:bg-accent/80 rounded-full py-1 px-2 transition-colors"
                >
                  <Avatar className="h-5 w-5 mr-1 ring-1 ring-primary/20">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {recipient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{recipient.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default MySuggestionCard;
