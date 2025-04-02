import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Film, BookOpen, Tv, Music, Youtube, Instagram } from "lucide-react";

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
}

const SuggestedToMe = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - in a real app, this would come from an API
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Suggested to Me
          </h1>

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
                          <div className="flex items-center mt-auto pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              Suggested by:
                            </span>
                            <div className="flex items-center ml-2">
                              <img
                                src={item.suggestedBy.avatar}
                                alt={item.suggestedBy.name}
                                className="h-5 w-5 rounded-full mr-1"
                              />
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
    </div>
  );
};

export default SuggestedToMe;
