import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, Tv, Music, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import VerifiedBadgeIcon from "../profile/VerifiedBadgeIcon";

interface SearchResult {
  _id: string;
  title?: string;
  name?: string;
  slug?: string;
  poster?: { url: string; [key: string]: any } | string;
  coverImage?: string;
  profileImage?: string;
  userName?: string;
  fullName?: { firstName: string; lastName: string };
  email?: string;
  profile?: {
    avatar?: { url: string };
    bio?: string;
    [key: string]: any;
  } | null;
  [key: string]: any;
}

interface SearchResults {
  [key: string]: {
    data: SearchResult[];
    total: number;
  };
}

interface SearchResponse {
  results?: SearchResults;
  pagination?: {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
  };
  data?: SearchResult[];
}

interface SearchResultsPopupProps {
  globalResults: SearchResponse | null;
  peopleResults: SearchResponse | null;
  isSearching: boolean;
}

const SearchResultsPopup = ({
  globalResults,
  peopleResults,
  isSearching,
}: SearchResultsPopupProps) => {
  const navigate = useNavigate();
  console.log(globalResults);
  const getIconForType = (type: string) => {
    switch (type) {
      case "movies":
        return <Film className="h-4 w-4" />;
      case "series":
        return <Tv className="h-4 w-4" />;
      case "books":
        return <BookOpen className="h-4 w-4" />;
      case "music":
      case "albums":
        return <Music className="h-4 w-4" />;
      case "videos":
        return <Video className="h-4 w-4" />;
      case "people":
      case "users":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRouteForType = (type: string, item: SearchResult) => {
    const slug =
      item._id ||
      item?.tmdbId ||
      item?.spotifyId ||
      item?.openLibraryId ||
      item?.googleBooksId;
    switch (type) {
      case "movie":
        return `/movies/${slug}`;
      case "series":
        return `/series/${slug}`;
      case "book":
        return `/books/${slug}`;
      case "music":
      case "albums":
        return `/music/${slug}`;
      case "video":
        return `/videos/${slug}`;
      case "people":
        return `/people/${slug}`;
      case "user":
        return `/profile/${item.userName || item._id}`;
      default:
        return "#";
    }
  };

  const renderResultItem = (item: SearchResult, type: string) => {
    const image =
      typeof item.poster === "object"
        ? item.poster?.url
        : item.poster ||
          item.coverImage ||
          item.profileImage ||
          item.profile?.avatar?.url;
    const title =
      item.title ||
      item.name ||
      item.userName ||
      (item.fullName
        ? `${item.fullName.firstName} ${item.fullName.lastName}`
        : "Unknown");

    return (
      <motion.div
        key={item._id}
        className="flex items-center gap-3 p-2 hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => {
          navigate(getRouteForType(type, item));
          document.dispatchEvent(new Event("closeSearchPopups"));
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-8 w-8 rounded object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {getIconForType(type)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-medium line-clamp-1">{title}</p>
            {item.profile?.isVerified && (
              <VerifiedBadgeIcon className={"w-3 h-3"} />
            )}
          </div>
          <p className="text-xs text-muted-foreground capitalize">{type}</p>
        </div>
      </motion.div>
    );
  };

  // Animation variants for the popup container
  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Animation variants for staggered items
  const containerVariants = {
    hidden: { transition: { staggerChildren: 0.05 } },
    visible: { transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div
      className="w-80 p-0 bg-card border border-border rounded-md shadow-lg"
      variants={popupVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="p-3">
        <h3 className="text-sm font-medium">Search Results</h3>
      </div>
      <Separator />
      <ScrollArea className="h-[300px]">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              className="p-4 text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Searching...
            </motion.div>
          ) : globalResults && Object.keys(globalResults).length > 0 ? (
            <motion.div
              key="global-results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Object.entries(globalResults).map(([type, { data }]) =>
                data.length > 0 ? (
                  <div key={type}>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground capitalize flex items-center gap-2">
                      {getIconForType(type)}
                      {type}
                    </div>
                    {data.map((item) => renderResultItem(item, type))}
                  </div>
                ) : null
              )}
            </motion.div>
          ) : peopleResults?.data && peopleResults.data.length > 0 ? (
            <motion.div
              key="people-results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground capitalize flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </div>
              {peopleResults.data.map((item) =>
                renderResultItem(item, "users")
              )}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              className="p-4 text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              No results found
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
};

export default SearchResultsPopup;
