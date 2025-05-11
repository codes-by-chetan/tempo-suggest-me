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

interface ChatHeaderProps {
  chat: Chat;
  onViewInfo: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onViewInfo }) => {
  const getChatName = () => {
    if (chat.type === "group") return chat.name;
    const otherParticipant = chat.participants.find((p) => p.id !== "user1");
    return otherParticipant?.name || "Unknown";
  };

  const getChatAvatar = () => {
    if (chat.type === "group") return chat.avatar;
    const otherParticipant = chat.participants.find((p) => p.id !== "user1");
    return otherParticipant?.avatar;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getOnlineStatus = () => {
    if (chat.type === "group") {
      const onlineCount = chat.participants.filter((p) => p.isOnline).length;
      return `${onlineCount} online`;
    } else {
      const otherParticipant = chat.participants.find((p) => p.id !== "user1");
      return otherParticipant?.isOnline ? "Online" : "Offline";
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
            {chat.type === "group" && <Users className="h-3 w-3 mr-1" />}
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
            {chat.type === "group" ? (
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
