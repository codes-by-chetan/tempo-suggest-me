import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Clock,
  Bookmark,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  Tag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getBookDetails, BookDetails } from "@/services/content.service";

interface DisplayBook {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  publishedYear?: number;
  authors?: string;
  description?: string;
  publisher?: string | { name: string; [key: string]: any };
  pages?: number;
  isbn?: string;
  genres?: string[];
  language?: string;
  status?: "finished" | "reading" | "readlist" | null;
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
  whereToRead?: string[];
  awards?: {
    wins: number;
    nominations: number;
    awardsDetails: any[];
  };
}

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<DisplayBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeBookData = (data: any): DisplayBook => {
    // Handle the actual API response structure
    return {
      id: data._id || "",
      title: data.title,
      subtitle: data.subtitle || undefined,
      coverUrl: data.coverImage?.url,
      publishedYear: data.publishedYear,
      authors: data.author?.map((a: any) => a.name).join(", ") || "",
      description: data.description,
      publisher: data.publisher?.name || "",
      pages: data.pages,
      isbn:
        data.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")
          ?.identifier ||
        data.industryIdentifiers?.find((id: any) => id.type === "ISBN_10")
          ?.identifier,
      genres: data.genres || [],
      language: data.language,
      status: null,
      whereToRead:
        [
          ...(data.availableOn?.bookstores?.map((b: any) => b.name) || []),
          ...(data.availableOn?.ebooks?.map((e: any) => e.name) || []),
          ...(data.availableOn?.audiobooks?.map((a: any) => a.name) || []),
        ].filter(Boolean).length > 0
          ? [
              ...(data.availableOn?.bookstores?.map((b: any) => b.name) || []),
              ...(data.availableOn?.ebooks?.map((e: any) => e.name) || []),
              ...(data.availableOn?.audiobooks?.map((a: any) => a.name) || []),
            ].filter(Boolean)
          : ["Amazon", "Barnes & Noble", "Local Library"],
      awards: data.awards,
    };
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await getBookDetails(id);
        if (response.success && response.data) {
          setBook(normalizeBookData(response.data));
        } else {
          setError(response.message || "Failed to fetch book details");
        }
      } catch (err) {
        setError("An error occurred while fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const getStatusLabel = (status: string | null): string => {
    if (!status) return "Not Started";
    if (status === "readlist") return "In Reading List";
    return status === "finished" ? "Finished" : "Reading";
  };

  if (loading) {
    return (
      <main className="w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Loading...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="w-full mx-auto pt-0 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Book not found</h2>
            <p className="text-muted-foreground mt-2">
              {error ||
                "The book you're looking for doesn't exist or couldn't be loaded."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full pb-[10vh] mx-auto pt-0 px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Book Cover */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden bg-muted shadow-lg">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-primary/10">
                  <BookOpen className="h-12 w-12 text-primary/60" />
                </div>
              )}
            </div>

            {/* Status indicator */}
            {book.status && (
              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    book.status === "finished"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : book.status === "reading"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {book.status === "finished" ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      {getStatusLabel(book.status)}
                    </>
                  ) : book.status === "reading" ? (
                    <>
                      <Clock className="mr-1 h-4 w-4" />
                      {getStatusLabel(book.status)}
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-1 h-4 w-4" />
                      {getStatusLabel(book.status)}
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Where to read */}
            <div className="mt-6 bg-card rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-3">Where to Read</h3>
              <div className="space-y-2">
                {book.whereToRead?.length ? (
                  book.whereToRead.map((place, index) => (
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
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Book details */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-primary">Book</span>
              {book.publishedYear && (
                <span className="text-sm text-muted-foreground">
                  ({book.publishedYear})
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            {book.subtitle && (
              <h2 className="text-xl text-muted-foreground mb-3">
                {book.subtitle}
              </h2>
            )}

            <p className="text-muted-foreground mb-4">
              {[
                book.authors && (
                  <span className="font-medium">By {book.authors}</span>
                ),
                typeof book.publisher === "string"
                  ? book.publisher
                  : book.publisher?.name,
                book.isbn && `ISBN: ${book.isbn}`,
                book.pages && `${book.pages} pages`,
                book.language && `Language: ${book.language.toUpperCase()}`,
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && " • "}
                    {item}
                  </React.Fragment>
                ))}
            </p>

            {/* Genres */}
            {book.genres && book.genres.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-lg">Genres</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.genres.map((genre, index) => (
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

            {/* Awards */}
            {book.awards &&
              (book.awards.wins > 0 || book.awards.nominations > 0) && (
                <div className="mb-4">
                  <h3 className="font-medium text-lg">Awards</h3>
                  <div className="mt-2">
                    <p>
                      {book.awards.wins} wins, {book.awards.nominations}{" "}
                      nominations
                    </p>
                    {book.awards.awardsDetails?.length > 0 && (
                      <ul className="list-disc pl-5 mt-2">
                        {book.awards.awardsDetails.map((award, index) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p
                className="text-foreground"
                dangerouslySetInnerHTML={{
                  __html: book.description || "No description available.",
                }}
              ></p>
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

            {/* Suggested by or to section */}
            {book.suggestedBy && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Suggested by</h2>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 ring-2 ring-primary/20">
                    <AvatarImage
                      src={book.suggestedBy.avatar}
                      alt={book.suggestedBy.name}
                    />
                    <AvatarFallback>
                      {book.suggestedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{book.suggestedBy.name}</p>
                    {book.suggestedAt && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(book.suggestedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {book.suggestedTo && book.suggestedTo.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Suggested to</h2>
                <div className="flex flex-wrap gap-2">
                  {book.suggestedTo.map((recipient) => (
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

export default BookDetailsPage;
