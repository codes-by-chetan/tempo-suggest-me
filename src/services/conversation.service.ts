import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import api from "@/services/api.service";
import { toast } from "@/services/toast.service";
import { retrievePrivateKey } from "@/utils/keyManagement";
import { Message } from "@/interfaces/chat.interfaces";

interface ConversationService {
  messages: Message[];
  hasMoreMessages: boolean;
  fetchMessages: (chatId: string, page: number) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
}

export const useConversation = (chatId: string): ConversationService => {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [symmetricKey, setSymmetricKey] = useState<CryptoKey | null>(null);
  const [page, setPage] = useState(1);

  // Fetch and import symmetric key for a chat
  const fetchSymmetricKey = useCallback(async (chatId: string): Promise<CryptoKey> => {
    if (symmetricKey) return symmetricKey;
    try {
      const { data } = await api.get(`/chats/${chatId}/keys`);
      const { encryptedKey } = data.data;
      const privateKey = await retrievePrivateKey(user._id);
      const encryptedKeyBuffer = Uint8Array.from(atob(encryptedKey), (c) => c.charCodeAt(0)).buffer;
      const symmetricKeyData = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedKeyBuffer
      );
      const key = await window.crypto.subtle.importKey(
        "raw",
        symmetricKeyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
      setSymmetricKey(key);
      return key;
    } catch (error) {
      toast.error("Failed to fetch chat key", { description: error.message });
      throw error;
    }
  }, [user?._id, symmetricKey]);

  // Decrypt message content
  const decryptMessageContent = async (content: string, symmetricKey: CryptoKey): Promise<string> => {
    try {
      const { encrypted, iv, authTag } = JSON.parse(content);
      const encryptedData = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0)).buffer;
      const ivData = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)).buffer;
      const authTagData = Uint8Array.from(atob(authTag), (c) => c.charCodeAt(0)).buffer;

      const encryptedWithTag = new Uint8Array(encryptedData.byteLength + authTagData.byteLength);
      encryptedWithTag.set(new Uint8Array(encryptedData), 0);
      encryptedWithTag.set(new Uint8Array(authTagData), encryptedData.byteLength);

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
        const { data } = await api.get(`/chats/${chatId}/messages`, {
          params: { page: pageNum, limit: 100 },
        });
        if (data.data.length < 100) setHasMoreMessages(false);
        const symmetricKey = await fetchSymmetricKey(chatId);
        const decryptedMessages = await Promise.all(
          data.data.map(async (msg: Message) => ({
            ...msg,
            content: await decryptMessageContent(msg.content, symmetricKey),
          }))
        );
        setMessages((prev) => (pageNum === 1 ? decryptedMessages : [...decryptedMessages, ...prev]));
        setPage(pageNum);
      } catch (error) {
        toast.error("Failed to load messages", { description: error.message });
      }
    },
    [fetchSymmetricKey]
  );

  // Encrypt message content
  const encryptMessage = async (content: string, symmetricKey: CryptoKey) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedContent = new TextEncoder().encode(content);
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      symmetricKey,
      encodedContent
    );
    const encryptedArray = new Uint8Array(encryptedData);
    const authTagLength = 16;
    const encrypted = encryptedArray.slice(0, encryptedArray.length - authTagLength);
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
        const { encrypted, iv, authTag } = await encryptMessage(content, symmetricKey);
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

  // Listen for new messages for this chat
  useEffect(() => {
    if (!socket || !user || !chatId) return;

    socket.on("newMessage", async ({ chatId: incomingChatId, message }: { chatId: string; message: Message }) => {
      if (incomingChatId === chatId) {
        const symmetricKey = await fetchSymmetricKey(chatId);
        const decryptedMessage = {
          ...message,
          content: await decryptMessageContent(message.content, symmetricKey),
        };
        setMessages((prev) => [...prev, decryptedMessage]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, user, chatId, fetchSymmetricKey]);

  // Fetch initial messages when chatId changes
  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setPage(1);
      setHasMoreMessages(true);
      fetchMessages(chatId, 1);
    }
  }, [chatId]);

  return {
    messages,
    hasMoreMessages,
    fetchMessages,
    sendMessage,
  };
};