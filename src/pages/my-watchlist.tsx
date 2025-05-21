import React, { useState, useEffect } from "react";
import { CustomTabsList } from "@/components/layout/CustomTabsList";
import MyWatchListCard from "@/components/layout/MyWatchListCard";
import { getUserContent } from "@/services/contentList.service";
import { toast } from "@/services/toast.service";

interface ContentItem {
  id: string;
  userContentId: string;
  contentId: string;
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
  status: "WantToConsume" | "Consuming" | "Consumed" | "NotInterested" | null;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

const MyWatchlist = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [watchListItems, setWatchlistItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Fetch watchlist items
  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      try {
        const response = await getUserContent({
          page,
          limit,
          type: activeTab === "all" ? undefined : activeTab,
        });
        if (response.success) {
          console.log("Watchlist items: ", response.data);
          setWatchlistItems(response.data?.data);
          setTotalPages(Math.ceil(response?.data?.total / limit));
        } else {
          toast.error("Abe, watchlist fetch nahi hui!");
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error("Abe, kuch gadbad ho gaya!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, [activeTab, page]);

  return (
    <main className="w-full mx-auto pb-[10vh] pt-0 px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          My <span className="text-primary">Collections</span>
        </h1>
        <CustomTabsList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredSuggestions={watchListItems}
          CustomCard={MyWatchListCard}
          isLoading={isLoading}
          onToggleEmojiPicker={() => {}}
          onToggleCommentBox={() => {}}
          cardReactions={{}}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
    </main>
  );
};

export default MyWatchlist;