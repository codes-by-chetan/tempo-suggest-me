import { useState, useEffect, useRef } from "react";
import { CustomTabsList } from "@/components/layout/CustomTabsList";
import SuggestedToMeCard from "@/components/layout/SuggestedToMeCard";
import { getSuggestedToYou } from "@/services/suggestion.service";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import CommentBox from "@/components/reusables/CommentBox";
import { toast } from "@/services/toast.service";

interface ContentItem {
  id: string;
  contentId?: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator?: string;
  description?: string;
  suggestedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  suggestedAt: string;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
  [key: string]: any;
}

interface Position {
  top: number;
  left: number;
}

const SuggestedToMe = () => {
  const mockSuggestions: ContentItem[] = [
    {
      id: "1",
      contentId: "movie123",
      title: "The Shawshank Redemption",
      type: "movie",
      imageUrl:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
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
      contentId: "book456",
      title: "To Kill a Mockingbird",
      type: "book",
      imageUrl:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
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
      contentId: "series789",
      title: "Attack on Titan",
      type: "anime",
      imageUrl:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80",
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
      contentId: "music101",
      title: "Bohemian Rhapsody",
      type: "song",
      imageUrl:
        "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
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
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [suggestions, setSuggestions] = useState<ContentItem[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<ContentItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Global state for shared emoji picker and comment box
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<Position>({
    top: 0,
    left: 0,
  });
  const [commentBoxPosition, setCommentBoxPosition] = useState<Position>({
    top: 0,
    left: 0,
  });
  const [cardReactions, setCardReactions] = useState<Record<string, string[]>>(
    {}
  );

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  // Filter suggestions when tab or suggestions change
  useEffect(() => {
    setFilteredSuggestions(
      activeTab === "all"
        ? suggestions
        : suggestions.filter((item) => item.type === activeTab)
    );
  }, [activeTab, suggestions]);

  // Fetch suggestions on component mount or page/tab change
  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await getSuggestedToYou({
          page,
          limit,
          type: activeTab === "all" ? undefined : activeTab,
        });
        if (res.success) {
          setSuggestions(res.data);
          setTotalPages(Math.ceil(res.total / limit));
        } else {
          setSuggestions(mockSuggestions);
          toast.error("Abe, suggestions fetch nahi hui!");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions(mockSuggestions);
        toast.error("Abe, kuch gadbad ho gaya!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [activeTab, page]);

  // Close emoji picker and comment box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        showCommentBox &&
        commentBoxRef.current &&
        !commentBoxRef.current.contains(event.target as Node)
      ) {
        setShowCommentBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showCommentBox]);

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    if (activeCardId) {
      setCardReactions((prev) => ({
        ...prev,
        [activeCardId]: [emojiData.emoji],
      }));
      setShowEmojiPicker(false);
      toast.success("Bhai, emoji daal diya!");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = (comment: string) => {
    console.log(`Comment for card ${activeCardId}: ${comment}`);
    setShowCommentBox(false);
    toast.success("Bhai, comment daal diya!");
  };

  // Handle emoji picker toggle
  const handleToggleEmojiPicker = (cardId: string, position: Position) => {
    setActiveCardId(cardId);
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let top = position.top;
    const emojiPickerHeight = 400;
    if (top + emojiPickerHeight > viewportHeight) {
      top = position.top - emojiPickerHeight - 10;
    }
    let left = position.left;
    const emojiPickerWidth = 300;
    if (left + emojiPickerWidth > viewportWidth) {
      left = viewportWidth - emojiPickerWidth - 20;
    }
    setEmojiPickerPosition({ top, left });
    setShowEmojiPicker((prev) => !prev);
    setShowCommentBox(false);
  };

  // Handle comment box toggle
  const handleToggleCommentBox = (cardId: string, position: Position) => {
    setActiveCardId(cardId);
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let top = position.top;
    const commentBoxHeight = 200;
    if (top + commentBoxHeight > viewportHeight) {
      top = position.top - commentBoxHeight - 10;
    }
    let left = position.left;
    const commentBoxWidth = 300;
    if (left + commentBoxWidth > viewportWidth) {
      left = viewportWidth - commentBoxWidth - 20;
    }
    setCommentBoxPosition({ top, left });
    setShowCommentBox((prev) => !prev);
    setShowEmojiPicker(false);
  };

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
          isLoading={isLoading}
          onToggleEmojiPicker={handleToggleEmojiPicker}
          onToggleCommentBox={handleToggleCommentBox}
          cardReactions={cardReactions}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </div>
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="fixed z-[1000]"
          style={{
            top: `${emojiPickerPosition.top}px`,
            left: `${emojiPickerPosition.left}px`,
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width={300}
            height={400}
          />
        </div>
      )}
      {showCommentBox && (
        <div
          ref={commentBoxRef}
          className="fixed z-[1000] bg-background border border-border rounded-lg shadow-lg w-80"
          style={{
            top: `${commentBoxPosition.top}px`,
            left: `${commentBoxPosition.left}px`,
          }}
        >
          <CommentBox onSubmit={handleCommentSubmit} />
        </div>
      )}
    </main>
  );
};

export default SuggestedToMe;
