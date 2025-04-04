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
  User,
  Plus,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle,
  Clock,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SuggestionFlow from "@/components/suggestions/SuggestionFlow";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator?: string;
  description?: string;
  suggestedTo: {
    id: string;
    name: string;
    avatar?: string;
  }[];
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
}

const MySuggestions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);

  // Helper functions for content-specific status labels
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

  // Mock data - in a real app, this would come from an API
  const mockSuggestions: ContentItem[] = [
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
      suggestedTo: [
        {
          id: "1",
          name: "Emma Watson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        },
        {
          id: "2",
          name: "John Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
      ],
      suggestedAt: "2023-06-15T14:30:00Z",
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
      suggestedTo: [
        {
          id: "3",
          name: "Sophia Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
        },
      ],
      suggestedAt: "2023-06-10T09:15:00Z",
      status: "finished",
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
      suggestedTo: [
        {
          id: "4",
          name: "Michael Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        },
        {
          id: "5",
          name: "Olivia Parker",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
        },
      ],
      suggestedAt: "2023-06-05T16:45:00Z",
      status: "watching",
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
      suggestedTo: [
        {
          id: "6",
          name: "David Kim",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        },
      ],
      suggestedAt: "2023-06-01T11:20:00Z",
      status: "listened",
    },
  ];

  const filteredSuggestions =
    activeTab === "all"
      ? mockSuggestions
      : mockSuggestions.filter((item) => item.type === activeTab);

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

  const handleSuggestionComplete = (data: any) => {
    console.log("Suggestion completed:", data);
    setIsSuggestionFlowOpen(false);
    // In a real app, this would send the suggestion to the backend
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              My <span className="text-primary">Suggestions</span>
            </h1>
            <Button
              onClick={() => setIsSuggestionFlowOpen(true)}
              className="rounded-full gap-2"
            >
              <Plus className="h-4 w-4" />
              New Suggestion
            </Button>
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
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden shadow-social dark:shadow-social-dark transition-all hover:shadow-social-hover dark:hover:shadow-social-dark-hover border-0"
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
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.creator} • {item.year}
                          </p>
                          <p className="text-sm line-clamp-2 mb-4">
                            {item.description}
                          </p>

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
                                    <AvatarImage
                                      src={recipient.avatar}
                                      alt={recipient.name}
                                    />
                                    <AvatarFallback className="bg-primary-100 text-primary-800">
                                      {recipient.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">
                                    {recipient.name}
                                  </span>
                                </div>
                              ))}
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
                    <h3 className="text-xl font-semibold mb-2">
                      No suggestions yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      You haven't made any suggestions in this category yet.
                      Start sharing your favorite content with friends!
                    </p>
                    <Button
                      onClick={() => setIsSuggestionFlowOpen(true)}
                      className="rounded-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Suggestion
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SuggestionFlow
        open={isSuggestionFlowOpen}
        onOpenChange={setIsSuggestionFlowOpen}
        onComplete={handleSuggestionComplete}
      />
    </div>
  );
};

export default MySuggestions;
