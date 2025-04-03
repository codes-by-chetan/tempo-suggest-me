// This is a mock API service that simulates backend calls
// In a real application, this would make actual HTTP requests to your backend

import { User } from "./types";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ContentItem {
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
  suggestedTo?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  suggestedAt: string;
  status?: "unwatched" | "watching" | "watched";
}

export interface Suggestor {
  id: string;
  name: string;
  avatar?: string;
  suggestionCount: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  mutualFriends?: number;
}

// Mock data
const mockSuggestors: Suggestor[] = [
  {
    id: "1",
    name: "Emma Watson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    suggestionCount: 12,
  },
  {
    id: "2",
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    suggestionCount: 8,
  },
  {
    id: "3",
    name: "Sophia Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
    suggestionCount: 15,
  },
  {
    id: "4",
    name: "Michael Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    suggestionCount: 6,
  },
  {
    id: "5",
    name: "Olivia Parker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
    suggestionCount: 10,
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    suggestionCount: 9,
  },
];

const mockSuggestionsToMe: ContentItem[] = [
  {
    id: "1",
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
  },
  {
    id: "2",
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
  },
  {
    id: "3",
    title: "Attack on Titan",
    type: "anime",
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80",
    year: "2013",
    creator: "Hajime Isayama",
    description:
      "In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
    suggestedAt: "2023-06-10T09:15:00Z",
  },
];
