import api from "./api.service";
import { getAccessToken } from "./notification.service";

// Unified response type for all content types
export interface ContentDetailsResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  redirect: null;
}

export interface MovieDetails {
  _id: string;
  title: string;
  slug: string;
  year: number;
  poster: Poster;
  rated: string;
  released: string;
  runtime: number;
  genres: string[];
  director: Person[];
  writers: any[];
  references: References;
  cast: Cast[];
  plot: string;
  language: string[];
  country: string;
  awards: Awards;
  ratings: Ratings;
  boxOffice: BoxOffice;
  production: Production;
  keywords: string[];
  availableOn: AvailableOn;
  isVerified: boolean;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface SeriesDetails {
  _id: string;
  title: string;
  slug: string;
  year: number;
  poster: Poster;
  rated: string;
  released: string;
  genres: string[];
  creator: Person[];
  writers: any[];
  references: References;
  cast: Cast[];
  plot: string;
  language: string[];
  country: string;
  awards: Awards;
  ratings: Ratings;
  production: Production;
  keywords: string[];
  availableOn: AvailableOn;
  isVerified: boolean;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  seasons: Season[];
  [key: string]: any;
}

export interface BookDetails {
  _id: string;
  title: string;
  slug: string;
  year: number;
  cover: Poster;
  authors: Person[];
  publisher?: string | { name: string; [key: string]: any };
  isbn: string;
  genres: string[];
  plot: string;
  language: string[];
  pages: number;
  awards: Awards;
  ratings: Ratings;
  references: References;
  keywords: string[];
  availableOn: AvailableOn;
  isVerified: boolean;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface Season {
  seasonNumber: number;
  episodeCount: number;
  episodes: Episode[];
  [key: string]: any;
}

interface Episode {
  episodeNumber: number;
  title: string;
  runtime: number;
  plot: string;
  [key: string]: any;
}

interface AvailableOn {
  streaming: any[];
  purchase: any[];
  [key: string]: any;
}

interface Production {
  companies: Company[];
  studios: any[];
  distributors: any[];
  [key: string]: any;
}

interface Company {
  _id: string;
  name: string;
  slug: string;
  tmdbId: string;
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface BoxOffice {
  budget: string;
  grossWorldwide: string;
  [key: string]: any;
}

interface Ratings {
  imdb: Imdb;
  [key: string]: any;
}

interface Imdb {
  score: number;
  votes: number;
  [key: string]: any;
}

interface Awards {
  oscars: Oscars;
  wins: number;
  nominations: number;
  awardsDetails: any[];
  [key: string]: any;
}

interface Oscars {
  wins: number;
  nominations: number;
  [key: string]: any;
}

interface Cast {
  person: Person;
  character: string;
  [key: string]: any;
}

interface References {
  imdbId: string;
  tmdbId: string;
  [key: string]: any;
}

interface Person {
  _id: string;
  name: string;
  slug: string;
  tmdbId: string;
  professions: string[];
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface Poster {
  url: string;
  publicId: string;
  [key: string]: any;
}

export interface MusicDetails {
  _id: string;
  title: string;
  slug: string;
  artist: Artist;
  featuredArtists: Artist[];
  album: Album;
  recordLabel: RecordLabel;
  musicVideo: null;
  productionCompanies: ProductionCompany[];
  releaseYear: number;
  duration: string;
  genres: any[];
  mood: any[];
  language: null;
  formats: any[];
  writers: any[];
  producers: any[];
  engineers: any[];
  remixes: any[];
  spotifyId: string;
  availableOn: MusicAvailableOn;
  awards: MusicAwards;
  ratings: MusicRatings;
  isVerified: boolean;
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface MusicRatings {
  userReviews: any[];
  [key: string]: any;
}

interface MusicAwards {
  grammys: Grammys;
  billboardMusicAwards: Grammys;
  wins: number;
  nominations: number;
  [key: string]: any;
}

interface Grammys {
  wins: number;
  nominations: number;
  [key: string]: any;
}

interface MusicAvailableOn {
  spotify: Spotify;
  [key: string]: any;
}

interface Spotify {
  plays: string;
  link: string;
  [key: string]: any;
}

interface ProductionCompany {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface RecordLabel {
  _id: string;
  name: string;
  slug: string;
  subsidiaries: any[];
  artists: any[];
  albums: any[];
  distributors: any[];
  productionCompanies: any[];
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface Album {
  _id: string;
  title: string;
  slug: string;
  releaseYear: number;
  coverImage: CoverImage;
  recordLabel: string;
  genres: any[];
  productionCompanies: any[];
  distributors: any[];
  tracks: any[];
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface CoverImage {
  url: string;
  publicId: string;
  [key: string]: any;
}

interface Artist {
  _id: string;
  name: string;
  slug: string;
  biography: string;
  profileImage: ProfileImage;
  professions: string[];
  isActive: boolean;
  createdBy: null;
  updatedBy: null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: any;
}

interface ProfileImage {
  publicId: string;
  url: string;
  _id: string;
  [key: string]: any;
}

export const getMovieDetails = async (
  movieId: string
): Promise<ContentDetailsResponse<MovieDetails>> => {
  return api
    .get(`movies/movie/details/${movieId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const getSeriesDetails = async (
  seriesId: string
): Promise<ContentDetailsResponse<SeriesDetails>> => {
  return api
    .get(`series/tv/details/${seriesId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const getBookDetails = async (
  bookId: string
): Promise<ContentDetailsResponse<BookDetails>> => {
  return api
    .get(`books/book/details/${bookId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};

export const getMusicDetails = async (
  musicId: string
): Promise<ContentDetailsResponse<MusicDetails>> => {
  return api
    .get(`musics/music/details/${musicId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err.response.data;
    });
};
