import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  Filter,
  Plus,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { myWatchListItems } from "@/data/myWatchListItems";
import { CustomTabsList } from "@/components/layout/CustomTabsList";
import MyWatchListCard from "@/components/layout/MyWatchListCard";

interface ContentItem {
  id: string;
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
  status:
    | "watched"
    | "watching"
    | "watchlist"
    | "finished"
    | "reading"
    | "readlist"
    | "listened"
    | "listening"
    | "listenlist"
    | null;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

const MyWatchlist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [watchListItems, setWatchlistItems] = useState(myWatchListItems)


  // Filter by content type and status
  const filteredItems = myWatchListItems
    .filter((item) => activeTab === "all" || item.type === activeTab)
    .filter((item) => statusFilter === null || item.status === statusFilter);

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

  const getStatusIcon = (status: string | null) => {
    if (!status) return null;

    // Completed statuses
    if (["watched", "finished", "listened"].includes(status)) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    // In progress statuses
    if (["watching", "reading", "listening"].includes(status)) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }

    // List statuses
    if (["watchlist", "readlist", "listenlist"].includes(status)) {
      return <Bookmark className="h-4 w-4 text-blue-500" />;
    }

    return null;
  };

  const getStatusText = (status: string | null, type: string = "") => {
    if (!status) return "";

    // For filter dropdown where we don't have the type
    if (!type) {
      switch (status) {
        case "watched":
        case "finished":
        case "listened":
          return "Completed";
        case "watching":
        case "reading":
        case "listening":
          return "In Progress";
        case "watchlist":
        case "readlist":
        case "listenlist":
          return "In List";
        default:
          return "";
      }
    }

    // When we have the content type
    switch (type) {
      case "book":
        return status === "finished"
          ? "Finished"
          : status === "reading"
            ? "Currently Reading"
            : status === "readlist"
              ? "In Reading List"
              : "";
      case "song":
        return status === "listened"
          ? "Listened"
          : status === "listening"
            ? "Currently Listening"
            : status === "listenlist"
              ? "In Listening List"
              : "";
      default:
        return status === "watched"
          ? "Watched"
          : status === "watching"
            ? "Currently Watching"
            : status === "watchlist"
              ? "In Watchlist"
              : "";
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "";

    // Completed statuses
    if (["watched", "finished", "listened"].includes(status)) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }

    // In progress statuses
    if (["watching", "reading", "listening"].includes(status)) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    }

    // List statuses
    if (["watchlist", "readlist", "listenlist"].includes(status)) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }

    return "";
  };

  // Update status handler
  const handleUpdateStatus = (id: string, newStatus: string | null) => {
    console.log(`Updating item ${id} to status: ${newStatus}`);
    // Update the local state with the new status
    setWatchlistItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: newStatus as any };
        }
        return item;
      }),
    );
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              My <span className="text-primary">Collections</span>
            </h1>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter
                      ? getStatusText(statusFilter)
                      : "All Statuses"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("watched")}>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("watching")}>
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("watchlist")}
                  >
                    <Bookmark className="h-4 w-4 text-blue-500 mr-2" />
                    In List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CustomTabsList
            activeTab={activeTab}
            CustomCard={MyWatchListCard}
            setActiveTab={setActiveTab}
            filteredSuggestions={filteredItems}
            handleMarkAsWatched={(id: string) => handleUpdateStatus(id, "watched")}
            handleMarkAsWatching={(id: string) => handleUpdateStatus(id, "watching")}
            handleRemoveFromMyWatchList={(id:string) => handleUpdateStatus(id, "remove")}
            myWatchList = {true}
          />

          
        </div>
      </main>
    </div>
  );
};

export default MyWatchlist;
