export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
  suggestion?: SuggestionPreview;
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "file";
  url: string;
  name?: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface SuggestionPreview {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  creator?: string;
  year?: string;
}

export interface Chat {
  id: string;
  type: "direct" | "group";
  name?: string; // For group chats
  avatar?: string; // For group chats or direct chat with user avatar
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean; // For group chats
  isOnline?: boolean;
  lastSeen?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdBy: string;
  participants: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}
