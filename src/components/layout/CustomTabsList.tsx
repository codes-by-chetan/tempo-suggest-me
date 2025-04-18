import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Film,
  BookOpen,
  Tv,
  Music,
  Youtube,
  Plus,
  Instagram,
} from "lucide-react";

import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export const CustomTabsList = ({
  activeTab,
  setActiveTab,
  filteredSuggestions,
  handleMarkAsWatched ,
  handleMarkAsWatching,
  handleAddToWatchlist = (id:string) => {},
  handleRemoveFromMyWatchList = (id:string) => {},
  CustomCard,
  myWatchList = false,
}) => {
  const tabs = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies", icon: Film },
    { value: "book", label: "Books", icon: BookOpen },
    { value: "anime", label: "Anime", icon: Tv },
    { value: "song", label: "Songs", icon: Music },
    { value: "youtube", label: "Videos", icon: Youtube },
  ];

  console.log("Card that has been passed to CustomTabsList: ",CustomCard);
  

  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      onValueChange={(value) => {
        console.log("value :", value);
        setActiveTab(value);
      }}
      className="w-full"
    >
      <TabsList className="grid grid-cols-6 mb-8 p-1 bg-slate-200/60 dark:bg-muted/50 rounded-full">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={`flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:dark:bg-primary-900`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab} className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item) => (
              <CustomCard
                key={item.id}
                item={item}
                myWatchlist={myWatchList}
                handleMarkAsWatched={handleMarkAsWatched}
                handleMarkAsWatching={handleMarkAsWatching}
                handleAddToWatchlist={handleAddToWatchlist}
              />
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
                You don't have any suggestions in this category yet. Ask your
                friends to recommend something!
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
  );
};

export default TabsList;
