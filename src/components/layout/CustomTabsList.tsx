import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, BookOpen, Music, Youtube, Plus, Clapperboard } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import SuggestionPlaceholderCard from "./SuggestionPlaceholderCard";
import { Dispatch, SetStateAction } from "react";

interface CustomTabsListProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  filteredSuggestions: any[];
  CustomCard: any;
  isLoading?: boolean;
  onToggleEmojiPicker?: (id: string, position: { top: number; left: number }) => void;
  onToggleCommentBox?: (id: string, position: { top: number; left: number }) => void;
  cardReactions?: Record<string, string[]>;
  page?: number;
  totalPages?: number;
  setPage?: Dispatch<SetStateAction<number>>;
}

export const CustomTabsList = ({
  activeTab,
  setActiveTab,
  filteredSuggestions,
  CustomCard,
  isLoading = false,
  onToggleEmojiPicker,
  onToggleCommentBox,
  cardReactions,
  page=1,
  totalPages=1,
  setPage,
}: CustomTabsListProps) => {
  const tabs = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies", icon: Film },
    { value: "series", label: "Series", icon: Clapperboard },
    { value: "book", label: "Books", icon: BookOpen },
    { value: "music", label: "Music", icon: Music },
    { value: "video", label: "Videos", icon: Youtube },
  ];

  const skeletonPlaceholders = Array(6)
    .fill(0)
    .map((_, index) => <SuggestionPlaceholderCard key={`skeleton-${index}`} />);

  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value);
        if (setPage) setPage(1); // Reset to page 1 on tab change
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
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading ? (
              skeletonPlaceholders
            ) : filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomCard
                    item={item}
                    onToggleEmojiPicker={onToggleEmojiPicker}
                    onToggleCommentBox={onToggleCommentBox}
                    cardReactions={cardReactions}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full text-center py-12 bg-card rounded-lg shadow-social dark:shadow-social-dark p-8"
              >
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
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        {page && totalPages && setPage && totalPages > 1 ? (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        ): <></>}
      </TabsContent>
    </Tabs>
  );
};

export default CustomTabsList;