import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Suggestor, suggestorsArray } from "@/data/suggestors";
import { ContentItem, contentItemArray } from "@/data/contentItem";
import { suggestContent } from "@/services/suggestion.service";
import SuggestionButton from "../suggestions/SuggestionButton";
import SuggestionFlow from "../suggestions/SuggestionFlow";
import SuggestorsList from "../suggestors/SuggestorsList";
import ExploreSection from "./ExploreSection";
import RecentSuggestions from "./RecentSuggestions";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authentication state
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);
  const [recentSuggestions, setRecentSuggestions] =
    useState<ContentItem[]>(contentItemArray);
  const [suggestors, setSuggestors] = useState<Suggestor[]>(suggestorsArray);
const [isAuthenticationOpen, setIsAuthenticationOpen] = useState(false);
  const navigate = useNavigate();

  // Mock function to fetch suggestors data and recent suggestions
  useEffect(() => {
    // In a real app, this would be an API call
    // fetchSuggestors().then(data => setSuggestors(data));
    // fetchRecentSuggestions().then(data => setRecentSuggestions(data));
  }, []);

  const handleSuggestorClick = (suggestor: Suggestor) => {
    // Navigate to suggestor's suggestions page
    console.log("Viewing suggestions from:", suggestor.name);
    // In a real app, this would navigate to a different route
    // navigate(`/suggestor/${suggestor.id}`);
  };

  const handleSuggestionComplete = async (data: any) => {
    console.log("Suggestion completed:", data);
    await suggestContent(data).then((res) => {
      console.log(res);
    });
    setIsSuggestionFlowOpen(false);
    // In a real app, this would send the suggestion to the backend
  };

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="w-full pt-0 pb-[10vh]  px-4">
      <div className="py-6">
        {/* <h1 className="text-3xl font-bold text-foreground mb-8 flex gap-2">
          Welcome to
          <AppName
            className="text-3xl text-primary"
            className2="text-3xl text-primary"
          />
        </h1> */}

        <div className="p-6">
          {/* <h2 className="text-2xl font-bold mb-4 text-foreground">
            Explore Content
          </h2> */}
          <ExploreSection />
        </div>

        

        <RecentSuggestions
        recentSuggestions={recentSuggestions}
        navigate={navigate}
        />

        <div className="">
          <SuggestorsList
            suggestors={suggestors}
            onSuggestorClick={handleSuggestorClick}
            className="p-6"
          />
        </div>
        <SuggestionButton
          onClick={() => isAuthenticated ? setIsSuggestionFlowOpen(true) : setIsAuthenticationOpen(true)}
          label="Suggest"
          tooltipText="Suggest content to your friends"
        />

        <SuggestionFlow
          open={isSuggestionFlowOpen}
          onOpenChange={setIsSuggestionFlowOpen}
          onComplete={handleSuggestionComplete}
        />
      </div>
    </main>
  );
};

export default Home;
