import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import {
  Film,
  BookOpen,
  Tv,
  Music,
  Youtube,
  Instagram,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SuggestionFlow from "@/components/suggestions/SuggestionFlow";
import { CustomTabsList } from "@/components/layout/CustomTabsList";
import { ContentItem, mockMySuggestions } from "@/data/mySuggestions";
import MySuggestionCard from "@/components/layout/MySuggestion";
import {
  getSuggestedByYou,
  suggestContent,
} from "@/services/suggestion.service";

const MySuggestions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<ContentItem[]>(
    activeTab === "all"
      ? suggestions
      : suggestions.filter((item) => item.type === activeTab)
  );
  useEffect(() => {
    setFilteredSuggestions(
      activeTab === "all"
        ? suggestions
        : suggestions.filter((item) => item.type === activeTab)
    );
    console.log("filtered Suggestions: ", filteredSuggestions);
  }, [activeTab, suggestions]);

  useEffect(() => {
    getSuggestedByYou().then((res) => {
      if (res.success) {
        setSuggestions(res.data);
      } else {
        setSuggestions(mockMySuggestions);
      }
      console.log(res);
    });
  }, [activeTab]);
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

  const handleSuggestionComplete = async (data: any) => {
    console.log("Suggestion completed:", data);
    await suggestContent(data).then((res) => {
      console.log(res);
    });
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
            CustomCard={MySuggestionCard}
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
