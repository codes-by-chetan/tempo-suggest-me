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
}

const MyWatchlist = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Mock data - in a real app, this would come from an API
  const mockWatchlistItems: ContentItem[] = [
    {
      id: "1",
      title: "Inception",
      type: "movie",
      imageUrl:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80",
      year: "2010",
      creator: "Christopher Nolan",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      suggestedBy: {
        id: "1",
        name: "Emma Watson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      addedAt: "2023-06-15T14:30:00Z",
      status: "watched",
    },
    {
      id: "2",
      title: "1984",
      type: "book",
      imageUrl:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80",
      year: "1949",
      creator: "George Orwell",
      description:
        "A dystopian social science fiction novel and cautionary tale set in a totalitarian state.",
      suggestedBy: {
        id: "3",
        name: "Sophia Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      },
      addedAt: "2023-06-10T09:15:00Z",
      status: "reading",
    },
    {
      id: "3",
      title: "Death Note",
      type: "anime",
      imageUrl:
        "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=300&q=80",
      year: "2006",
      creator: "Tsugumi Ohba",
      description:
        "A high school student discovers a supernatural notebook that allows him to kill anyone by writing the victim's name while picturing their face.",
      suggestedBy: {
        id: "4",
        name: "Michael Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      addedAt: "2023-06-05T16:45:00Z",
      status: "watchlist",
    },
    {
      id: "4",
      title: "Imagine",
      type: "song",
      imageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80",
      year: "1971",
      creator: "John Lennon",
      description:
        "A song co-produced by John Lennon, Yoko Ono, and Phil Spector, encouraging listeners to imagine a world of peace.",
      suggestedBy: {
        id: "6",
        name: "David Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      addedAt: "2023-06-01T11:20:00Z",
      status: "listened",
    },
  ];

  // Filter by content type and status
  const filteredItems = mockWatchlistItems
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
    // In a real app, this would update the backend
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

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 mb-8 p-1 bg-muted/50">
              <TabsTrigger value="all" className="rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger
                value="movie"
                className="flex items-center gap-2 rounded-full"
              >
                <Film className="h-4 w-4" />
                Movies
              </TabsTrigger>
              <TabsTrigger
                value="book"
                className="flex items-center gap-2 rounded-full"
              >
                <BookOpen className="h-4 w-4" />
                Books
              </TabsTrigger>
              <TabsTrigger
                value="anime"
                className="flex items-center gap-2 rounded-full"
              >
                <Tv className="h-4 w-4" />
                Anime
              </TabsTrigger>
              <TabsTrigger
                value="song"
                className="flex items-center gap-2 rounded-full"
              >
                <Music className="h-4 w-4" />
                Songs
              </TabsTrigger>
              <TabsTrigger
                value="youtube"
                className="flex items-center gap-2 rounded-full"
              >
                <Youtube className="h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0"
                    >
                      <div className="flex flex-col h-full">
                        {item.imageUrl && (
                          <div className="w-full h-40 bg-muted relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                            {item.status && (
                              <Badge
                                className={`absolute top-2 right-2 flex items-center gap-1 ${getStatusColor(item.status)}`}
                              >
                                {getStatusIcon(item.status)}
                                {getStatusText(item.status, item.type)}
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardContent className="flex-1 p-5">
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
                              {new Date(item.addedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.creator} • {item.year}
                          </p>
                          <p className="text-sm line-clamp-2 mb-4">
                            {item.description}
                          </p>

                          {/* Status update buttons */}
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              variant={
                                ["watched", "finished", "listened"].includes(
                                  item.status || "",
                                )
                                  ? "default"
                                  : "ghost"
                              }
                              size="sm"
                              className="rounded-full p-2 h-auto"
                              onClick={() => {
                                const completedStatus =
                                  item.type === "book"
                                    ? "finished"
                                    : item.type === "song"
                                      ? "listened"
                                      : "watched";
                                handleUpdateStatus(item.id, completedStatus);
                              }}
                            >
                              <CheckCircle
                                className={`h-4 w-4 ${["watched", "finished", "listened"].includes(item.status || "") ? "text-white" : "text-muted-foreground"}`}
                              />
                            </Button>
                            <Button
                              variant={
                                ["watching", "reading", "listening"].includes(
                                  item.status || "",
                                )
                                  ? "default"
                                  : "ghost"
                              }
                              size="sm"
                              className="rounded-full p-2 h-auto"
                              onClick={() => {
                                const inProgressStatus =
                                  item.type === "book"
                                    ? "reading"
                                    : item.type === "song"
                                      ? "listening"
                                      : "watching";
                                handleUpdateStatus(item.id, inProgressStatus);
                              }}
                            >
                              <Clock
                                className={`h-4 w-4 ${["watching", "reading", "listening"].includes(item.status || "") ? "text-white" : "text-muted-foreground"}`}
                              />
                            </Button>
                            <Button
                              variant={
                                [
                                  "watchlist",
                                  "readlist",
                                  "listenlist",
                                ].includes(item.status || "")
                                  ? "default"
                                  : "ghost"
                              }
                              size="sm"
                              className="rounded-full p-2 h-auto"
                              onClick={() => {
                                const listStatus =
                                  item.type === "book"
                                    ? "readlist"
                                    : item.type === "song"
                                      ? "listenlist"
                                      : "watchlist";
                                handleUpdateStatus(item.id, listStatus);
                              }}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${["watchlist", "readlist", "listenlist"].includes(item.status || "") ? "text-white" : "text-muted-foreground"}`}
                              />
                            </Button>
                          </div>

                          <div className="flex flex-col pt-3 border-t border-border">
                            <span className="text-xs font-medium text-foreground mb-2">
                              Suggested by:
                            </span>
                            <div className="flex items-center bg-accent hover:bg-accent/80 rounded-full py-1 px-2 transition-colors w-fit">
                              <Avatar className="h-5 w-5 mr-1 ring-1 ring-primary/20">
                                <AvatarImage
                                  src={item.suggestedBy.avatar}
                                  alt={item.suggestedBy.name}
                                />
                                <AvatarFallback className="bg-primary-100 text-primary-800">
                                  {item.suggestedBy.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {item.suggestedBy.name}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-card rounded-lg shadow-social dark:shadow-social-dark p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Bookmark className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No items in your collection
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      {statusFilter
                        ? `You don't have any ${getStatusText(statusFilter).toLowerCase()} items in this category.`
                        : "Your collection is empty. Add items from the 'Suggested to Me' page!"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MyWatchlist;
