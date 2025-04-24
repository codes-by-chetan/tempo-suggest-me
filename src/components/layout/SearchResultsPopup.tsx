import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, Tv, Music, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  _id: string;
  title?: string;
  name?: string;
  slug?: string;
  poster?: string;
  coverImage?: string;
  profileImage?: string;
  userName?: string;
  fullName?: { firstName: string; lastName: string };
  email?: string;
  profile?: { avatar?: { url: string }; bio?: string } | null;
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
    const slug = item.slug || item._id;
    switch (type) {
      case "movies":
        return `/movies/${slug}`;
      case "series":
        return `/series/${slug}`;
      case "books":
        return `/books/${slug}`;
      case "music":
      case "albums":
        return `/music/${slug}`;
      case "videos":
        return `/videos/${slug}`;
      case "people":
        return `/people/${slug}`;
      case "users":
        return `/profile/${item.userName || item._id}`;
      default:
        return "#";
    }
  };

  const renderResultItem = (item: SearchResult, type: string) => {
    const image =
      item.poster ||
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
      <div
        key={item._id}
        className="flex items-center gap-3 p-2 hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => {
          navigate(getRouteForType(type, item));
          document.dispatchEvent(new Event("closeSearchPopups"));
        }}
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
          <p className="text-sm font-medium line-clamp-1">{title}</p>
          <p className="text-xs text-muted-foreground capitalize">{type}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 p-0 bg-card border border-border rounded-md shadow-lg">
      <div className="p-3">
        <h3 className="text-sm font-medium">Search Results</h3>
      </div>
      <Separator />
      <ScrollArea className="h-[300px]">
        {isSearching ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Searching...
          </div>
        ) : globalResults?.results &&
          Object.keys(globalResults.results).length > 0 ? (
          Object.entries(globalResults.results).map(([type, { data }]) =>
            data.length > 0 ? (
              <div key={type}>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground capitalize flex items-center gap-2">
                  {getIconForType(type)}
                  {type}
                </div>
                {data.map((item) => renderResultItem(item, type))}
              </div>
            ) : null
          )
        ) : peopleResults?.data && peopleResults.data.length > 0 ? (
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground capitalize flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </div>
            {peopleResults.data.map((item) => renderResultItem(item, "users"))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No results found
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SearchResultsPopup;
