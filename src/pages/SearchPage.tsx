import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, setSearchParams } from "react-router-dom";
import { globalSearch, searchPeople } from "@/services/search.service";
import {
  GlobalSearchResponse,
  PeopleSearchResponse,
} from "@/interfaces/search.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Music, Book, Film, Tv, Library } from "lucide-react";
import { motion } from "framer-motion";

// Global box-sizing fix
const globalStyles = `
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

// Define limit as a constant
const LIMIT = 10;

// Debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Tab Content Component
const TabContent = ({
  tab,
  activeTab,
  setActiveTab,
  tabData,
  loading,
  setTabData,
  getPosterUrl,
  getCategoryIcon,
  clipPlot,
  loadMoreRef,
  isMobile,
}) => {
  return (
    <div
      className={cn(
        "w-full min-w-full max-w-full flex-shrink-0 flex flex-col",
        isMobile ? "h-[calc(100vh-120px)] overflow-y-auto" : "min-h-[calc(100vh-120px)]"
      )}
    >
      {/* Tab Button */}
      <div className="mb-4 px-2">
        <Button
          variant={activeTab === tab.value ? "default" : "outline"}
          onClick={() => setActiveTab(tab.value)}
          className={cn(
            "w-full px-4 py-2 text-sm rounded-full",
            activeTab === tab.value
              ? "bg-primary text-primary-foreground border-b-2 border-primary"
              : "bg-background text-foreground hover:bg-accent"
          )}
          aria-current={activeTab === tab.value ? "true" : "false"}
        >
          {tab.label}
        </Button>
      </div>

      {/* Results */}
      <div className="w-full px-2 space-y-2">
        {loading && tabData[tab.value].results.length === 0 ? (
          <div className="flex justify-center items-center py-4 h-full">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="ml-2 text-sm text-muted-foreground">Searching...</p>
          </div>
        ) : tabData[tab.value].results.length > 0 ? (
          <div className="space-y-2">
            {tabData[tab.value].results.map((item, index) => (
              <div
                key={`${item.id || item.tmdbId || item.googleBooksId || item.spotifyId}-${index}`}
                className="flex items-start gap-0.5 p-0.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors w-full box-border overflow-hidden min-h-16"
                role="listitem"
              >
                {tab.value === "users" ? (
                  <>
                    <Avatar className="h-12 w-8 flex-shrink-0">
                      {item.avatar ? (
                        <AvatarImage
                          src={item.avatar.url || ""}
                          alt={item.fullName}
                        />
                      ) : (
                        <AvatarFallback>
                          {item.fullName?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0 overflow-hidden max-w-[calc(100%-40px)]">
                      <p className="font-semibold text-[11px] line-clamp-2 break-words">
                        {item.fullName || "Unknown User"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {tabData[tab.value].imageFailed[index] || !getPosterUrl(item) ? (
                      <div className="h-12 w-8 flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(item.category || tab.value)}
                      </div>
                    ) : (
                      <img
                        src={getPosterUrl(item)}
                        alt={item.title}
                        className="h-12 w-8 object-cover rounded flex-shrink-0"
                        onError={() => {
                          setTabData((prev) => {
                            const newData = { ...prev };
                            const newFailed = [...newData[tab.value].imageFailed];
                            newFailed[index] = true;
                            newData[tab.value].imageFailed = newFailed;
                            return newData;
                          });
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0 overflow-hidden max-w-[calc(100%-40px)]">
                      <p className="font-semibold text-[11px] line-clamp-2 break-words">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate break-words">
                        {item.category || tab.value}{" "}
                        {item.year ? `(${item.year})` : ""}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate break-words">
                        {clipPlot(item.plot)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="ml-2 text-sm text-muted-foreground">Loading more...</p>
              </div>
            )}
            <div ref={loadMoreRef} className="h-1"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-center text-sm">
              {tab.value === "all" && !tabData.hasSearched
                ? "Please search to see results."
                : "No results found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Component
const MobileSearchView = ({
  tabs,
  activeTab,
  setActiveTab,
  tabData,
  loading,
  setTabData,
  fetchResults,
  getPosterUrl,
  getCategoryIcon,
  clipPlot,
  loadMoreRef,
}) => {
  const activeTabIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const activeTabData = tabs[activeTabIndex];

  const handleSwipe = (offset: number) => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const swipeThreshold = 50;
    if (offset < -swipeThreshold && currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1].value;
      setActiveTab(nextTab);
    } else if (offset > swipeThreshold && currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1].value;
      setActiveTab(prevTab);
    }
  };

  return (
    <div className="relative">
      {/* Swipe Overlay */}
      <motion.div
        className="absolute inset-0 z-10"
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset }) => handleSwipe(offset.x)}
      />

      {/* Render Only the Active Tab */}
      <motion.div
        key={activeTab} // Force re-render on tab change
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <TabContent
          tab={activeTabData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabData={tabData}
          loading={loading}
          setTabData={setTabData}
          getPosterUrl={getPosterUrl}
          getCategoryIcon={getCategoryIcon}
          clipPlot={clipPlot}
          loadMoreRef={loadMoreRef}
          isMobile={true}
        />
      </motion.div>

      {/* Tab Indicators - Fixed at Bottom */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-1 z-20">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={cn(
              "w-2 h-2 rounded-full",
              activeTab === tab.value ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// Desktop Component
const DesktopSearchView = ({
  tabs,
  activeTab,
  setActiveTab,
  tabData,
  loading,
  setTabData,
  fetchResults,
  getPosterUrl,
  getCategoryIcon,
  clipPlot,
  loadMoreRef,
}) => {
  return (
    <div>
      {/* Tabs */}
      <div className="mb-4 w-full max-w-[100%] overflow-x-hidden">
        <div className="flex flex-row gap-2 overflow-x-auto snap-x snap-mandatory whitespace-nowrap w-full max-w-[100%]">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "outline"}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "snap-center px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 text-xs sm:text-xs md:text-sm lg:text-base rounded-full min-w-[40px] sm:min-w-[50px] lg:min-w-[60px] flex-shrink-0 box-border",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground border-b-2 border-primary sm:border-b-0"
                  : "bg-background text-foreground hover:bg-accent"
              )}
              aria-current={activeTab === tab.value ? "true" : "false"}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <motion.div
        key={activeTab} // Force re-render on tab change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabContent
          tab={tabs.find((tab) => tab.value === activeTab)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabData={tabData}
          loading={loading}
          setTabData={setTabData}
          getPosterUrl={getPosterUrl}
          getCategoryIcon={getCategoryIcon}
          clipPlot={clipPlot}
          loadMoreRef={loadMoreRef}
          isMobile={false}
        />
      </motion.div>
    </div>
  );
};

// Parent Component
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("q") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [tabData, setTabData] = useState<{
    [key: string]: {
      results: any[];
      totalResults: number;
      totalPages: number;
      hasMore: boolean;
      page: number;
      imageFailed: boolean[];
    };
  }>({
    all: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    users: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    movie: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    series: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    music: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    book: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Users", value: "users" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Music", value: "music" },
    { label: "Books", value: "book" },
  ];

  // Handle resize to determine mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debounce search term update
  const updateDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
      setHasSearched(true);
      setTabData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((key) => {
          newData[key] = {
            results: [],
            totalResults: 0,
            totalPages: 0,
            hasMore: true,
            page: 1,
            imageFailed: [],
          };
        });
        return newData;
      });
      setSearchParams({ q: value });
    }, 800),
    [setSearchParams]
  );

  useEffect(() => {
    updateDebouncedSearch(searchTerm);
  }, [searchTerm, updateDebouncedSearch]);

  const getPosterUrl = (item: any): string => {
    if (item.coverImage) {
      return typeof item.coverImage === "object" ? item.coverImage.url : item.coverImage;
    }
    if (item.poster) {
      return typeof item.poster === "object" ? item.poster.url : item.poster;
    }
    return "";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "music":
      case "songs":
        return <Music className="h-12 w-8 sm:h-12 sm:w-12 lg:h-12 lg:w-12 text-muted-foreground" />;
      case "book":
        return <Book className="h-12 w-8 sm:h-12 sm:w-12 lg:h-12 lg:w-12 text-muted-foreground" />;
      case "movie":
        return <Film className="h-12 w-8 sm:h-12 sm:w-12 lg:h-12 lg:w-12 text-muted-foreground" />;
      case "series":
        return <Tv className="h-12 w-8 sm:h-12 sm:w-12 lg:h-12 lg:w-12 text-muted-foreground" />;
      default:
        return <Library className="h-12 w-8 sm:h-12 sm:w-12 lg:h-12 lg:w-12 text-muted-foreground" />;
    }
  };

  const clipPlot = (plot: string) => {
    if (!plot) return "";
    return plot.length > 50 ? `${plot.slice(0, 50)}...` : plot;
  };

  const fetchResults = async (tab: string, currentPage: number, append: boolean = false) => {
    if (!debouncedSearchTerm) {
      setTabData((prev) => ({
        ...prev,
        [tab]: { results: [], totalResults: 0, totalPages: 0, hasMore: false, page: 1, imageFailed: [] },
      }));
      return;
    }
    setLoading(true);

    try {
      if (tab === "users") {
        const response: PeopleSearchResponse = await searchPeople({
          searchTerm: debouncedSearchTerm,
          page: currentPage,
          limit: LIMIT,
        });
        const newResults = response.data.data || [];
        setTabData((prev) => ({
          ...prev,
          [tab]: {
            results: append ? [...prev[tab].results, ...newResults] : newResults,
            totalResults: response.data.pagination.totalResults || 0,
            totalPages: Math.ceil((response.data.pagination.totalResults || 0) / LIMIT),
            hasMore: newResults.length > 0 && currentPage < Math.ceil((response.data.pagination.totalResults || 0) / LIMIT),
            page: currentPage,
            imageFailed: append ? [...prev[tab].imageFailed, ...Array(newResults.length).fill(false)] : Array(newResults.length).fill(false),
          },
        }));
      } else {
        const contentTypes = tab === "all" ? [] : [tab];
        const response: GlobalSearchResponse = await globalSearch({
          searchType: "all",
          searchTerm: debouncedSearchTerm,
          page: currentPage,
          limit: LIMIT,
          contentTypes,
        });

        const searchResults = response.data?.results || {};
        let combinedResults: any[] = [];

        if (tab === "all") {
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
          combinedResults = searchResults[tab]?.data || [];
        }

        setTabData((prev) => ({
          ...prev,
          [tab]: {
            results: append ? [...prev[tab].results, ...combinedResults] : combinedResults,
            totalResults: response.data?.pagination?.totalResults || 0,
            totalPages: response.data?.pagination?.totalPages || 0,
            hasMore: combinedResults.length > 0 && currentPage < (response.data?.pagination?.totalPages || 0),
            page: currentPage,
            imageFailed: append ? [...prev[tab].imageFailed, ...Array(combinedResults.length).fill(false)] : Array(combinedResults.length).fill(false),
          },
        }));
      }
    } catch (err) {
      console.error(err);
      setTabData((prev) => ({
        ...prev,
        [tab]: {
          results: append ? prev[tab].results : [],
          totalResults: 0,
          totalPages: 0,
          hasMore: false,
          page: currentPage,
          imageFailed: append ? prev[tab].imageFailed : [],
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch results on tab switch or search term change
  useEffect(() => {
    if (debouncedSearchTerm && (activeTab !== "all" || hasSearched)) {
      fetchResults(activeTab, 1, false);
    }
  }, [debouncedSearchTerm, activeTab, hasSearched]);

  // Infinite scroll
  useEffect(() => {
    if (loading || !tabData[activeTab].hasMore || !loadMoreRef.current) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        const nextPage = tabData[activeTab].page + 1;
        fetchResults(activeTab, nextPage, true);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current && observer.current) {
        observer.current.unobserve(loadMoreRef.current);
      }
    };
  }, [loading, activeTab, tabData, loadMoreRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateDebouncedSearch(searchTerm);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="relative px-2 py-0 sm:p-2 md:p-3 lg:p-4 w-full max-w-[100%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto overflow-x-hidden">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-4 w-full max-w-[100%] overflow-x-hidden">
          <Input
            type="text"
            placeholder="Search for movies, series, users, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-[100%] text-xs sm:text-sm md:text-base box-border px-0.5 sm:px-3 lg:px-4 appearance-none"
            aria-label="Search for movies, series, users, etc"
          />
        </form>

        {/* Conditional Rendering Based on Screen Size */}
        {isMobile ? (
          <MobileSearchView
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabData={{ ...tabData, hasSearched }}
            loading={loading}
            setTabData={setTabData}
            fetchResults={fetchResults}
            getPosterUrl={getPosterUrl}
            getCategoryIcon={getCategoryIcon}
            clipPlot={clipPlot}
            loadMoreRef={loadMoreRef}
          />
        ) : (
          <DesktopSearchView
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabData={{ ...tabData, hasSearched }}
            loading={loading}
            setTabData={setTabData}
            fetchResults={fetchResults}
            getPosterUrl={getPosterUrl}
            getCategoryIcon={getCategoryIcon}
            clipPlot={clipPlot}
            loadMoreRef={loadMoreRef}
          />
        )}
      </div>
    </>
  );
};

export default SearchPage;