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
import { CustomTabsList } from "@/components/layout/CustomTabsList";

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
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

const MySuggestions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);

  // Helper functions for content-specific status labels
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

          <CustomTabsList
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredSuggestions={filteredSuggestions}
            handleMarkAsWatched={() => {}}
            handleMarkAsWatching={() => {}}
            handleAddToWatchlist={() => {}}
          />

         
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
