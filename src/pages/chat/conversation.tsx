import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatInfo from "@/components/chat/ChatInfo";
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

const ChatConversation: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, setChats } = useOutletContext<ContextType>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1024);

  // Get selected chat object
  const selectedChat = chats.find((chat) => chat.id === chatId);

  // Add window resize listener to update isSmallScreen
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBackToList}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <ChatHeader
            chat={selectedChat}
            onViewInfo={() =>
              isSmallScreen ? setShowMobileInfo(true) : setShowInfo(!showInfo)
            }
          />
        </div>
      </div>

      <div className="flex h-full overflow-hidden">
        <div
          className={`flex-1 flex flex-col ${showInfo && !isSmallScreen ? "lg:w-2/3" : "w-full"}`}
        >
          <ChatMessages
            messages={messages}
            currentUserId={user?._id || "user1"}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            onSendSuggestion={handleSendSuggestion}
            isLoading={isLoading}
          />
        </div>

        {/* Chat Info Sidebar - Only visible on large screens */}
        {showInfo && !isSmallScreen && (
          <div className="hidden lg:block lg:w-1/3 border-l border-border">
            <ChatInfo chat={selectedChat} onClose={() => setShowInfo(false)} />
          </div>
        )}
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

export default ChatConversation;
