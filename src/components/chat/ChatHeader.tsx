import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, Phone, Video, MoreVertical, Users } from "lucide-react";
import { Chat } from "@/interfaces/chat.interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";

interface ChatHeaderProps {
  chat: Chat;
  onViewInfo: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onViewInfo }) => {
  const { user } = useAuth();

  const getChatName = () => {
    if (chat.chatType === "group") return chat.groupName || "Unnamed Group";
    const otherParticipant = chat.participants.find((p) => p._id !== user._id);
    return otherParticipant?.fullName || "Unknown";
  };

  const getChatAvatar = () => {
    // Mock avatar since it's not in the schema
    if (chat.chatType === "group") return "";
    const otherParticipant = chat.participants.find((p) => p._id !== user._id);
    return otherParticipant ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.fullName}` : "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getOnlineStatus = () => {
    // Mock online status since it's not in the schema
    if (chat.chatType === "group") {
      return `${chat.participants.length} members`;
    } else {
      const otherParticipant = chat.participants.find((p) => p._id !== user._id);
      return otherParticipant ? "Online" : "Offline"; // Mocked
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card w-full">
      <div className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={getChatAvatar()} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(getChatName())}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 overflow-hidden">
          <h3 className="font-medium truncate">{getChatName()}</h3>
          <p className="text-xs text-muted-foreground flex items-center">
            {chat.chatType === "group" && <Users className="h-3 w-3 mr-1" />}
            {getOnlineStatus()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hidden sm:flex"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hidden sm:flex"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onViewInfo}
        >
          <Info className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Search</DropdownMenuItem>
            <DropdownMenuSeparator />
            {chat.chatType === "group" ? (
              <>
                <DropdownMenuItem>Add members</DropdownMenuItem>
                <DropdownMenuItem>Leave group</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>Block user</DropdownMenuItem>
                <DropdownMenuItem>Clear chat</DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;