"use client"

import { useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clapperboard, Film, Music, Share2, Tv, Youtube } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { StatusDropdown } from "@/components/ui/status-dropdown"
import { toast } from "@/services/toast.service"
import { updateContentStatus } from "@/services/contentList.service"

interface ContentItem {
  id: string
  userContentId: string
  contentId: string
  title: string
  type: string
  imageUrl?: string
  year?: string
  creator?: string
  description?: string
  suggestedBy: {
    id: string
    name: string
    avatar?: string
  }
  addedAt: string
  status: "WantToConsume" | "Consuming" | "Consumed" | "NotInterested" | null
  whereToWatch?: string[]
  whereToRead?: string[]
  whereToListen?: string[]
}

interface MyWatchListCardProps {
  item: ContentItem
}

function MyWatchListCard({ item }: MyWatchListCardProps) {
  const navigate = useNavigate()
  const [status, setStatus] = useState(item.status)
  const [loading, setLoading] = useState({
    consumed: false,
    consuming: false,
    wantToConsume: false,
    notInterested: false,
  })

  const getIconForType = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      case "series":
        return <Clapperboard className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      case "book":
        return <BookOpen className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      case "anime":
        return <Tv className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      case "music":
      case "song":
        return <Music className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      case "youtube":
        return <Youtube className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
      default:
        return <Film className="h-3 w-3 min-[470px]:h-4 min-[470px]:w-4" />
    }
  }

  const getRouteForType = (type: string, id: string) => {
    switch (type) {
      case "movie":
        return `/movies/${id}`
      case "series":
        return `/series/${id}`
      case "book":
        return `/books/${id}`
      case "music":
      case "song":
        return `/music/${id}`
      case "video":
        return `/videos/${id}`
      case "people":
        return `/people/${id}`
      case "users":
        return `/profile/${id}`
      default:
        return "#"
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!item.userContentId) {
      toast.error("User content ID is missing!")
      return
    }

    setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: true }))
    try {
      const response = await updateContentStatus(item.userContentId, { status: newStatus })
      if (response.success) {
        setStatus(newStatus as any)
        toast.success("Status updated successfully!")
      } else {
        toast.error("Failed to update status!")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Something went wrong!")
    } finally {
      setLoading((prev) => ({ ...prev, [newStatus.toLowerCase()]: false }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="h-full w-full"
    >
      <Card className="overflow-hidden max-w-[calc(100vw-35px)] shadow-sm hover:shadow-md transition-all duration-200 border border-border/50 bg-card h-full flex flex-col relative">
        <CardContent className="p-1.5 min-[470px]:p-3 sm:p-4 flex flex-col h-full">
          {/* Status dropdown - positioned to avoid overlap */}
          <div className="absolute top-1 right-1 min-[470px]:top-2 min-[470px]:right-2 z-10">
            <StatusDropdown
              currentStatus={status}
              contentType={item.type}
              onStatusChange={handleStatusUpdate}
              loading={loading}
              size="sm"
            />
          </div>

          {/* Ultra-compact layout for < 470px, horizontal layout for >= 470px */}
          <div className="flex gap-2 min-[470px]:gap-3 mb-1 min-[470px]:mb-2">
            {/* Image */}
            <div
              className={cn(
                "relative overflow-hidden rounded-lg cursor-pointer flex-shrink-0 bg-muted",
                item.type === "music" || item.type === "song"
                  ? "w-10 h-10 min-[470px]:w-16 min-[470px]:h-16 sm:w-20 sm:h-20"
                  : "w-10 h-12 min-[470px]:w-16 min-[470px]:h-24 sm:w-20 sm:h-30",
              )}
              onClick={() => navigate(getRouteForType(item.type, item.contentId || item.id))}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  {getIconForType(item.type)}
                </div>
              )}
            </div>

            {/* Content metadata */}
            <div className="flex-1 min-w-0 pr-4 min-[470px]:pr-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 min-[470px]:gap-2 mb-0.5 min-[470px]:mb-1 flex-wrap">
                  <div className="bg-primary/10 dark:bg-primary/20 p-0.5 min-[470px]:p-1 rounded-full">
                    {getIconForType(item.type)}
                  </div>
                  <span className="text-xs font-medium text-primary capitalize">{item.type}</span>
                  <span className="text-xs text-muted-foreground">{item.year || "N/A"}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-0.5 min-[470px]:mb-1">
                  {new Date(item.addedAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Title and creator */}
          <div className="mb-1 min-[470px]:mb-2">
            <h3
              className="font-semibold text-xs min-[470px]:text-sm sm:text-base line-clamp-2 text-foreground cursor-pointer break-words mb-0.5 min-[470px]:mb-1"
              onClick={() => navigate(getRouteForType(item.type, item.contentId))}
            >
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 break-words">{item.creator || "Unknown"}</p>
          </div>

          {/* Description - Fixed height container */}
          <div className="mb-1 min-[470px]:mb-3 h-[24px] min-[470px]:h-[48px] overflow-hidden max-w-full">
            <p
              className="text-xs line-clamp-2 min-[470px]:line-clamp-3 text-foreground break-words"
              dangerouslySetInnerHTML={{
                __html: item.description || "No description available.",
              }}
            />
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-grow"></div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 min-[470px]:pt-2 border-t border-border">
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex items-center min-w-0">
                <Avatar className="h-2.5 w-2.5 min-[470px]:h-4 min-[470px]:w-4 mr-1 min-[470px]:mr-1.5 ring-1 ring-primary/20 flex-shrink-0">
                  <AvatarImage src={item?.suggestedBy?.avatar || "/placeholder.svg"} alt={item?.suggestedBy?.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-800 text-xs">
                    {item?.suggestedBy?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground truncate">{item?.suggestedBy?.name}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-0.5 min-[470px]:p-1.5 h-auto flex-shrink-0"
              onClick={() => toast.success("Share link copied!")}
            >
              <Share2 className="h-2.5 w-2.5 min-[470px]:h-4 min-[470px]:w-4 text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MyWatchListCard
