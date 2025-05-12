import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import MobileChatInfo from "@/components/chat/MobileChatInfo";
import { Chat, Message } from "@/interfaces/chat.interfaces";
import {
  getChatMessages,
  sendMessage,
  markChatAsRead,
} from "@/services/chat.service";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ContextType = {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
};

const MobileChatConversation: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, setChats } = useOutletContext<ContextType>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get selected chat object
  const selectedChat = chats.find((chat) => chat.id === chatId);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const fetchedMessages = await getChatMessages(chatId);
        setMessages(fetchedMessages);

        // Mark chat as read
        await markChatAsRead(chatId);

        // Update unread count in chats list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, setChats]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      // If the message is for the current chat, add it to messages
      if (chatId === newMessage?.chatId) {
        setMessages((prev) => [...prev, newMessage]);

        // Mark as read immediately
        markChatAsRead(chatId).catch(console.error);

        // Update chat in the list
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                lastMessage: newMessage,
                unreadCount: 0,
                updatedAt: newMessage.timestamp,
              };
            }
            return chat;
          }),
        );
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, chatId, setChats]);

  const handleSendMessage = async (content: string) => {
    if (!chatId || !content.trim()) return;

    try {
      setIsLoading(true);
      const newMessage = await sendMessage(chatId, content);

      // Update messages
      setMessages([...messages, newMessage]);

      // Update chat's last message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: newMessage,
                updatedAt: newMessage.timestamp,
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSuggestion = async (content: string, suggestion: any) => {
    if (!chatId) return;

    try {
      setIsLoading(true);
      const newMessage = await sendMessage(
        chatId,
        content,
        undefined,
        suggestion,
      );

      // Update messages
      setMessages([...messages, newMessage]);

      // Update chat's last message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: newMessage,
                updatedAt: newMessage.timestamp,
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Error sending suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to go back to chat list
  const handleBackToList = () => {
    navigate("/chat");
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Chat not found</p>
          <Button onClick={handleBackToList}>Back to Chats</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] fixed inset-0 top-16 bg-background z-10">
      {/* Mobile Header with back button */}
      <div className="sticky top-0 z-20 bg-background">
        <div className="flex items-center border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="ml-1"
            onClick={handleBackToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <ChatHeader
              chat={selectedChat}
              onViewInfo={() => setShowMobileInfo(true)}
            />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          messages={messages}
          currentUserId={user?._id || "user1"}
        />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="sticky bottom-0 w-full bg-background z-10">
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendSuggestion={handleSendSuggestion}
          isLoading={isLoading}
        />
      </div>

      {/* Mobile Chat Info Dialog */}
      <MobileChatInfo
        chat={selectedChat}
        open={showMobileInfo}
        onOpenChange={setShowMobileInfo}
      />
    </div>
  );
};

export default MobileChatConversation;
