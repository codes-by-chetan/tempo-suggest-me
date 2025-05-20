"use client"

import { useState, useEffect, useRef } from "react"
import { CustomTabsList } from "@/components/layout/CustomTabsList"
import SuggestedToMeCard from "@/components/layout/SuggestedToMeCard"
import { getSuggestedToYou } from "@/services/suggestion.service"
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react"
import CommentBox from "@/components/reusables/CommentBox"


interface ContentItem {
  id: string
  contentId?: string
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
  suggestedAt: string
  status?:
    | "watched"
    | "watching"
    | "watchlist"
    | "finished"
    | "reading"
    | "listened"
    | "listening"
    | "readlist"
    | "listenlist"
    | null
  whereToWatch?: string[]
  whereToRead?: string[]
  whereToListen?: string[]
}

interface Position {
  top: number
  left: number
}

const SuggestedToMe = () => {
  const mockSuggestions: ContentItem[] = [
    {
      id: "1",
      title: "The Shawshank Redemption",
      type: "movie",
      imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
      year: "1994",
      creator: "Frank Darabont",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      suggestedBy: {
        id: "1",
        name: "Emma Watson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      suggestedAt: "2023-06-15T14:30:00Z",
      whereToWatch: ["Netflix", "Amazon Prime", "HBO Max"],
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      type: "book",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
      year: "1960",
      creator: "Harper Lee",
      description:
        "The story of racial injustice and the loss of innocence in the American South during the Great Depression.",
      suggestedBy: {
        id: "2",
        name: "John Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
      suggestedAt: "2023-06-10T09:15:00Z",
      whereToRead: ["Amazon", "Barnes & Noble", "Local Library"],
    },
    {
      id: "3",
      title: "Attack on Titan",
      type: "anime",
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80",
      year: "2013",
      creator: "Hajime Isayama",
      description:
        "In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
      suggestedBy: {
        id: "3",
        name: "Sophia Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      },
      suggestedAt: "2023-06-05T16:45:00Z",
      whereToWatch: ["Crunchyroll", "Funimation", "Netflix"],
    },
    {
      id: "4",
      title: "Bohemian Rhapsody",
      type: "song",
      imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
      year: "1975",
      creator: "Queen",
      description:
        "A six-minute suite, consisting of several sections without a chorus: an intro, a ballad segment, an operatic passage, a hard rock part and a reflective coda.",
      suggestedBy: {
        id: "4",
        name: "Michael Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      suggestedAt: "2023-06-01T11:20:00Z",
      whereToListen: ["Spotify", "Apple Music", "YouTube Music"],
    },
  ]

  const [activeTab, setActiveTab] = useState("all")
  const [suggestions, setSuggestions] = useState<ContentItem[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Global state for shared emoji picker and comment box
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<Position>({ top: 0, left: 0 })
  const [commentBoxPosition, setCommentBoxPosition] = useState<Position>({ top: 0, left: 0 })
  const [cardReactions, setCardReactions] = useState<Record<string, string[]>>({})

  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const commentBoxRef = useRef<HTMLDivElement>(null)

  // Filter suggestions when tab or suggestions change
  useEffect(() => {
    setFilteredSuggestions(activeTab === "all" ? suggestions : suggestions.filter((item) => item.type === activeTab))
  }, [activeTab, suggestions])

  // Fetch suggestions on component mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const res = await getSuggestedToYou()
        if (res.success) {
          setSuggestions(res.data)
        } else {
          setSuggestions(mockSuggestions)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions(mockSuggestions)
      } finally {
        // Add a small delay to make the loading state more noticeable for better UX
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    fetchSuggestions()
  }, [])

  // Close emoji picker and comment box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }

      if (showCommentBox && commentBoxRef.current && !commentBoxRef.current.contains(event.target as Node)) {
        setShowCommentBox(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEmojiPicker, showCommentBox])

  const handleMarkAsWatched = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificWatchedStatus(item.type) as ContentItem["status"]
          return { ...item, status }
        }
        return item
      }),
    )
  }

  const handleMarkAsWatching = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificWatchingStatus(item.type) as ContentItem["status"]
          return { ...item, status }
        }
        return item
      }),
    )
  }

  const handleAddToWatchlist = (id: string) => {
    setSuggestions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const status = getContentSpecificListStatus(item.type) as ContentItem["status"]
          return { ...item, status }
        }
        return item
      }),
    )
  }

  const getContentSpecificListStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "readlist"
      case "song":
        return "listenlist"
      default:
        return "watchlist"
    }
  }

  const getContentSpecificWatchedStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "finished"
      case "song":
        return "listened"
      default:
        return "watched"
    }
  }

  const getContentSpecificWatchingStatus = (type: string): string => {
    switch (type) {
      case "book":
        return "reading"
      case "song":
        return "listening"
      default:
        return "watching"
    }
  }

  // Handle emoji picker toggle
  const handleToggleEmojiPicker = (cardId: string, position: Position) => {
    setActiveCardId(cardId)

    // Calculate position to ensure it's visible on screen
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Adjust top position to ensure it's visible
    let top = position.top
    const emojiPickerHeight = 400 // Approximate height of emoji picker
    if (top + emojiPickerHeight > viewportHeight) {
      top = position.top - emojiPickerHeight - 10 // Position above the button
    }

    // Adjust left position to ensure it's visible
    let left = position.left
    const emojiPickerWidth = 300 // Approximate width of emoji picker
    if (left + emojiPickerWidth > viewportWidth) {
      left = viewportWidth - emojiPickerWidth - 20 // 20px margin from right edge
    }

    setEmojiPickerPosition({ top, left })
    setShowEmojiPicker((prev) => !prev)
    setShowCommentBox(false) // Close comment box if open
  }

  // Handle comment box toggle
  const handleToggleCommentBox = (cardId: string, position: Position) => {
    setActiveCardId(cardId)

    // Calculate position to ensure it's visible on screen
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Adjust top position to ensure it's visible
    let top = position.top
    const commentBoxHeight = 200 // Approximate height of comment box
    if (top + commentBoxHeight > viewportHeight) {
      top = position.top - commentBoxHeight - 10 // Position above the button
    }

    // Adjust left position to ensure it's visible
    let left = position.left
    const commentBoxWidth = 300 // Approximate width of comment box
    if (left + commentBoxWidth > viewportWidth) {
      left = viewportWidth - commentBoxWidth - 20 // 20px margin from right edge
    }

    setCommentBoxPosition({ top, left })
    setShowCommentBox((prev) => !prev)
    setShowEmojiPicker(false) // Close emoji picker if open
  }

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (activeCardId) {
      setCardReactions((prev) => {
        // Instead of adding to the array, just set a single emoji as the reaction
        return {
          ...prev,
          [activeCardId]: [emojiData.emoji], // Replace with a single emoji instead of adding to array
        }
      })
      setShowEmojiPicker(false)
    }
  }

  // Handle comment submission
  const handleCommentSubmit = (comment: string) => {
    console.log(`Comment for card ${activeCardId}: ${comment}`)
    setShowCommentBox(false)
  }

  return (
    <main className="w-full mx-auto pt-0 pb-[10vh] px-4 sm:px-6 lg:px-8 relative">
      <div className="py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          <span className="text-primary">Suggested</span> to Me
        </h1>

        <CustomTabsList
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          CustomCard={SuggestedToMeCard}
          filteredSuggestions={filteredSuggestions}
          handleMarkAsWatched={handleMarkAsWatched}
          handleMarkAsWatching={handleMarkAsWatching}
          handleAddToWatchlist={handleAddToWatchlist}
          isLoading={isLoading}
          // Pass the new handlers and state
          onToggleEmojiPicker={handleToggleEmojiPicker}
          onToggleCommentBox={handleToggleCommentBox}
          cardReactions={cardReactions}
        />
      </div>

      {/* Shared Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="fixed z-[1000]"
          style={{
            top: `${emojiPickerPosition.top}px`,
            left: `${emojiPickerPosition.left}px`,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiSelect} width={300} height={400} />
        </div>
      )}

      {/* Shared Comment Box */}
      {showCommentBox && (
        <div
          ref={commentBoxRef}
          className="fixed z-[1000] bg-background border border-border rounded-lg shadow-lg w-80"
          style={{
            top: `${commentBoxPosition.top}px`,
            left: `${commentBoxPosition.left}px`,
          }}
        >
          <CommentBox
            onSubmit={(comment) => {
              console.log(`Comment for card ${activeCardId}: ${comment}`)
              setShowCommentBox(false)
            }}
          />
        </div>
      )}
    </main>
  )
}

export default SuggestedToMe
