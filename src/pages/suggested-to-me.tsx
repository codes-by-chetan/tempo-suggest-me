import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Suggestion {
  id: string;
  type: string;
  title: string;
  suggestedBy: string;
  date: string;
  details?: {
    author?: string;
    director?: string;
    artist?: string;
    creator?: string;
    releaseDate?: string;
    platform?: string;
  };
}

const SuggestedToMe: React.FC = () => {
  // Mock data - replace with actual API calls later
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      type: "movie",
      title: "Inception",
      suggestedBy: "Alex Chen",
      date: "2023-06-15",
      details: {
        director: "Christopher Nolan",
        releaseDate: "2010",
      },
    },
    {
      id: "2",
      type: "book",
      title: "Dune",
      suggestedBy: "Jamie Smith",
      date: "2023-06-10",
      details: {
        author: "Frank Herbert",
        releaseDate: "1965",
      },
    },
    {
      id: "3",
      type: "anime",
      title: "Attack on Titan",
      suggestedBy: "Robin Lee",
      date: "2023-06-05",
      details: {
        creator: "Hajime Isayama",
        platform: "Crunchyroll",
      },
    },
    {
      id: "4",
      type: "song",
      title: "Blinding Lights",
      suggestedBy: "Taylor Wong",
      date: "2023-06-01",
      details: {
        artist: "The Weeknd",
        releaseDate: "2019",
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Suggested to Me
        </h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="anime">Anime</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </TabsContent>

          <TabsContent value="movies" className="space-y-4">
            {suggestions
              .filter((s) => s.type === "movie")
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            {suggestions
              .filter((s) => s.type === "book")
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </TabsContent>

          <TabsContent value="anime" className="space-y-4">
            {suggestions
              .filter((s) => s.type === "anime")
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </TabsContent>

          <TabsContent value="songs" className="space-y-4">
            {suggestions
              .filter((s) => s.type === "song")
              .map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-foreground">{suggestion.title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          Suggested by {suggestion.suggestedBy} on {suggestion.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-foreground">
          <p className="font-medium">
            Type:{" "}
            <span className="font-normal">
              {suggestion.type.charAt(0).toUpperCase() +
                suggestion.type.slice(1)}
            </span>
          </p>
          {suggestion.details?.director && (
            <p className="font-medium">
              Director:{" "}
              <span className="font-normal">{suggestion.details.director}</span>
            </p>
          )}
          {suggestion.details?.author && (
            <p className="font-medium">
              Author:{" "}
              <span className="font-normal">{suggestion.details.author}</span>
            </p>
          )}
          {suggestion.details?.artist && (
            <p className="font-medium">
              Artist:{" "}
              <span className="font-normal">{suggestion.details.artist}</span>
            </p>
          )}
          {suggestion.details?.creator && (
            <p className="font-medium">
              Creator:{" "}
              <span className="font-normal">{suggestion.details.creator}</span>
            </p>
          )}
          {suggestion.details?.releaseDate && (
            <p className="font-medium">
              Released:{" "}
              <span className="font-normal">
                {suggestion.details.releaseDate}
              </span>
            </p>
          )}
          {suggestion.details?.platform && (
            <p className="font-medium">
              Available on:{" "}
              <span className="font-normal">{suggestion.details.platform}</span>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default">Mark as Watched</Button>
        <Button variant="outline" className="ml-2">
          Thank {suggestion.suggestedBy.split(" ")[0]}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestedToMe;
