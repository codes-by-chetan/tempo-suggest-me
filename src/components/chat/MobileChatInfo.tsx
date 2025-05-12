import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/interfaces/chat.interfaces";
import { format } from "date-fns";
import { Bell, BellOff, Trash2, UserPlus, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MobileChatInfoProps {
  chat: Chat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileChatInfo: React.FC<MobileChatInfoProps> = ({
  chat,
  open,
  onOpenChange,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMMM d, yyyy");
    } catch (error) {
      return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 h-[80vh] max-h-[80vh] flex flex-col" aria-describedby="mobile-chat-info">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {chat.type === "group" ? "Group Info" : "Contact Info"}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  chat.type === "group"
                    ? chat.avatar
                    : chat.participants.find((p) => p.id !== "user1")?.avatar
                }
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {getInitials(
                  chat.type === "group"
                    ? chat.name || ""
                    : chat.participants.find((p) => p.id !== "user1")?.name ||
                        "",
                )}
              </AvatarFallback>
            </Avatar>

            <h3 className="text-xl font-semibold mt-4">
              {chat.type === "group"
                ? chat.name
                : chat.participants.find((p) => p.id !== "user1")?.name}
            </h3>

            {chat.type === "direct" && (
              <p className="text-sm text-muted-foreground">
                {chat.participants.find((p) => p.id !== "user1")?.isOnline
                  ? "Online"
                  : "Offline"}
              </p>
            )}

            {chat.type === "group" && (
              <p className="text-sm text-muted-foreground">
                {chat.participants.length} members ·{" "}
                {chat.participants.filter((p) => p.isOnline).length} online
              </p>
            )}

            <div className="w-full mt-6 space-y-6">
              {/* Media, Links, and Suggestions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Shared Content</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      No media yet
                    </p>
                  </div>
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      No links yet
                    </p>
                  </div>
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                      No suggestions yet
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      <span className="text-sm">Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BellOff className="h-4 w-4 mr-2" />
                      <span className="text-sm">Mute</span>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Members (for group chats) */}
              {chat.type === "group" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Members</h4>
                    <Button variant="ghost" size="sm" className="h-8">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {chat.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {participant.name}
                              {participant.id === "user1" && " (You)"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {participant.isAdmin ? "Admin" : "Member"} ·{" "}
                              {participant.isOnline ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                        {participant.id !== "user1" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Created date */}
              <div className="text-center text-xs text-muted-foreground">
                {chat.type === "group" ? "Group" : "Chat"} created on{" "}
                {formatDate(chat.createdAt)}
              </div>

              {/* Delete chat button */}
              <div className="pt-4">
                <Button variant="destructive" className="w-full" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {chat.type === "group" ? "Group" : "Chat"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MobileChatInfo;
