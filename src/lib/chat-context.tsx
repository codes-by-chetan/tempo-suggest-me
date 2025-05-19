import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import api from "@/services/api.service";
import { toast } from "@/services/toast.service";
import {
  generateAndStoreKeyPair,
  retrievePrivateKey,
} from "@/utils/keyManagement";
import { Chat, Message } from "@/interfaces/chat.interfaces";

// // Types
// interface Chat {
//   _id: string;
//   chatType: "private" | "group";
//   participants: { _id: string; fullName: string }[];
//   groupName?: string;
//   createdAt: string;
// }

// interface Message {
//   _id: string;
//   chat: string;
//   sender: { _id: string; fullName: string };
//   content: string; // Decrypted content
//   createdAt: string;
//   readBy: { user: string; readAt: string }[];
// }

interface ChatContextType {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  hasMoreMessages: boolean;
  selectChat: (chatId: string) => void;
  loadMoreMessages: () => void;
  sendMessage: (chatId: string, content: string) => void;
  fetchChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Chat Provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [symmetricKeys, setSymmetricKeys] = useState<Map<string, CryptoKey>>(
    new Map()
  );
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // Fetch all chats for the user
  const fetchChats = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const { data } = await api.get("/chats"); // userId extracted from token
      setChats(data.data);
    } catch (error) {
      toast.error("Failed to load chats", { description: error.message });
    }
  }, [isAuthenticated, user]);

  // Fetch and import symmetric key for a chat
  const fetchSymmetricKey = useCallback(
    async (chatId: string): Promise<CryptoKey> => {
      if (symmetricKeys.has(chatId)) return symmetricKeys.get(chatId)!;
      try {
        const { data } = await api.get(`/chats/${chatId}/key`);
        const { encryptedKey } = data.data;
        const privateKey = await retrievePrivateKey(user._id);
        const encryptedKeyBuffer = Uint8Array.from(atob(encryptedKey), (c) =>
          c.charCodeAt(0)
        ).buffer;
        const symmetricKeyData = await window.crypto.subtle.decrypt(
          { name: "RSA-OAEP" },
          privateKey,
          encryptedKeyBuffer
        );
        const symmetricKey = await window.crypto.subtle.importKey(
          "raw",
          symmetricKeyData,
          { name: "AES-GCM" },
          false,
          ["encrypt", "decrypt"]
        );
        setSymmetricKeys((prev) => new Map(prev).set(chatId, symmetricKey));
        return symmetricKey;
      } catch (error) {
        toast.error("Failed to fetch chat key", { description: error.message });
        throw error;
      }
    },
    [user?._id]
  );

  // Decrypt message content using Web Crypto API
  const decryptMessageContent = async (
    content: string,
    symmetricKey: CryptoKey
  ): Promise<string> => {
    try {
      const { encrypted, iv, authTag } = JSON.parse(content);
      const encryptedData = Uint8Array.from(atob(encrypted), (c) =>
        c.charCodeAt(0)
      ).buffer;
      const ivData = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)).buffer;
      const authTagData = Uint8Array.from(atob(authTag), (c) =>
        c.charCodeAt(0)
      ).buffer;

      // Combine encrypted data and auth tag for AES-GCM
      const encryptedWithTag = new Uint8Array(
        encryptedData.byteLength + authTagData.byteLength
      );
      encryptedWithTag.set(new Uint8Array(encryptedData), 0);
      encryptedWithTag.set(
        new Uint8Array(authTagData),
        encryptedData.byteLength
      );

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: ivData,
          additionalData: undefined,
          tagLength: 128,
        },
        symmetricKey,
        encryptedWithTag
      );
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      return "[Decryption Failed]";
    }
  };

  // Fetch messages for a chat
  const fetchMessages = useCallback(
    async (chatId: string, pageNum: number) => {
      try {
        let { data } = await api.get(`/chats/${chatId}/messages`, {
          params: { page: pageNum, limit: 100 },
        });
        data = data.data;
        if (data.length < 100) setHasMoreMessages(false);
        const symmetricKey = await fetchSymmetricKey(chatId);
        const decryptedMessages = await Promise.all(
          data.map(async (msg: Message) => ({
            ...msg,
            content: await decryptMessageContent(msg.content, symmetricKey),
          }))
        );
        return decryptedMessages;
      } catch (error) {
        toast.error("Failed to load messages", { description: error.message });
        return [];
      }
    },
    [fetchSymmetricKey]
  );

  // Select a chat and load its messages
  const selectChat = useCallback(
    async (chatId: string) => {
      const chat = chats.find((c) => c._id === chatId);
      console.log(chats);
      console.log(selectedChat);
      if (!chat) return;
      setSelectedChat(chat);
      
      
      setPage(1);
      setHasMoreMessages(true);
      setMessages([]);
      const initialMessages = await fetchMessages(chatId, 1);
      setMessages(initialMessages);
    },
    [chats, fetchMessages]
  );

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedChat || !hasMoreMessages) return;
    const nextPage = page + 1;
    const newMessages = await fetchMessages(selectedChat._id, nextPage);
    setMessages((prev) => [...newMessages, ...prev]);
    setPage(nextPage);
  }, [selectedChat, page, hasMoreMessages, fetchMessages]);

  // Encrypt message content using Web Crypto API
  const encryptMessage = async (content: string, symmetricKey: CryptoKey) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
    const encodedContent = new TextEncoder().encode(content);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      symmetricKey,
      encodedContent
    );
    const encryptedArray = new Uint8Array(encryptedData);
    const authTagLength = 16; // 128 bits
    const encrypted = encryptedArray.slice(
      0,
      encryptedArray.length - authTagLength
    );
    const authTag = encryptedArray.slice(encryptedArray.length - authTagLength);
    return {
      encrypted: btoa(String.fromCharCode(...encrypted)),
      iv: btoa(String.fromCharCode(...iv)),
      authTag: btoa(String.fromCharCode(...authTag)),
    };
  };

  // Send a message
  const sendMessage = useCallback(
    async (chatId: string, content: string) => {
      if (!isAuthenticated || !user || !socket) return;
      try {
        const symmetricKey = await fetchSymmetricKey(chatId);
        const { encrypted, iv, authTag } = await encryptMessage(
          content,
          symmetricKey
        );
        await api.post("/messages", {
          chatId,
          senderId: user._id,
          content: JSON.stringify({ encrypted, iv, authTag }),
          createdBy: user._id,
        });
      } catch (error) {
        toast.error("Failed to send message", { description: error.message });
      }
    },
    [isAuthenticated, user, socket, fetchSymmetricKey]
  );

  // Listen for new messages
  useEffect(() => {
    if (!socket || !user) return;

    socket.on(
      "newMessage",
      async ({ chatId, message }: { chatId: string; message: Message }) => {
        const chat = chats.find((c) => c._id === chatId);
        if (!chat) return;

        // Decrypt the message
        const symmetricKey = await fetchSymmetricKey(chatId);
        const decryptedMessage = {
          ...message,
          content: await decryptMessageContent(message.content, symmetricKey),
        };

        // If the message is for the currently selected chat, add it to messages
        if (selectedChat?._id === chatId) {
          setMessages((prev) => [...prev, decryptedMessage]);
        }

        // Show toast notification if the message is from another chat
        if (selectedChat?._id !== chatId) {
          const senderName = message.sender.fullName || "Unknown";
          const chatName =
            chat.chatType === "group" ? chat.groupName : senderName;
          toast.info(`New message from ${chatName}`, {
            description: decryptedMessage.content,
          });
        }
      }
    );

    return () => {
      socket.off("newMessage");
    };
  }, [socket, user, chats, selectedChat, fetchSymmetricKey]);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Generate key pair on first login
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const checkAndGenerateKeyPair = async () => {
      try {
        await retrievePrivateKey(user._id);
      } catch (error) {
        if (error.message === "Private key not found") {
          try {
            await generateAndStoreKeyPair(user._id);
            toast.info("Encryption keys generated successfully");
          } catch (keyGenError) {
            toast.error("Failed to generate encryption keys", {
              description: keyGenError.message,
            });
          }
        } else {
          toast.error("Failed to access encryption keys", {
            description: error.message,
          });
        }
      }
    };
    checkAndGenerateKeyPair();
  }, [isAuthenticated, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        fetchChats,
        selectedChat,
        messages,
        hasMoreMessages,
        selectChat,
        loadMoreMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use ChatContext
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
