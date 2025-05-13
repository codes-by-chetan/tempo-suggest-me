import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Chat, Participant } from "@/interfaces/chat.interfaces";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";

interface ChatListItemProps {
  chat: Chat;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

function ChatListItem({
  chat,
  selectedChatId,
  onSelectChat,
}: ChatListItemProps) {
    console.log(chat)
  const [chatPartner, setChatPartner] = useState<Participant | null>(null);
  const { user } = useAuth();

  const setChatData = useCallback(() => {
    if (chat.chatType === "private") {
      chat.participants.forEach((participant) => {
        if (participant._id !== user._id) {
          setChatPartner(participant);
        }
      });
    }
  }, [chat]);

  useEffect(() => {
    setChatData();
  }, []);

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };
  return (
    <div
      key={chat._id}
      className={cn(
        "flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
        selectedChatId === chat._id && "bg-accent"
      )}
      onClick={() => onSelectChat(chat._id)}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chatPartner?.profile?.avatar?.url} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chatPartner?.fullName?.firstName.toLocaleUpperCase().charAt(0)}
            {chatPartner?.fullName?.lastName.toLocaleUpperCase().charAt(0)}
          </AvatarFallback>
        </Avatar>
        {chat.chatType === "private" && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              "bg-green-500" // Mocked
            )}
          />
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">
            {chatPartner?.fullNameString || chat?.groupName || "Unknown"}
          </h3>
          <span className="text-xs text-muted-foreground">
            {formatTime(chat.updatedAt || chat.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
            {chat.lastMessage?.content || "No messages yet"}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
