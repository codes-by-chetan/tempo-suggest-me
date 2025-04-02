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
}

const MySuggestions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);

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
              My Suggestions
            </h1>
            <Button onClick={() => setIsSuggestionFlowOpen(true)}>
              New Suggestion
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
              </TabsTrigger>
              <TabsTrigger value="movie" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                Movies
              </TabsTrigger>
              <TabsTrigger value="book" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Books
              </TabsTrigger>
              <TabsTrigger value="anime" className="flex items-center gap-2">
                <Tv className="h-4 w-4" />
                Anime
              </TabsTrigger>
              <TabsTrigger value="song" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Songs
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
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
                      className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex h-full">
                        {item.imageUrl && (
                          <div className="w-1/3 bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent
                          className={`flex-1 p-4 ${!item.imageUrl ? "w-full" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getIconForType(item.type)}
                              <span className="text-xs text-muted-foreground capitalize">
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
                          <p className="text-sm line-clamp-2 mb-3">
                            {item.description}
                          </p>
                          <div className="flex flex-col mt-auto pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground mb-1">
                              Suggested to:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {item.suggestedTo.map((recipient) => (
                                <div
                                  key={recipient.id}
                                  className="flex items-center bg-muted rounded-full py-1 px-2"
                                >
                                  <Avatar className="h-4 w-4 mr-1">
                                    <AvatarImage
                                      src={recipient.avatar}
                                      alt={recipient.name}
                                    />
                                    <AvatarFallback>
                                      {recipient.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">
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
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No suggestions found for this category.
                    </p>
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
