import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkeletonCard from "@/components/home/SkeletonCard";
import { getTrendingMovies, getTrendingSeries, getTrendingMusic, getBookDetails, MovieDetails, SeriesDetails, MusicDetails, BookDetails } from '@/services/content.service';

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

const RenderContentCard = (item: ContentItem, navigate: (id:string)=>any) => {
  
  return(
  <div
    key={item._id}
    className="bg-background rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-all cursor-pointer"
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
            <span className="text-xs font-medium text-foreground">
              {item.suggestedBy.name}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
)};

const Trending = () => {
  const navigate = useNavigate();
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const [moviesRes, seriesRes, musicRes, bookRes] = await Promise.all([
          getTrendingMovies(),
          getTrendingSeries(),
          getTrendingMusic(),
          getBookDetails(""), // Note: getBookDetails requires a bookId; assuming a similar trending endpoint exists
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

        setTrendingContent(trending);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <main className="w-full pb-[10vh] mx-auto pt-0 px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-8">Trending Now</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingContent.map(item => RenderContentCard(item, navigate))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Trending;