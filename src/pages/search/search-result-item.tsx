"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Music, Book, Film, Tv, Library } from "lucide-react"
import type { SearchResult } from "./search-page"

interface SearchResultItemProps {
  item: SearchResult
  index: number
  activeTab: string
  imageFailed: boolean
  getPosterUrl: (item: SearchResult) => string
  onImageError: () => void
}

export function SearchResultItem({
  item,
  index,
  activeTab,
  imageFailed,
  getPosterUrl,
  onImageError,
}: SearchResultItemProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "music":
      case "songs":
        return <Music className="h-12 w-8 text-muted-foreground" />
      case "book":
        return <Book className="h-12 w-8 text-muted-foreground" />
      case "movie":
        return <Film className="h-12 w-8 text-muted-foreground" />
      case "series":
        return <Tv className="h-12 w-8 text-muted-foreground" />
      default:
        return <Library className="h-12 w-8 text-muted-foreground" />
    }
  }

  const clipPlot = (plot: string | undefined) => {
    if (!plot) return ""
    return plot.length > 50 ? `${plot.slice(0, 50)}...` : plot
  }

  return (
    <div
      className="flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors w-full box-border overflow-hidden min-h-16"
      role="listitem"
    >
      {activeTab === "users" ? (
        <>
          <Avatar className="h-12 w-12 flex-shrink-0">
            {item.avatar ? (
              <AvatarImage src={item.avatar.url || ""} alt={item.fullName || "User"} />
            ) : (
              <AvatarFallback>{item.fullName?.charAt(0) || "U"}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="font-semibold text-sm line-clamp-2 break-words">{item.fullName || "Unknown User"}</p>
          </div>
        </>
      ) : (
        <>
          {imageFailed || !getPosterUrl(item) ? (
            <div className="h-12 w-8 flex items-center justify-center flex-shrink-0">
              {getCategoryIcon(item.category || activeTab)}
            </div>
          ) : (
            <img
              src={getPosterUrl(item) || "/placeholder.svg"}
              alt={item.title || "Media"}
              className="h-12 w-8 object-cover rounded flex-shrink-0"
              onError={onImageError}
            />
          )}
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="font-semibold text-sm line-clamp-2 break-words">{item.title}</p>
            <p className="text-xs text-muted-foreground truncate break-words">
              {item.category || activeTab} {item.year ? `(${item.year})` : ""}
            </p>
            <p className="text-xs text-muted-foreground truncate break-words">{clipPlot(item.plot)}</p>
          </div>
        </>
      )}
    </div>
  )
}
