import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { globalSearch, searchPeople } from "@/services/search.service";
import {
  GlobalSearchResponse,
  PeopleSearchResponse,
} from "@/interfaces/search.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { label: "All", value: "all" },
    { label: "Users", value: "users" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Music", value: "music" },
    { label: "Books", value: "book" },
  ];

  // Debounce search term update
  const updateDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setPage(1);
      setSearchParams({ q: value });
    }, 800),
    [setSearchParams]
  );

  useEffect(() => {
    updateDebouncedSearch(searchTerm);
  }, [searchTerm, updateDebouncedSearch]);

  const getRouteForType = (type: string, item: any) => {
    const slug =
      item._id ||
      item.id ||
      item.tmdbId ||
      item.imdbId ||
      item.spotifyId ||
      item.googleBooksId ||
      item.openLibraryId;
    switch (type) {
      case "movie":
        return `/movies/${slug}`;
      case "series":
        return `/series/${slug}`;
      case "book":
        return `/books/${slug}`;
      case "music":
        return `/music/${slug}`;
      case "users":
        return `/profile/${item.id}`;
      default:
        return "#";
    }
  };

  const getPosterUrl = (item: any) => {
    if (!item.poster) return "/placeholder.svg";
    return typeof item.poster === "object" ? item.poster.url : item.poster;
  };

  const fetchResults = async () => {
    if (!debouncedSearchTerm) {
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }
    setLoading(true);

    try {
      if (activeTab === "users") {
        const response: PeopleSearchResponse = await searchPeople({
          searchTerm: debouncedSearchTerm,
          page,
          limit,
        });
        setResults(response.data.data || []);
        setTotalResults(response.data.pagination.totalResults || 0);
        setTotalPages(
          Math.ceil((response.data.pagination.totalPages || 0) / limit)
        );
      } else {
        const contentTypes = activeTab === "all" ? [] : [activeTab];
        const response: GlobalSearchResponse = await globalSearch({
          searchType: "all",
          searchTerm: debouncedSearchTerm,
          page,
          limit,
          contentTypes,
        });

        const searchResults = response.data?.results || {};
        let combinedResults: any[] = [];

        if (activeTab === "all") {
          Object.keys(searchResults).forEach((category) => {
            if (searchResults[category]?.data?.length) {
              combinedResults = [
                ...combinedResults,
                ...searchResults[category].data.map((item: any) => ({
                  ...item,
                  category,
                })),
              ];
            }
          });
        } else {
          combinedResults = searchResults[activeTab]?.data || [];
        }

        setResults(combinedResults);
        setTotalResults(response.data?.pagination?.totalResults || 0);
        setTotalPages(response.data?.pagination?.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [debouncedSearchTerm, activeTab, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateDebouncedSearch(searchTerm);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="p-4 max-w-3xl min-w-[768px] mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-4">
        <Input
          type="text"
          placeholder="Search for movies, series, users, etc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </form>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "outline"}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "flex-1",
              activeTab === tab.value && "bg-primary text-primary-foreground"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((item, index) => (
            <div
              key={`${
                item.id || item.tmdbId || item.googleBooksId || item.spotifyId
              }-${index}`}
              className="flex items-center gap-4 p-2 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() =>
                navigate(
                  getRouteForType(
                    activeTab === "users"
                      ? "users"
                      : item.category || activeTab,
                    item
                  )
                )
              }
            >
              {activeTab === "users" ? (
                <>
                  <Avatar className="h-10 w-10">
                    {item.avatar ? (
                      <AvatarImage
                        src={item.avatar.url || "/placeholder.svg"}
                        alt={item.fullName}
                      />
                    ) : (
                      <AvatarFallback>
                        {item.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {item.fullName || "Unknown User"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {getPosterUrl(item) && (
                    <img
                      src={getPosterUrl(item)}
                      alt={item.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.category || activeTab}{" "}
                      {item.year ? `(${item.year})` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.plot}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No results found.</p>
      )}

      {/* Pagination */}
      {totalResults > 0 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <p>
            Page {page} of {totalPages}
          </p>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
