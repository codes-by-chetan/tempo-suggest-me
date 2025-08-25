import { useMobile } from "@/lib/use-mobile";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import SkeletonCard from "./SkeletonCard";
import { getTrendingMovies, getTrendingSeries, getTrendingMusic, MovieDetails, SeriesDetails, MusicDetails, BookDetails, getTrendingBooks } from '@/services/content.service';

interface ContentItem {
  _id: string;
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
  imdbId?: string;
  tmdbId?: string;
  googleBooksId?: string;
  spotifyId?: string;
}

interface ExploreSectionProps {
  className?: string;
}

const mapMovieToContentItem = (movie: MovieDetails): ContentItem => ({
  _id: movie._id,
  title: movie.title,
  type: "movie",
  imageUrl: movie.poster?.url,
  year: movie.year?.toString(),
  creator: movie.director?.map(d => d.name).join(', '),
  description: movie.plot,
  suggestedAt: movie.createdAt || new Date().toISOString(),
  whereToWatch: movie.availableOn?.streaming?.map((s: any) => s.name) || [],
  imdbId: movie.references?.imdbId,
  tmdbId: movie.references?.tmdbId,
});

const mapSeriesToContentItem = (series: SeriesDetails): ContentItem => ({
  _id: series._id,
  title: series.title,
  type: "series",
  imageUrl: series.poster?.url,
  year: series.year?.toString(),
  creator: series.creator?.map(c => c.name).join(', '),
  description: series.plot,
  suggestedAt: series.createdAt || new Date().toISOString(),
  whereToWatch: series.availableOn?.streaming?.map((s: any) => s.name) || [],
  imdbId: series.references?.imdbId,
  tmdbId: series.references?.tmdbId,
});

const mapBookToContentItem = (book: BookDetails): ContentItem => ({
  _id: book._id,
  title: book.title,
  type: "book",
  imageUrl: book.cover?.url,
  year: book.year?.toString(),
  creator: book.authors?.map(a => a.name).join(', '),
  description: book.plot,
  suggestedAt: book.createdAt || new Date().toISOString(),
  whereToRead: book.availableOn?.bookstores?.map((b: any) => b.name) || [],
  googleBooksId: book.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier,
});

const mapMusicToContentItem = (music: MusicDetails): ContentItem => ({
  _id: music._id,
  title: music.title,
  type: "music",
  imageUrl: music.album?.coverImage?.url,
  year: music.releaseYear?.toString(),
  creator: music.artist?.name,
  description: '', // No description in MusicDetails
  suggestedAt: music.createdAt || new Date().toISOString(),
  whereToListen: Object.keys(music.availableOn || {}).filter(key => music.availableOn[key]?.link).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
  spotifyId: music.spotifyId,
});

const getNavigationRoute = (item: ContentItem): string => {
  switch (item.type) {
    case "movie":
      return `/movies/${item.imdbId || item._id || item.tmdbId}`;
    case "series":
      return `/series/${item.imdbId || item._id || item.tmdbId}`;
    case "book":
      return `/books/${item.googleBooksId || item._id}`;
    case "music":
      return `/music/${item.spotifyId || item._id}`;
    default:
      return `/content/${item._id}`;
  }
};

const RenderContentCard = (item: ContentItem, navigate: ReturnType<typeof useNavigate>) => {
  return (
    <div
      key={item._id}
      className="group hover:relative hover:z-10 bg-background rounded-lg overflow-hidden shadow-sm border border-border hover:scale-105 hover:shadow-md hover:rounded-lg transition-all cursor-pointer"
      onClick={() => navigate(getNavigationRoute(item))}
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
      <div className="hidden group-hover:block absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-sm p-4 h-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary capitalize">
            {item.type}
          </span>
          <span className="text-xs text-gray-400 dark:text-muted-foreground">
            {new Date(item.suggestedAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-300 dark:text-foreground">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 dark:text-muted-foreground mb-2">
          {item.creator} • {item.year}
        </p>
        {item.suggestedBy && (
          <div className="flex items-center pt-3 border-t border-border">
            <span className="text-xs font-medium text-gray-400 dark:text-muted-foreground mr-2">
              {item.status === "watching" ? "Currently watching:" : "Suggested by:"}
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
              <span className="text-xs font-medium text-gray-400 dark:text-muted-foreground">
                {item.suggestedBy.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContentRow = ({
  contentArray,
  heading,
  isMobile = false,
  navigate,
}: {
  contentArray: ContentItem[];
  heading: string;
  isMobile: boolean;
  navigate: ReturnType<typeof useNavigate>;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 overflow-hidden relative">
        {contentArray.slice(0, 5).map(item => RenderContentCard(item, navigate))}
      </div>
      {!isMobile ? (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-background to-transparent" />
      ) : (
        <></>
      )}
    </div>
  </div>
);

const ExploreSection = ({ className = "" }: ExploreSectionProps) => {
  const isMobile = useMobile();
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const [moviesRes, seriesRes, musicRes, bookRes] = await Promise.all([
          getTrendingMovies(),
          getTrendingSeries(),
          getTrendingMusic(),
          getTrendingBooks(), // Note: getBookDetails requires a bookId; assuming a similar trending endpoint exists
        ]);

        const movies = moviesRes.success ? moviesRes.data : [];
        const series = seriesRes.success ? seriesRes.data : [];
        const music = musicRes.success ? musicRes.data : [];
        const books = bookRes.success ? bookRes.data : [];

        const trending: ContentItem[] = [
          ...movies.map(mapMovieToContentItem),
          ...series.map(mapSeriesToContentItem),
          ...music.map(mapMusicToContentItem),
          ...books.map(mapBookToContentItem),
        ];

        setExploreContent(prev => ({ ...prev, trending }));
      } catch (error) {
        console.error("Error fetching trending content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();

    // Friend Activity mock (replace with API if available)
    const mockFriendActivity: ContentItem[] = [
      {
        _id: "f1",
        title: "Jujutsu Kaisen",
        type: "anime",
        imageUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=300&q=80",
        year: "2020",
        creator: "Gege Akutami",
        description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
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

    // Recommended mock (replace with API if available)
    const mockRecommended: ContentItem[] = [
      {
        _id: "r1",
        title: "Pachinko",
        type: "book",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80",
        year: "2017",
        creator: "Min Jin Lee",
        description: "Following a Korean family who eventually migrates to Japan, the novel is a tale of love, sacrifice, ambition, and loyalty.",
        suggestedAt: new Date().toISOString(),
        whereToRead: ["Amazon", "Apple Books", "Local Bookstore"],
      },
      {
        _id: "r2",
        title: "Killers of the Flower Moon",
        type: "movie",
        imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80",
        year: "2023",
        creator: "Martin Scorsese",
        description: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s, sparking a major F.B.I. investigation.",
        suggestedAt: new Date().toISOString(),
        whereToWatch: ["Apple TV+", "Amazon Prime"],
      },
    ];

    setExploreContent(prev => ({ ...prev, friendActivity: mockFriendActivity, recommended: mockRecommended }));
  }, []);

  return (
    <div className={`${className}`}>
      {isLoading ? (
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array(5).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <ContentRow
            heading="Trending Now"
            contentArray={exploreContent.trending}
            isMobile={isMobile}
            navigate={navigate}
          />
          <ContentRow
            heading="Friend Activity"
            contentArray={exploreContent.friendActivity}
            isMobile={isMobile}
            navigate={navigate}
          />
          <ContentRow
            heading="Recommended For You"
            contentArray={exploreContent.recommended}
            isMobile={isMobile}
            navigate={navigate}
          />
        </>
      )}
    </div>
  );
};

export default ExploreSection;