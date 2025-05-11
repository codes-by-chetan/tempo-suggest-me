import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Music,
  Clock,
  Bookmark,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Award,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getMusicDetails, MusicDetails } from "@/services/content.service";

// Function to format play counts
const formatPlays = (plays: string): string => {
  const num = parseInt(plays.replace(/,/g, ""));
  if (isNaN(num)) return "0";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(num % 1000000 >= 100000 ? 1 : 0)}M+`;
  } else if (num >= 100000) {
    return `${Math.floor(num / 1000)}k`;
  } else if (num >= 10000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const MusicDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<MusicDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"listened" | "listening" | "listenlist" | null>(null); // Mock status

  useEffect(() => {
    const fetchMusicContent = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await getMusicDetails(id);
        if (response.success && response.data) {
          setContent(response.data);
        } else {
          setError(response.message || "Music details nahi mil rahe, bhai!");
        }
      } catch (err) {
        setError("Kuch toh gadbad hai, details nahi aa rahe!");
      } finally {
        setLoading(false);
      }
    };

    fetchMusicContent();
  }, [id]);

  if (loading) {
    return (
      <main className="w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Thodi der ruk, loading ho raha hai...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="w-full mx­-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Abe music kahan hai?</h2>
            <p className="text-muted-foreground mt-2">
              {error || "Jo music dhund raha hai, woh nahi mil rahi, bhai."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const getStatusLabel = (status: string | null): string => {
    if (!status) return "Not Started";
    if (status === "listenlist") return "In Listening List";
    return status === "listened" ? "Listened" : "Listening";
  };

  return (
    <main className="w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Album Art */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden bg-muted shadow-lg">
              {content.album.coverImage?.url ? (
                <img
                  src={content.album.coverImage.url}
                  alt={content.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-primary/10">
                  <Music className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Status indicator */}
            {status && (
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    status === "listened"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : status === "listening"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {status === "listened" ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {getStatusLabel(status)}
                    </>
                  ) : status === "listening" ? (
                    <>
                      <Clock className="mr-1 h-4 w-4" />
                      {getStatusLabel(status)}
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-1 h-4 w-4" />
                      {getStatusLabel(status)}
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Where to listen */}
            <div className="mt-6 bg-card rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">Where to Listen</h3>
              <div className="space-y-2">
                {content.availableOn.spotify ? (
                  <a
                    href={content.availableOn.spotify.link}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">Spotify</span>
                      <span className="text-sm text-muted-foreground">
                        {formatPlays(content.availableOn.spotify.plays)} plays
                      </span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Koi platform nahi mila, bhai!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Music details */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                <Music className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-primary capitalize">
                Music
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-2">{content.title}</h1>

            <p className="text-muted-foreground mb-4">
              {[
                content.artist.name,
                content.featuredArtists.map((a) => a.name).join(", "),
                content.releaseYear,
                content.album.title,
                content.duration,
                content.language || "Unknown",
                content.recordLabel.name,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>

            {/* Genres */}
            {content.genres.length > 0 && (
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

            {/* Mood */}
            {content.mood.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Mood
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.mood.map((mood, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            <div className="mb-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Award className="h-5 w-5" /> Awards
              </h3>
              <div className="mt-2">
                <p>
                  Grammys: {content.awards.grammys.wins} wins,{" "}
                  {content.awards.grammys.nominations} nominations
                </p>
                <p>
                  Billboard Music Awards:{" "}
                  {content.awards.billboardMusicAwards.wins} wins,{" "}
                  {content.awards.billboardMusicAwards.nominations} nominations
                </p>
                <p>
                  Total: {content.awards.wins} wins,{" "}
                  {content.awards.nominations} nominations
                </p>
              </div>
            </div>

            {/* Production Companies */}
            {content.productionCompanies.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Production</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.productionCompanies.map((company, index) => (
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

            {/* Writers, Producers, Engineers */}
            {(content.writers.length > 0 ||
              content.producers.length > 0 ||
              content.engineers.length > 0) && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Crew</h3>
                <div className="mt-2">
                  {content.writers.length > 0 && (
                    <p>Writers: {content.writers.join(", ")}</p>
                  )}
                  {content.producers.length > 0 && (
                    <p>Producers: {content.producers.join(", ")}</p>
                  )}
                  {content.engineers.length > 0 && (
                    <p>Engineers: {content.engineers.join(", ")}</p>
                  )}
                </div>
              </div>
            )}

            {/* Formats */}
            {content.formats.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Formats</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.formats.map((format, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Remixes */}
            {content.remixes.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Remixes</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {content.remixes.map((remix, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-sm rounded-full"
                    >
                      {remix}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {content.artist.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-foreground">{content.artist.biography}</p>
              </div>
            )}

            {/* Artists */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Artists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  content.artist,
                  ...content.featuredArtists,
                ].map((artist, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-16 w-16 mr-3 ring-1 ring-primary/20">
                      <AvatarImage
                        src={artist.profileImage?.url}
                        alt={artist.name}
                      />
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{artist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {artist.professions.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </main>
  );
};

export default MusicDetailsPage;