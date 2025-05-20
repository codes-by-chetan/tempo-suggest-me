import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatInfo from "@/components/chat/ChatInfo";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/chat-context";
import { useConversation } from "@/services/conversation.service";

const DesktopChatConversation: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const { chats } = useChat();
  const { messages, hasMoreMessages, fetchMessages, sendMessage } = useConversation(chatId || "");
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedChat = chats.find((chat) => chat._id === chatId);

  const handleSendMessage = async (content: string) => {
    if (!chatId || !content.trim()) return;
    try {
      setIsLoading(true);
      await sendMessage(chatId, content);
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
      await sendMessage(chatId, content); // Suggestions might need backend support
    } catch (error) {
      console.error("Error sending suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!chatId || !hasMoreMessages) return;
    try {
      await fetchMessages(chatId, messages.length / 100 + 1);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
  };

  if (!selectedChat || !chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={`flex-1 flex flex-col ${showInfo ? "lg:w-2/3" : "w-full"}`}
      >
        <ChatHeader
          chat={selectedChat}
          onViewInfo={() => setShowInfo(!showInfo)}
        />
        <ChatMessages
          messages={messages}
          currentUserId={user?._id || "user1"}
          onLoadMore={handleLoadMore}
          hasMoreMessages={hasMoreMessages}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendSuggestion={handleSendSuggestion}
          isLoading={isLoading}
        />
      </div>

      {/* Chat Info Sidebar */}
      {showInfo && (
        <div className="hidden lg:block lg:w-1/3 border-l border-border">
          <ChatInfo chat={selectedChat} onClose={() => setShowInfo(false)} />
        </div>
      )}
    </div>
  );
};

export default DesktopChatConversation;