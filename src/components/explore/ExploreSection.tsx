import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  year?: string;
  creator?: string;
  description?: string;
  suggestedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  suggestedAt: string;
  status?: "watched" | "watching" | "watchlist" | null;
  whereToWatch?: string[];
  whereToRead?: string[];
  whereToListen?: string[];
}

interface ExploreSectionProps {
  className?: string;
}

const ExploreSection = ({ className = "" }: ExploreSectionProps) => {
  const navigate = useNavigate();
  const [exploreContent, setExploreContent] = useState<{
    trending: ContentItem[];
    friendActivity: ContentItem[];
    recommended: ContentItem[];
  }>({
    trending: [],
    friendActivity: [],
    recommended: [],
  });

  // Mock function to fetch explore content
  useEffect(() => {
    // In a real app, this would be an API call
    const mockTrending: ContentItem[] = [
      {
        id: "t1",
        title: "Dune: Part Two",
        type: "movie",
        imageUrl:
          "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&q=80",
        year: "2024",
        creator: "Denis Villeneuve",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        suggestedAt: new Date().toISOString(),
        whereToWatch: ["HBO Max", "Theaters"],
      },
      {
        id: "t2",
        title: "The Three-Body Problem",
        type: "book",
        imageUrl:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80",
        year: "2008",
        creator: "Liu Cixin",
        description:
          "Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens.",
        suggestedAt: new Date().toISOString(),
        whereToRead: ["Amazon", "Barnes & Noble", "Local Bookstore"],
      },
      {
        id: "t3",
        title: "Oppenheimer",
        type: "movie",
        imageUrl:
          "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=300&q=80",
        year: "2023",
        creator: "Christopher Nolan",
        description:
          "The story of J. Robert Oppenheimer and the creation of the atomic bomb during World War II.",
        suggestedAt: new Date().toISOString(),
        whereToWatch: ["Peacock", "Apple TV+"],
      },
      {
        id: "t4",
        title: "Project Hail Mary",
        type: "book",
        imageUrl:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&q=80",
        year: "2021",
        creator: "Andy Weir",
        description:
          "A lone astronaut must save humanity from disaster while piecing together his forgotten mission in deep space.",
        suggestedAt: new Date().toISOString(),
        whereToRead: ["Audible", "Amazon", "Bookshop.org"],
      },
      {
        id: "t5",
        title: "The Bear",
        type: "tv",
        imageUrl:
          "https://images.unsplash.com/photo-1620207418302-439b387441b0?w=300&q=80",
        year: "2022",
        creator: "Christopher Storer",
        description:
          "A young chef from the fine dining world returns home to run his family's sandwich shop in Chicago.",
        suggestedAt: new Date().toISOString(),
        whereToWatch: ["Hulu", "Disney+"],
      },
      {
        id: "t6",
        title: "Sapiens: A Brief History of Humankind",
        type: "book",
        imageUrl:
          "https://images.unsplash.com/photo-1588776814546-bc4bde8f7a5f?w=300&q=80",
        year: "2011",
        creator: "Yuval Noah Harari",
        description:
          "Explores how Homo sapiens became the dominant species and how our history shaped modern society.",
        suggestedAt: new Date().toISOString(),
        whereToRead: ["Kindle", "Amazon", "Libraries"],
      },
    ];

    const mockFriendActivity: ContentItem[] = [
      {
        id: "f1",
        title: "Jujutsu Kaisen",
        type: "anime",
        imageUrl:
          "https://images.unsplash.com/photo-1541562232579-512a21360020?w=300&q=80",
        year: "2020",
        creator: "Gege Akutami",
        description:
          "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
        suggestedBy: {
          id: "3",
          name: "Sophia Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
        },
        suggestedAt: new Date().toISOString(),
        status: "watching",
        whereToWatch: ["Crunchyroll", "Netflix"],
      },
    ];

    const mockRecommended: ContentItem[] = [
      {
        id: "r1",
        title: "Pachinko",
        type: "book",
        imageUrl:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
        year: "2017",
        creator: "Min Jin Lee",
        description:
          "Following a Korean family who eventually migrates to Japan, the novel is a tale of love, sacrifice, ambition, and loyalty.",
        suggestedAt: new Date().toISOString(),
        whereToRead: ["Amazon", "Apple Books", "Local Bookstore"],
      },
      {
        id: "r2",
        title: "Killers of the Flower Moon",
        type: "movie",
        imageUrl:
          "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
        year: "2023",
        creator: "Martin Scorsese",
        description:
          "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation.",
        suggestedAt: new Date().toISOString(),
        whereToWatch: ["Apple TV+", "Amazon Prime"],
      },
    ];

    setExploreContent({
      trending: mockTrending,
      friendActivity: mockFriendActivity,
      recommended: mockRecommended,
    });
  }, []);

  const renderContentCard = (item: ContentItem) => (
    <div
      key={item.id}
      className="bg-background rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all cursor-pointer"
      onClick={() =>
        navigate(`/content/${item.id}`, { state: { contentDetails: item } })
      }
    >
      {item.imageUrl && (
        <div className="w-full h-40 bg-muted">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary capitalize">
            {item.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(item.suggestedAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-foreground">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {item.creator} • {item.year}
        </p>

        {item.suggestedBy && (
          <div className="flex items-center pt-3 border-t border-border">
            <span className="text-xs font-medium text-foreground mr-2">
              {item.status === "watching"
                ? "Currently watching:"
                : "Suggested by:"}
            </span>
            <div className="flex items-center">
              {item.suggestedBy.avatar && (
                <div className="h-5 w-5 rounded-full overflow-hidden mr-1 ring-1 ring-primary/20">
                  <img
                    src={item.suggestedBy.avatar}
                    alt={item.suggestedBy.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <span className="text-xs font-medium text-foreground">
                {item.suggestedBy.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ContentRow = ({
    contentArray,
    heading,
  }: {
    contentArray: ContentItem[];
    heading: string;
  }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
        <Link
          to="/explore/trending"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
          {contentArray.slice(0, 3).map(renderContentCard)}
        </div>

        {/* Fade overlay */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      <ContentRow
        heading="Trending Now"
        contentArray={exploreContent.trending}
      />

      <ContentRow
        heading="Friend Activity"
        contentArray={exploreContent.friendActivity}
      />

      <ContentRow
        heading="Recommended For You"
        contentArray={exploreContent.recommended}
      />
    </div>
  );
};

export default ExploreSection;
