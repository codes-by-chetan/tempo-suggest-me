import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import MobileChatInfo from "@/components/chat/MobileChatInfo";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useChat } from "@/lib/chat-context";

const MobileChatConversation: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedChat, messages, sendMessage } = useChat();

  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      await sendMessage(chatId, content); // Note: Suggestions might need backend support
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