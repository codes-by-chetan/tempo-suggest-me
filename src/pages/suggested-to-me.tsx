import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Heart,
  MessageCircle,
  Share2,
  Plus,
  CheckCircle,
  Clock,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  suggestedAt: string;
  status?:
    | "watched"
    | "watching"
    | "watchlist"
    | "finished"
    | "reading"
    | "listened"
    | "listening"
    | "readlist"
    | "listenlist"
    | null;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

const SuggestedToMe = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);

  // Mock data - in a real app, this would come from an API
  React.useEffect(() => {
    setSuggestions(mockSuggestions);
  }, []);

  const mockSuggestions: ContentItem[] = [
    {
      id: "1",
      title: "The Shawshank Redemption",
      type: "movie",
      imageUrl:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
      year: "1994",
      creator: "Frank Darabont",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      suggestedBy: {
        id: "1",
        name: "Emma Watson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      suggestedAt: "2023-06-15T14:30:00Z",
      whereToWatch: ["Netflix", "Amazon Prime", "HBO Max"],
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      type: "book",
      imageUrl:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
      year: "1960",
      creator: "Harper Lee",
      description:
        "The story of racial injustice and the loss of innocence in the American South during the Great Depression.",
      suggestedBy: {
        id: "2",
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      suggestedAt: "2023-06-10T09:15:00Z",
      whereToRead: ["Amazon", "Barnes & Noble", "Local Library"],
    },
    {
      id: "3",
      title: "Attack on Titan",
      type: "anime",
      imageUrl:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80",
      year: "2013",
      creator: "Hajime Isayama",
      description:
        "In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
      suggestedBy: {
        id: "3",
        name: "Sophia Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      },
      suggestedAt: "2023-06-05T16:45:00Z",
      whereToWatch: ["Crunchyroll", "Funimation", "Netflix"],
    },
    {
      id: "4",
      title: "Bohemian Rhapsody",
      type: "song",
      imageUrl:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
      year: "1975",
      creator: "Queen",
      description:
        "A six-minute suite, consisting of several sections without a chorus: an intro, a ballad segment, an operatic passage, a hard rock part and a reflective coda.",
      suggestedBy: {
        id: "4",
        name: "Michael Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      suggestedAt: "2023-06-01T11:20:00Z",
      whereToListen: ["Spotify", "Apple Music", "YouTube Music"],
    },
  ];

  const filteredSuggestions =
    activeTab === "all"
      ? suggestions
      : suggestions.filter((item) => item.type === activeTab);

  const handleMarkAsWatched = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificWatchedStatus(item.type);
          return { ...item, status };
        }
        return item;
      }),
    );
  };

  const handleMarkAsWatching = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificWatchingStatus(item.type);
          return { ...item, status };
        }
        return item;
      }),
    );
  };

  const handleAddToWatchlist = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificListStatus(item.type);
          return { ...item, status };
        }
        return item;
      }),
    );
  };

  const getContentSpecificListStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "readlist";
      case "song":
        return "listenlist";
      default:
        return "watchlist";
    }
  };

  const getContentSpecificWatchedStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "finished";
      case "song":
        return "listened";
      default:
        return "watched";
    }
  };

  const getContentSpecificWatchingStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "reading";
      case "song":
        return "listening";
      default:
        return "watching";
    }
  };

  const getContentSpecificStatusLabel = (
    status: string,
    type: string,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            <span className="text-primary">Suggested</span> to Me
          </h1>

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
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0 cursor-pointer"
                      onClick={() =>
                        navigate(`/content/${item.id}`, {
                          state: { contentDetails: item },
                        })
                      }
                    >
                      <div className="flex flex-col h-full relative">
                        {item.imageUrl && (
                          <div className="w-full h-40 bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
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
                              {new Date(item.suggestedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.creator} • {item.year}
                          </p>
                          <p className="text-sm line-clamp-2 mb-4 text-foreground">
                            {item.description}
                          </p>

                          {/* Status indicator */}
                          {item.status && (
                            <div className="absolute top-2 right-2 z-10">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "watched" || item.status === "finished" || item.status === "listened" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : item.status === "watching" || item.status === "reading" || item.status === "listening" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}
                              >
                                {item.status === "watched" ||
                                item.status === "finished" ||
                                item.status === "listened" ? (
                                  <>
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    {getContentSpecificStatusLabel(
                                      item.status,
                                      item.type,
                                    )}
                                  </>
                                ) : item.status === "watching" ||
                                  item.status === "reading" ||
                                  item.status === "listening" ? (
                                  <>
                                    <Clock className="mr-1 h-3 w-3" />
                                    {getContentSpecificStatusLabel(
                                      item.status,
                                      item.type,
                                    )}
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

                          {/* Action buttons */}
                          <div className="flex items-center justify-between mb-4 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs flex-1"
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
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs flex-1"
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
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs flex-1"
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

                          {/* Social media style interaction buttons */}
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full p-2 h-auto"
                            >
                              <Heart className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full p-2 h-auto"
                            >
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full p-2 h-auto"
                            >
                              <Share2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>

                          <div className="flex items-center pt-3 border-t border-border">
                            <span className="text-xs font-medium text-foreground mr-2">
                              Suggested by:
                            </span>
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-1 ring-1 ring-primary/20">
                                <AvatarImage
                                  src={item.suggestedBy.avatar}
                                  alt={item.suggestedBy.name}
                                />
                                <AvatarFallback className="bg-primary-100 text-primary-800">
                                  {item.suggestedBy.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-foreground">
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
                      <Film className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      No suggestions yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      You don't have any suggestions in this category yet. Ask
                      your friends to recommend something!
                    </p>
                    <Button className="rounded-full gap-2">
                      <Plus className="h-4 w-4" />
                      Ask for Recommendations
                    </Button>
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

export default SuggestedToMe;
