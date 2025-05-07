export interface GlobalSearchResponse {
  statusCode: number;
  data: GSearchResults;
  message: string;
  success: boolean;
  redirect: null;
}

interface GSearchResults {
  results: GlobalSearchResults;
  pagination: Pagination;
  [key: string]: any;
}

interface Pagination {
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
  [key: string]: any;
}

interface GlobalSearchResults {
  movie: Movie;
  series: Movie;
  book: Book;
  music: Music;
  songs: Music;
  album: Album;
  musicVideo: Album;
  video: Album;
  people: People;
  performance: Album;
  productionCompanie: Album;
  studio: Album;
  publisher: Album;
  recordLabel: Album;
  [key: string]: any;
}

interface People {
  data: Datum4[];
  total: number;
  [key: string]: any;
}

interface Datum4 {
  _id: string;
  name: string;
  slug: string;
  profileImage: ProfileImage;
  matchReason: string;
  [key: string]: any;
}

interface ProfileImage {
  publicId: string;
  url: string;
  [key: string]: any;
}

interface Album {
  data: any[];
  total: number;
  [key: string]: any;
}

interface Music {
  data: Datum3[];
  total: number;
  [key: string]: any;
}

interface Datum3 {
  spotifyId: string;
  title: string;
  slug: string;
  poster: string;
  plot: string;
  year: number;
  matchReason: string;
  [key: string]: any;
}

interface Book {
  data: Datum2[];
  total: number;
  [key: string]: any;
}

interface Datum2 {
  googleBooksId: string;
  title: string;
  slug: string;
  poster: string;
  plot: string;
  year: number;
  matchReason: string;
  [key: string]: any;
}

interface Movie {
  data: Datum[];
  total: number;
  [key: string]: any;
}

interface Datum {
  imdbId: string;
  title: string;
  slug: string;
  poster: string;
  plot: string;
  year: number;
  matchReason: string;
  [key: string]: any;
}

export interface PeopleSearchResponse {
  statusCode: number;
  data: PeopleSearchResult;
  message: string;
  success: boolean;
  redirect: null;
}

interface PeopleSearchResult {
  data: user[];
  pagination: Pagination;
  [key: string]: any;
}

interface user {
  _id: string;
  fullName: FullName;
  email: string;
  profile: Profile;
  [key: string]: any;
}

interface Profile {
  _id: string;
  user: string;
  preferences: Preferences;
  isPublic: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdBy: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  avatar: Avatar;
  updatedBy: string;
  bio: string;
  displayName: string;
  socialLinks: SocialLinks;
  [key: string]: any;
}

interface SocialLinks {
  twitter: string;
  instagram: string;
  website: string;
  [key: string]: any;
}

interface Avatar {
  publicId: string;
  url: string;
  [key: string]: any;
}

interface Preferences {
  favoriteGenres: string[];
  preferredContentTypes: string[];
  [key: string]: any;
}

interface FullName {
  firstName: string;
  lastName: string;
  [key: string]: any;
}
