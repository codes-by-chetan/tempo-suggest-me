import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, Users, UserPlus } from "lucide-react";
import { Chat } from "@/interfaces/chat.interfaces";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth-context";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onNewGroup,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter chats based on search term and active tab
  console.log(chats)
  const filteredChats = chats
    .filter((chat) => {
      // Filter by search term
      if (searchTerm) {
        if (chat.chatType === "private") {
          const otherParticipant = chat.participants.find(
            (p) => p._id !== user._id,
          );
          return otherParticipant?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else {
          return chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase());
        }
      }
      return true;
    })
    .filter((chat) => {
      // Filter by tab
      if (activeTab === "all") return true;
      if (activeTab === "private") return chat.chatType === "private";
      if (activeTab === "groups") return chat.chatType === "group";
      return true;
    });

  const getChatName = (chat: Chat) => {
    if (chat.chatType === "group") return chat.groupName || "Unnamed Group";
    const otherParticipant = chat.participants.find((p) => p._id !== user._id);
    return otherParticipant?.fullName || "Unknown";
  };

  const getChatAvatar = (chat: Chat) => {
    // Mock avatar
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

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="w-full h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onNewChat}
              title="New Message"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onNewGroup}
              title="New Group"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="private">Direct</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 flex-1">
          <ScrollArea className="h-[calc(100vh-235px)] md:h-[calc(100vh-235px)] lg:h-[calc(100vh-235px)] overflow-y-auto">
            <div className="p-2">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={cn(
                      "flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
                      selectedChatId === chat._id && "bg-accent",
                    )}
                    onClick={() => onSelectChat(chat._id)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={getChatAvatar(chat)} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(getChatName(chat))}
                        </AvatarFallback>
                      </Avatar>
                      {chat.chatType === "private" && (
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            "bg-green-500", // Mocked
                          )}
                        />
                      )}
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm truncate">
                          {getChatName(chat)}
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
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm
                    ? "No chats found"
                    : "No chats yet. Start a new conversation!"}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatSidebar;