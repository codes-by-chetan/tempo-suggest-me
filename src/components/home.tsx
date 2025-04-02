import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import SuggestorsList from "./suggestors/SuggestorsList";
import SuggestionButton from "./suggestions/SuggestionButton";
import SuggestionFlow from "./suggestions/SuggestionFlow";

interface Suggestor {
  id: string;
  name: string;
  avatar?: string;
  suggestionCount: number;
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authentication state
  const [isSuggestionFlowOpen, setIsSuggestionFlowOpen] = useState(false);
  const [suggestors, setSuggestors] = useState<Suggestor[]>([
    {
      id: "1",
      name: "Emma Watson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      suggestionCount: 12,
    },
    {
      id: "2",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      suggestionCount: 8,
    },
    {
      id: "3",
      name: "Sophia Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      suggestionCount: 15,
    },
    {
      id: "4",
      name: "Michael Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      suggestionCount: 6,
    },
    {
      id: "5",
      name: "Olivia Parker",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
      suggestionCount: 10,
    },
    {
      id: "6",
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      suggestionCount: 9,
    },
  ]);

  // Mock function to fetch suggestors data
  useEffect(() => {
    // In a real app, this would be an API call
    // fetchSuggestors().then(data => setSuggestors(data));
  }, []);

  const handleSuggestorClick = (suggestor: Suggestor) => {
    // Navigate to suggestor's suggestions page
    console.log("Viewing suggestions from:", suggestor.name);
    // In a real app, this would navigate to a different route
    // navigate(`/suggestor/${suggestor.id}`);
  };

  const handleSuggestionComplete = (data: any) => {
    console.log("Suggestion completed:", data);
    setIsSuggestionFlowOpen(false);
    // In a real app, this would send the suggestion to the backend
  };

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome to Suggest.me
          </h1>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SuggestorsList
              suggestors={suggestors}
              onSuggestorClick={handleSuggestorClick}
              className="p-6"
            />
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Suggestions</h2>
            <div className="p-8 text-center text-gray-500">
              <p>Your recent suggestions will appear here.</p>
              <p className="mt-2">
                Use the Suggest button to start recommending content to your
                friends!
              </p>
            </div>
          </div>
        </div>
      </main>

      <SuggestionButton
        onClick={() => setIsSuggestionFlowOpen(true)}
        label="Suggest"
        tooltipText="Suggest content to your friends"
      />

      <SuggestionFlow
        open={isSuggestionFlowOpen}
        onOpenChange={setIsSuggestionFlowOpen}
        onComplete={handleSuggestionComplete}
      />
    </div>
  );
};

export default Home;
