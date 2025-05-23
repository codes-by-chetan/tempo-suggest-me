"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { SearchInput } from "./search-input"
import { SearchTabs } from "./search-tabs"
import { SearchResults } from "./search-results"
import { globalSearch, searchPeople } from "@/services/search.service"
import type { GlobalSearchResponse, PeopleSearchResponse } from "@/interfaces/search.interface"
import { useSearchParams } from "react-router-dom"
import { useMobile } from "@/lib/use-mobile"
import { useInfiniteScroll } from "@/lib/use-infinite-scroll"

// Define limit as a constant
const LIMIT = 10

export type TabType = {
  label: string
  value: string
}

export type TabDataType = {
  results: any[]
  totalResults: number
  totalPages: number
  hasMore: boolean
  page: number
  imageFailed: boolean[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const isMobile = useMobile()

  const [searchTerm, setSearchTerm] = useState<string>(searchParams["q"] || "")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [tabData, setTabData] = useState<{
    [key: string]: TabDataType
  }>({
    all: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    users: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    movie: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    series: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    music: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
    book: { results: [], totalResults: 0, totalPages: 0, hasMore: true, page: 1, imageFailed: [] },
  })

  const tabs: TabType[] = [
    { label: "All", value: "all" },
    { label: "Users", value: "users" },
    { label: "Movies", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Music", value: "music" },
    { label: "Books", value: "book" },
  ]

  // Debounce search term update
  const updateDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
      setHasSearched(true)
      setTabData((prev) => {
        const newData = { ...prev }
        Object.keys(newData).forEach((key) => {
          newData[key] = {
            results: [],
            totalResults: 0,
            totalPages: 0,
            hasMore: true,
            page: 1,
            imageFailed: [],
          }
        })
        return newData
      })
      // Update URL query parameter
      const url = new URL(window.location.href)
      url.searchParams.set("q", value)
      window.history.pushState({}, "", url)
    }, 800),
    [],
  )

  useEffect(() => {
    updateDebouncedSearch(searchTerm)
  }, [searchTerm, updateDebouncedSearch])

  const fetchResults = async (tab: string, currentPage: number, append = false) => {
    if (!debouncedSearchTerm) {
      setTabData((prev) => ({
        ...prev,
        [tab]: { results: [], totalResults: 0, totalPages: 0, hasMore: false, page: 1, imageFailed: [] },
      }))
      return
    }

    setLoading(true)

    try {
      if (tab === "users") {
        // Fetch user search results
        const response: PeopleSearchResponse = await searchPeople({
          searchTerm: debouncedSearchTerm,
          page: currentPage,
          limit: LIMIT,
        })

        const newResults = response.data.data || []

        setTabData((prev) => ({
          ...prev,
          [tab]: {
            results: append ? [...prev[tab].results, ...newResults] : newResults,
            totalResults: response.data.pagination.totalResults || 0,
            totalPages: Math.ceil((response.data.pagination.totalResults || 0) / LIMIT),
            hasMore:
              newResults.length > 0 && currentPage < Math.ceil((response.data.pagination.totalResults || 0) / LIMIT),
            page: currentPage,
            imageFailed: append
              ? [...prev[tab].imageFailed, ...Array(newResults.length).fill(false)]
              : Array(newResults.length).fill(false),
          },
        }))
      } else {
        // Fetch global search results
        const contentTypes = tab === "all" ? [] : [tab]

        const response: GlobalSearchResponse = await globalSearch({
          searchType: "all",
          searchTerm: debouncedSearchTerm,
          page: currentPage,
          limit: LIMIT,
          contentTypes,
        })

        const searchResults = response.data?.results || {}
        let combinedResults: any[] = []

        if (tab === "all") {
          Object.keys(searchResults).forEach((category) => {
            if (searchResults[category]?.data?.length) {
              combinedResults = [
                ...combinedResults,
                ...searchResults[category].data.map((item: any) => ({
                  ...item,
                  category,
                })),
              ]
            }
          })
        } else {
          combinedResults = searchResults[tab]?.data || []
        }

        setTabData((prev) => ({
          ...prev,
          [tab]: {
            results: append ? [...prev[tab].results, ...combinedResults] : combinedResults,
            totalResults: response.data?.pagination?.totalResults || 0,
            totalPages: response.data?.pagination?.totalPages || 0,
            hasMore: combinedResults.length > 0 && currentPage < (response.data?.pagination?.totalPages || 0),
            page: currentPage,
            imageFailed: append
              ? [...prev[tab].imageFailed, ...Array(combinedResults.length).fill(false)]
              : Array(combinedResults.length).fill(false),
          },
        }))
      }
    } catch (err) {
      console.error(err)
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
      }))
    } finally {
      setLoading(false)
    }
  }

  // Fetch results on tab switch or search term change
  useEffect(() => {
    if (debouncedSearchTerm && (activeTab !== "all" || hasSearched)) {
      fetchResults(activeTab, 1, false)
    }
  }, [debouncedSearchTerm, activeTab, hasSearched])

  // Setup infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && tabData[activeTab].hasMore) {
      const nextPage = tabData[activeTab].page + 1
      fetchResults(activeTab, nextPage, true)
    }
  }, [loading, activeTab, tabData])

  const { observerRef } = useInfiniteScroll(loadMore)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateDebouncedSearch(searchTerm)
  }

  return (
    <div className="relative px-2 py-0 sm:p-2 md:p-3 lg:p-4 w-full max-w-[100%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto overflow-x-hidden">
      {/* Search Input */}
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {/* Tabs and Results */}
      <SearchTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />

      <SearchResults
        activeTab={activeTab}
        tabData={tabData}
        setTabData={setTabData}
        loading={loading}
        hasSearched={hasSearched}
        observerRef={observerRef}
        isMobile={isMobile}
      />
    </div>
  )
}

// Debounce function
function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
