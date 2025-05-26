"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchInput } from "./search-input";
import { SearchTabs } from "./search-tabs";
import { SearchResults } from "./search-results";
import { globalSearch, searchPeople } from "@/services/search.service";
import type {
  GlobalSearchResponse,
  PeopleSearchResponse,
  SearchResultItem,
  SearchResultsType,
  UserItem,
} from "@/interfaces/search.interface";
import { useMobile } from "@/lib/use-mobile";
import { useInfiniteScroll } from "@/lib/use-infinite-scroll";
import { m } from "framer-motion";
import { set } from "date-fns";
import { setResults } from "@/utils/searchHelper";
import { debounce } from "lodash";
const LIMIT = 10;
const DEBOUNCE_DELAY = 300;

export type TabType = {
  label: string;
  value: string;
};

export type TabDataType = {
  results: SearchResultItem[];
  totalResults: number;
  totalPages: number;
  hasMore: boolean;
  page: number;
  imageFailed: boolean[];
  hasSearched: boolean;
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMobile();

  // Simplified refs
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const tabs: TabType[] = [
    { label: "All", value: "all" },
    { label: "Users", value: "users" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Music", value: "music" },
    { label: "Books", value: "book" },
  ];

  // Simplified state
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("q") || ""
  );
  const [activeTab, setActiveTab] = useState<string>(() => {
    const tabFromUrl = searchParams.get("tab");
    return tabs.find((tab) => tab.value === tabFromUrl) ? tabFromUrl! : "all";
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultsType>({
    movie: { results: [], totalResults: 0 },
    series: { results: [], totalResults: 0 },
    book: { results: [], totalResults: 0 },
    music: { results: [], totalResults: 0 },
    songs: { results: [], totalResults: 0 },
    album: { results: [], totalResults: 0 },
    video: { results: [], totalResults: 0 },
    people: { results: [], totalResults: 0 },
    user: { results: [], totalResults: 0 },
    searchTerm: searchTerm,
  });

  const [tabData, setTabData] = useState<{ [key: string]: TabDataType }>(() => {
    const initialData: { [key: string]: TabDataType } = {};
    tabs.forEach((tab) => {
      initialData[tab.value] = {
        results: [],
        totalResults: 0,
        totalPages: 0,
        hasMore: true,
        page: 1,
        imageFailed: [],
        hasSearched: false,
      };
    });
    return initialData;
  });

  // Update URL params
  const updateUrlParams = useCallback(
    (searchValue?: string, tabValue?: string) => {
      const newParams = new URLSearchParams();
      const searchToUse = searchValue !== undefined ? searchValue : searchTerm;
      const tabToUse = tabValue !== undefined ? tabValue : activeTab;

      if (searchToUse?.trim()) {
        newParams.set("q", searchToUse.trim());
      }
      if (tabToUse && tabToUse !== "all") {
        newParams.set("tab", tabToUse);
      }

      setSearchParams(newParams);
    },
    [searchTerm, activeTab, setSearchParams]
  );

  // Cancel ongoing requests
  const cancelRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Clear debounce
  const clearDebounce = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);
  const searchGlobal = useCallback(
    async (searchValue: string, tab: string, page = 1, append = false) => {
      let globalSearchResponse: GlobalSearchResponse;
      let peopleSearchResponse: PeopleSearchResponse;
      if(!searchValue.trim()) return;
      await globalSearch({
        searchTerm: searchValue,
        searchType: "all",
        page: page,
      }).then((res: GlobalSearchResponse) => {
        if (res.success) {
          globalSearchResponse = res;
        }
      });
      await searchPeople({ searchTerm: searchValue, page: page }).then(
        (res: PeopleSearchResponse) => {
          if (res.success) {
            peopleSearchResponse = res;
          }
        }
      );
      try{
        setResults({
        setSearchResults,
        peopleSearchResponse,
        globalSearchResponse,
        searchValue,
      });
      }catch(e){
        console.error("Error setting search results:", e);
      }
      console.log("Search results updated:", searchResults);
    },
    [searchTerm, activeTab, setSearchResults] // Removed unused dependencies
  );
  // Perform search for a specific tab
  const performSearch = useCallback(
    async (searchValue: string, tab: string, page = 1, append = false) => {
      if (!searchValue.trim()) {
        // Clear all results when search is empty
        setTabData((prev) => {
          const newData = { ...prev };
          Object.keys(newData).forEach((key) => {
            newData[key] = {
              results: [],
              totalResults: 0,
              totalPages: 0,
              hasMore: false,
              page: 1,
              imageFailed: [],
              hasSearched: false,
            };
          });
          return newData;
        });
        setLoading(false);
        return;
      }

      // Cancel previous requests
      cancelRequests();

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setError(null);

      try {
        let response: GlobalSearchResponse | PeopleSearchResponse;
        let newResults: SearchResultItem[] = [];

        if (tab === "users") {
          response = await searchPeople({
            searchTerm: searchValue,
            page,
            limit: LIMIT,
          });

          if (signal.aborted) return;

          newResults = (response as PeopleSearchResponse).data.data || [];
        } else {
          const contentTypes = tab === "all" ? [] : [tab];
          response = await globalSearch({
            searchType: "all",
            searchTerm: searchValue,
            page,
            limit: LIMIT,
            contentTypes,
          });

          if (signal.aborted) return;

          const searchResults =
            (response as GlobalSearchResponse).data?.results || {};

          if (tab === "all") {
            // Combine all results for "all" tab, prioritizing order
            const categoryOrder = [
              "movie",
              "series",
              "music",
              "songs",
              "book",
              "album",
              "video",
              "people",
            ];

            categoryOrder.forEach((category) => {
              if (searchResults[category]?.data?.length) {
                const categoryResults = searchResults[category].data.map(
                  (item: any) => ({
                    ...item,
                    category,
                  })
                );
                newResults = [...newResults, ...categoryResults];
              }
            });
          } else {
            // Get results for specific category
            const categoryKey = tab;

            // Handle special cases
            if (tab === "music") {
              // For music tab, combine both music and songs
              const musicResults = searchResults["music"]?.data || [];
              const songResults = searchResults["songs"]?.data || [];

              newResults = [
                ...musicResults.map((item: any) => ({
                  ...item,
                  category: "music",
                })),
                ...songResults.map((item: any) => ({
                  ...item,
                  category: "songs",
                })),
              ];
            } else {
              newResults = searchResults[categoryKey]?.data || [];

              // Add category to each result if not present
              newResults = newResults.map((item: any) => ({
                ...item,
                category: item.category || tab,
              }));
            }
          }
        }

        if (signal.aborted) return;

        // Update tab data immediately
        setTabData((prev) => {
          const newData = { ...prev };
          const currentTabData = newData[tab];

          let totalResults = 0;
          let totalPages = 0;

          if (tab === "users") {
            const userResponse = response as PeopleSearchResponse;
            totalResults = userResponse.data.pagination.totalResults || 0;
            totalPages = Math.ceil(totalResults / LIMIT);
          } else if (tab === "all") {
            const globalResponse = response as GlobalSearchResponse;
            totalResults = globalResponse.data?.pagination?.totalResults || 0;
            totalPages = globalResponse.data?.pagination?.totalPages || 0;
          } else {
            const globalResponse = response as GlobalSearchResponse;

            if (tab === "music") {
              // For music tab, combine totals from both music and songs
              const musicTotal =
                globalResponse.data?.results?.["music"]?.total || 0;
              const songsTotal =
                globalResponse.data?.results?.["songs"]?.total || 0;
              totalResults = musicTotal + songsTotal;
            } else {
              totalResults = globalResponse.data?.results?.[tab]?.total || 0;
            }

            totalPages = Math.ceil(totalResults / LIMIT);
          }

          newData[tab] = {
            results: append
              ? [...(currentTabData.results || []), ...newResults]
              : newResults,
            totalResults,
            totalPages,
            hasMore: newResults.length > 0 && page < totalPages,
            page,
            imageFailed: append
              ? [
                  ...(currentTabData.imageFailed || []),
                  ...Array(newResults.length).fill(false),
                ]
              : Array(newResults.length).fill(false),
            hasSearched: true,
          };

          return newData;
        });
      } catch (err: any) {
        if (err.name === "AbortError" || signal.aborted) {
          return;
        }

        console.error("Search error:", err);
        setError("An error occurred while fetching results. Please try again.");

        // Update tab with error state
        setTabData((prev) => {
          const newData = { ...prev };
          newData[tab] = {
            results: append ? prev[tab].results || [] : [],
            totalResults: 0,
            totalPages: 0,
            hasMore: false,
            page,
            imageFailed: append ? prev[tab].imageFailed || [] : [],
            hasSearched: true,
          };
          return newData;
        });
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [cancelRequests]
  );

  // Search all tabs
  const searchAllTabs = useCallback(
    (searchValue: string) => {
      if (!searchValue.trim()) {
        performSearch(searchValue, activeTab);
        return;
      }

      // Search all tabs simultaneously
      tabs.forEach((tab) => {
        performSearch(searchValue, tab.value, 1, false);
      });
    },
    [performSearch, activeTab, tabs]
  );
  useEffect(() => {
    
      searchGlobal(searchTerm, activeTab, 1);
    
  }, [searchTerm]);
  // Debounced search
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      clearDebounce();
      cancelRequests();

      updateUrlParams(searchValue);

      if (!searchValue.trim()) {
        searchAllTabs(searchValue);
        return;
      }

      debounceTimeoutRef.current = setTimeout(() => {
        searchAllTabs(searchValue);
      }, DEBOUNCE_DELAY);
    },
    [clearDebounce, cancelRequests, updateUrlParams, searchAllTabs]
  );

  // Handle search term change
  const handleSearchTermChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Handle tab change
  const handleTabChange = useCallback(
    (newTab: string) => {
      setActiveTab(newTab);
      updateUrlParams(undefined, newTab);
    },
    [updateUrlParams]
  );

  // Initialize from URL on mount
  useEffect(() => {
    const initialSearchTerm = searchParams.get("q") || "";
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      debouncedSearch(initialSearchTerm);
    }
  }, []); // Only run on mount

  // Load more results
  const loadMore = useCallback(() => {
    const currentTabData = tabData[activeTab];
    if (!loading && currentTabData?.hasMore && searchTerm.trim()) {
      const nextPage = (currentTabData.page || 0) + 1;
      performSearch(searchTerm, activeTab, nextPage, true);
      searchGlobal(searchTerm, activeTab, nextPage, true);
    }
  }, [loading, activeTab, tabData, searchTerm, performSearch]);

  const { observerRef } = useInfiniteScroll(loadMore);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchTerm);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearDebounce();
      cancelRequests();
    };
  }, [clearDebounce, cancelRequests]);

  const isSearchEmpty = !searchTerm.trim();
  const hasSearched = tabData[activeTab]?.hasSearched || false;

  return (
    <div className="relative px-2 py-0 sm:p-2 md:p-3 lg:p-4 w-full max-w-[100%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto overflow-x-hidden">
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
        handleSearch={handleSearch}
      />

      {isMobile ? (
        <SearchTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMobile={isMobile}
          tabData={tabData}
          setTabData={setTabData}
          loading={loading}
          hasSearched={hasSearched}
          observerRef={observerRef}
          error={error}
          isSearchEmpty={isSearchEmpty}
        />
      ) : (
        <>
          <SearchTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            isMobile={isMobile}
          />
          <SearchResults
            activeTab={activeTab}
            tabData={tabData}
            setTabData={setTabData}
            loading={loading}
            hasSearched={hasSearched}
            observerRef={observerRef}
            isMobile={isMobile}
            error={error}
          />
        </>
      )}
    </div>
  );
}
