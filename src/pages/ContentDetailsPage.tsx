import React, { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Film,
  BookOpen,
  Tv,
  Music,
  Youtube,
  Instagram,
  ArrowLeft,
  ExternalLink,
  Clock,
  Bookmark,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Award,
  DollarSign,
  Clapperboard,
  Tag,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  getMovieDetails,
  getSeriesDetails,
  getBookDetails,
  getMusicDetails,
  MovieDetails,
  SeriesDetails,
  BookDetails,
  MusicDetails,
} from "@/services/content.service";
import { checkContent, addContent, updateContentStatus } from "@/services/contentList.service";
import { toast } from "@/services/toast.service";

// Unified interface for frontend rendering
interface DisplayContent {
  id: string;
  title: string;
  type: string;
  posterUrl?: string;
  year?: number | string;
  creator?: string;
  description?: string;
  status?:
    | "watched"
    | "watching"
    | "watchlist"
    | "finished"
    | "reading"
    | "readlist"
    | "listened"
    | "listening"
    | "listenlist"
    | null;
  suggestedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  suggestedTo?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  suggestedAt?: string;
  whereToConsume?: string[];
  runtime?: number;
  genres?: string[];
  cast?: {
    person: { name: string; tmdbId?: string; [key: string]: any };
    character: string;
  }[];
  rated?: string;
  ratings?: { imdb: { score: number; votes: number } };
  awards?: {
    wins: number;
    nominations: number;
    awardsDetails: any[];
    oscars?: { wins: number; nominations: number };
  };
  boxOffice?: {
    budget: string;
    grossWorldwide: string;
  };
  production?: {
    companies: { name: string; tmdbId?: string }[];
  };
  keywords?: string[];
  language?: string;
  country?: string;
  seasons?: {
    seasonNumber: number;
    episodeCount: number;
    episodes: {
      episodeNumber: number;
      title: string;
      runtime: number;
      plot: string;
    }[];
  }[];
  authors?: string;
  publisher?: string | { name: string; [key: string]: any };
  pages?: number | null;
  isbn?: string;
  artists?: string;
  album?: string;
  duration?: number;
  [key: string]: any;
}

const ContentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMovieRoute = useMatch("/movies/:id");
  const isSeriesRoute = useMatch("/series/:id");
  const isBookRoute = useMatch("/books/:id");
  const isMusicRoute = useMatch("/music/:id");
  const stateContentDetails = location.state?.contentDetails as
    | DisplayContent
    | undefined;

  const [content, setContent] = useState<DisplayContent | null>(null);
  const [contentStatus, setContentStatus] = useState<string | null>(null);
  const [contentRecordId, setContentRecordId] = useState<string | null>(null); // Store the user content record ID
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullCast, setShowFullCast] = useState<boolean>(false);

  const getPublisher = (isBookData: any, item: any) => {
    if (isBookData) {
      if (typeof (item as BookDetails).publisher === "object") {
        return item.publisher.name as string;
      } else {
        return item.publisher as string;
      }
    }
    return undefined;
  };

  const normalizeContent = (
    data:
      | DisplayContent
      | MovieDetails
      | SeriesDetails
      | BookDetails
      | MusicDetails,
    isFromApi: boolean,
    contentType: "movie" | "series" | "book" | "music"
  ): DisplayContent => {
    if (isFromApi) {
      const item = data as
        | MovieDetails
        | SeriesDetails
        | BookDetails
        | MusicDetails;
      const isBookData =
        !!(item as BookDetails).author && !!(item as BookDetails).coverImage;

      return {
        id: item._id || (item.references?.tmdbId ?? ""),
        title: item.title,
        type: isBookData ? "book" : contentType,
        posterUrl: isBookData
          ? (item as BookDetails).coverImage?.url
          : (item as MovieDetails | SeriesDetails | MusicDetails).poster?.url,
        year: isBookData
          ? (item as BookDetails).publishedYear
          : (item as MovieDetails | SeriesDetails | MusicDetails).year,
        creator: isBookData
          ? (item as BookDetails).author?.map((a) => a.name).join(", ") || ""
          : contentType === "movie"
          ? (item as MovieDetails).director?.map((d) => d.name).join(", ") || ""
          : contentType === "series"
          ? (item as SeriesDetails).creator?.map((c) => c.name).join(", ") || ""
          : (item as MusicDetails).artists?.map((a) => a.name).join(", ") || "",
        description: isBookData
          ? (item as BookDetails).description
          : (item as MovieDetails | SeriesDetails | MusicDetails).plot,
        status: null, // We'll fetch status separately
        whereToConsume: isBookData
          ? [
              ...((item as BookDetails).availableOn?.bookstores?.map(
                (b: any) => b.name
              ) || []),
              ...((item as BookDetails).availableOn?.ebooks?.map(
                (e: any) => e.name
              ) || []),
              ...((item as BookDetails).availableOn?.audiobooks?.map(
                (a: any) => a.name
              ) || []),
            ].filter(Boolean).length > 0
            ? [
                ...((item as BookDetails).availableOn?.bookstores?.map(
                  (b: any) => b.name
                ) || []),
                ...((item as BookDetails).availableOn?.ebooks?.map(
                  (e: any) => e.name
                ) || []),
                ...((item as BookDetails).availableOn?.audiobooks?.map(
                  (a: any) => a.name
                ) || []),
              ].filter(Boolean)
            : ["Amazon", "Barnes & Noble", "Local Library"]
          : (
              item.availableOn?.streaming?.map((s: any) => s.platform) || []
            ).filter(Boolean).length > 0
          ? item.availableOn?.streaming?.map((s: any) => s.platform) || []
          : contentType === "music"
          ? ["Spotify", "Apple Music", "YouTube Music"]
          : ["Netflix", "Hulu", "Amazon Prime"],
        runtime: (item as MovieDetails).runtime,
        genres: item.genres || [],
        cast: (item as MovieDetails | SeriesDetails).cast,
        rated: (item as MovieDetails | SeriesDetails).rated,
        ratings: (item as MovieDetails | SeriesDetails).ratings,
        awards: item.awards as any,
        boxOffice: (item as MovieDetails).boxOffice,
        production: {
          companies:
            (item as MovieDetails | SeriesDetails).production?.companies || [],
        },
        keywords: (item as MovieDetails | SeriesDetails).keywords || [],
        language: isBookData
          ? (item as BookDetails).language
          : Array.isArray(
              (item as MovieDetails | SeriesDetails | MusicDetails).language
            )
          ? (item as MovieDetails | SeriesDetails | MusicDetails).language.join(
              ", "
            )
          : (item as MovieDetails | SeriesDetails | MusicDetails).language as any,
        country: (item as MovieDetails | SeriesDetails).country,
        seasons: (item as SeriesDetails).seasons,
        authors: isBookData
          ? (item as BookDetails).author?.map((a) => a.name).join(", ")
          : undefined,
        publisher: getPublisher(isBookData, item),
        pages: isBookData ? (item as BookDetails).pages : undefined,
        isbn: isBookData ? (item as BookDetails).isbn : undefined,
        artists:
          contentType === "music" && !isBookData
            ? (item as MusicDetails).artists?.map((a) => a.name).join(", ")
            : undefined,
        album:
          contentType === "music" && !isBookData
            ? (item as MusicDetails).album as any
            : undefined,
        duration:
          contentType === "music" && !isBookData
            ? (item as MusicDetails).duration as any
            : undefined,
      };
    }
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      posterUrl: data.posterUrl,
      year: data.year,
      creator: data.creator,
      description: data.description,
      status: data.status,
      suggestedBy: data.suggestedBy,
      suggestedTo: data.suggestedTo,
      suggestedAt: data.suggestedAt,
      whereToConsume:
        data.whereToConsume ||
        (data.type === "book"
          ? ["Amazon", "Barnes & Noble", "Local Library"]
          : data.type === "song" || data.type === "music"
          ? ["Spotify", "Apple Music", "YouTube Music"]
          : ["Netflix", "Hulu", "Amazon Prime"]),
      genres: data.genres,
      language: data.language as any,
    };
  };

  // Fetch content details
  useEffect(() => {
    if (stateContentDetails) {
      setContent(
        normalizeContent(
          stateContentDetails,
          false,
          stateContentDetails.type as any
        )
      );
      return;
    }

    const fetchContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        let response;
        if (isMovieRoute) {
          response = await getMovieDetails(id);
          if (response.success && response.data) {
            setContent(normalizeContent(response.data, true, "movie"));
          } else {
            setError(response.message || "Failed to fetch movie details");
          }
        } else if (isSeriesRoute) {
          response = await getSeriesDetails(id);
          if (response.success && response.data) {
            setContent(normalizeContent(response.data, true, "series"));
          } else {
            setError(response.message || "Failed to fetch series details");
          }
        } else if (isBookRoute) {
          response = await getBookDetails(id);
          if (response.success && response.data) {
            setContent(normalizeContent(response.data, true, "book"));
          } else {
            setError(response.message || "Failed to fetch book details");
          }
        } else if (isMusicRoute) {
          response = await getMusicDetails(id);
          if (response.success && response.data) {
            setContent(normalizeContent(response.data, true, "music"));
          } else {
            setError(response.message || "Failed to fetch music details");
          }
        } else {
          setError("Invalid route");
        }
      } catch (err) {
        setError("An error occurred while fetching content details");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [
    id,
    stateContentDetails,
    isMovieRoute,
    isSeriesRoute,
    isBookRoute,
    isMusicRoute,
  ]);

  // Fetch content status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!id) return;
      try {
        const response = await checkContent({ contentId: id });
        if (response.success && response.data) {
          setContentStatus(response.data.status || null);
          setContentRecordId(response.data.id || null); // Store the user content record ID
        } else {
          setContentStatus(null);
          setContentRecordId(null);
        }
      } catch (err: any) {
        toast.error("Abe, status check nahi hua!");
      }
    };

    fetchStatus();
  }, [id]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!content) return;
    if (newStatus === "add-to-list") return; // Do nothing if "Add to Your List" is selected
    try {
      let response;
      if (contentRecordId) {
        // Content exists, update status
        response = await updateContentStatus(contentRecordId, { status: newStatus });
        if (response.success) {
          setContentStatus(newStatus);
          toast.success("Bhai, status update ho gaya!");
        } else {
          throw new Error(response.message || "Abe, status update nahi hua!");
        }
      } else {
        // Content doesn't exist, add it
        response = await addContent({
          content: { id: content.id, type: content.type.charAt(0).toUpperCase() + content.type.slice(1) },
          status: newStatus,
          suggestionId: undefined, // Not a suggested content
        });
        if (response.success && response.data) {
          setContentStatus(newStatus);
          setContentRecordId(response.data.id); // Store the new record ID
          toast.success("Bhai, content add ho gaya!");
        } else {
          throw new Error(response.message || "Abe, content add nahi hua!");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Abe, kuch gadbad ho gaya!");
    }
  };

  if (loading) {
    return (
      <main className="w-full mx-auto pb-[10vh] pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Loading...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="max-w-7xl mx-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Content not found</h2>
            <p className="text-muted-foreground mt-2">
              {error ||
                "The content you're looking for doesn't exist or couldn't be loaded."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-5 w-5" />;
      case "series":
        return <Tv className="h-5 w-5" />;
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "music":
        return <Music className="h-5 w-5" />;
      case "anime":
        return <Tv className="h-5 w-5" />;
      case "song":
        return <Music className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "reels":
        return <Instagram className="h-5 w-5" />;
      default:
        return <Film className="h-5 w-5" />;
    }
  };

  const getContentSpecificStatusLabel = (status: string | null, type: string): string => {
    if (!status) return "Add to Your List";
    if (status === "NotInterested") return "Not Interested";
    if (status === "WantToConsume") {
      return type === "book" ? "Reading List" : type === "music" || type === "song" ? "Listening List" : "Watchlist";
    }
    switch (type) {
      case "book":
        return status === "Consumed" ? "Finished" : "Reading";
      case "music":
      case "song":
        return status === "Consumed" ? "Listened" : "Listening";
      default:
        return status === "Consumed" ? "Watched" : "Watching";
    }
  };

  const getStatusBadgeColor = (status: string | null) => {
    if (status === "Consumed") {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (status === "Consuming") {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    } else if (status === "WantToConsume") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else if (status === "NotInterested") {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getWhereToConsumeLabel = () => {
    switch (content.type) {
      case "book":
        return "Where to Read";
      case "song":
      case "music":
        return "Where to Listen";
      default:
        return "Where to Watch";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount.replace("$", "")));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Define dropdown options based on content type
  const getStatusOptions = (type: string) => {
    const baseOptions = [
      { value: "Consumed", label: type === "book" ? "Finished" : type === "music" || type === "song" ? "Listened" : "Watched" },
      { value: "Consuming", label: type === "book" ? "Reading" : type === "music" || type === "song" ? "Listening" : "Watching" },
      { value: "WantToConsume", label: type === "book" ? "Reading List" : type === "music" || type === "song" ? "Listening List" : "Watchlist" },
      { value: "NotInterested", label: "Not Interested" },
    ];
    if (!contentRecordId) {
      return [{ value: "add-to-list", label: "Add to Your List" }, ...baseOptions];
    }
    return baseOptions;
  };

  return (
    <main className="max-w-7xl mx-auto pt-0 px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Poster */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden bg-muted shadow-lg">
              {content.posterUrl ? (
                <img
                  src={content.posterUrl}
                  alt={content.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-primary/10">
                  {getIconForType(content.type)}
                </div>
              )}
            </div>

            {/* Where to watch/read/listen */}
            <div className="mt-6 bg-card rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">
                {getWhereToConsumeLabel()}
              </h3>
              <div className="space-y-2">
                {content.whereToConsume?.length ? (
                  content.whereToConsume.map((place, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors"
                    >
                      <span>{place}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Not available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Content details */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                {getIconForType(content.type)}
              </div>
              <span className="text-sm font-medium text-primary capitalize">
                {content.type}
              </span>
            </div>

            {/* Title with Status Dropdown */}
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{content.title}</h1>
              <Select
                onValueChange={(value) => handleStatusChange(value)}
                value={contentStatus || "add-to-list"}
              >
                <SelectTrigger
                  className={`w-[180px] ${getStatusBadgeColor(contentStatus)} border-none shadow-sm focus:ring-0 focus:ring-offset-0`}
                >
                  <SelectValue>
                    {getContentSpecificStatusLabel(contentStatus, content.type)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions(content.type).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.value === "add-to-list" ? (
                          <Bookmark className="h-4 w-4" />
                        ) : option.value === "Consumed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : option.value === "Consuming" ? (
                          <Clock className="h-4 w-4" />
                        ) : option.value === "WantToConsume" ? (
                          <Bookmark className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-muted-foreground mb-4">
              {[
                content.creator,
                content.year,
                content.rated,
                content.runtime && `${content.runtime} min`,
                content.duration && formatDuration(content.duration),
                content.language,
                content.country,
                typeof content.publisher === "string"
                  ? content.publisher
                  : content.publisher?.name,
                content.isbn && `ISBN: ${content.isbn}`,
                content.album,
                content.pages && `${content.pages} pages`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>

            {/* Seasons (for series) */}
            {content.type === "series" &&
              content.seasons &&
              content.seasons.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-lg">Seasons</h3>
                  <div className="mt-2">
                    <p>
                      {content.seasons.length} Season
                      {content.seasons.length > 1 ? "s" : ""}
                    </p>
                    <ul className="list-disc pl-5 mt-2">
                      {content.seasons.map((season, index) => (
                        <li key={index}>
                          Season {season.seasonNumber}: {season.episodeCount}{" "}
                          Episode
                          {season.episodeCount > 1 ? "s" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            {/* Genres */}
            {content.genres && content.genres.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Genres</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            {content.ratings?.imdb?.score && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Rating</h3>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>
                    {content.ratings.imdb.score.toFixed(1)}/10 (
                    {content.ratings.imdb.votes.toLocaleString()} votes)
                  </span>
                </div>
              </div>
            )}

            {/* Awards */}
            {content.awards && (
              <div className="mb-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" /> Awards
                </h3>
                <div className="mt-2">
                  {content.awards.oscars?.wins ||
                  content.awards.oscars?.nominations ? (
                    <p>
                      Oscars: {content.awards.oscars.wins} wins,{" "}
                      {content.awards.oscars.nominations} nominations
                    </p>
                  ) : (
                    <p>No Oscar wins or nominations</p>
                  )}
                  {(content.awards.wins || content.awards.nominations) && (
                    <p>
                      Total: {content.awards.wins} wins,{" "}
                      {content.awards.nominations} nominations
                    </p>
                  )}
                  {content.awards.awardsDetails?.length ? (
                    <ul className="list-disc pl-5 mt-2">
                      {content.awards.awardsDetails.map((award, index) => (
                        <li key={index}>{award}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No additional award details
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Box Office (for movies only) */}
            {content.type === "movie" && content.boxOffice && (
              <div className="mb-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Box Office
                </h3>
                <div className="mt-2">
                  {content.boxOffice.budget && (
                    <p>Budget: {formatCurrency(content.boxOffice.budget)}</p>
                  )}
                  {content.boxOffice.grossWorldwide && (
                    <p>
                      Gross Worldwide:{" "}
                      {formatCurrency(content.boxOffice.grossWorldwide)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {content.production?.companies?.length && (
              <div className="mb-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Clapperboard className="h-5 w-5" /> Production
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.production.companies.map((company, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {content.keywords && content.keywords.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p
                className="text-foreground"
                dangerouslySetInnerHTML={{
                  __html: content.description || "No description available.",
                }}
              ></p>
            </div>

            {/* Cast */}
            {content.cast && content.cast.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.cast
                    .slice(0, showFullCast ? undefined : 10)
                    .map((actor, index) => (
                      <div key={index} className="flex items-center">
                        <Avatar className="h-16 w-16 mr-3 ring-1 ring-primary/20 cursor-pointer">
                          <AvatarImage
                            src={actor.person?.profileImage?.url}
                            alt={actor.person?.name}
                            className="w-full h-full object-cover"
                          />
                          <AvatarFallback>
                            {actor.person?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{actor.person?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            as {actor?.character}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                {content.cast.length > 10 && (
                  <Button
                    variant="link"
                    className="mt-4"
                    onClick={() => setShowFullCast(!showFullCast)}
                  >
                    {showFullCast ? "Show Less" : "Show More"}
                  </Button>
                )}
              </div>
            )}

            {/* Social media style interaction buttons */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
              >
                <Heart className="h-4 w-4" /> Like
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Comment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Suggested by or to section */}
            {content.suggestedBy && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Suggested by</h2>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-primary/20">
                    <AvatarImage
                      src={content.suggestedBy.avatar}
                      alt={content.suggestedBy.name}
                    />
                    <AvatarFallback>
                      {content.suggestedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{content.suggestedBy.name}</p>
                    {content.suggestedAt && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(content.suggestedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {content.suggestedTo && content.suggestedTo.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Suggested to</h2>
                <div className="flex flex-wrap gap-2">
                  {content.suggestedTo.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center bg-accent hover:bg-accent/80 rounded-full py-1 px-3 transition-colors"
                    >
                      <Avatar className="h-6 w-6 mr-2 ring-1 ring-primary/20">
                        <AvatarImage
                          src={recipient.avatar}
                          alt={recipient.name}
                        />
                        <AvatarFallback>
                          {recipient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {recipient.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContentDetailsPage;