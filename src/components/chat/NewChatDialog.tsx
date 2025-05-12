import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import UserService from "@/services/user.service";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (
    participantIds: string[],
    name?: string,
    isGroup?: boolean
  ) => void;
  isGroup?: boolean;
}

interface User {
  _id: string;
  fullName: string;
  avatar?: string;
  email?: string;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onOpenChange,
  onCreateChat,
  isGroup = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const userService = new UserService();
  // Mock users for demo purposes
  const mockUsers: User[] = [
    {
      _id: "user2",
      fullName: "Emma Watson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      email: "emma@example.com",
    },
    {
      _id: "user3",
      fullName: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      email: "john@example.com",
    },
    {
      _id: "user4",
      fullName: "Sophia Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      email: "sophia@example.com",
    },
    {
      _id: "user5",
      fullName: "Michael Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      email: "michael@example.com",
    },
    {
      _id: "user6",
      fullName: "Alex Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      email: "alex@example.com",
    },
  ];

  const [filteredUsers, setFilteredUsers] = useState(
    mockUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  useEffect(() => {
    userService.getUserFriends().then((res) => {
      if (res.success) {
        setFilteredUsers(
          res.data.map((user) => ({
            _id: user._id,
            fullName: user.fullNameString,
            avatar: user?.profile?.avatar?.url,
          }))
        );
      }
    });
  },[]);

  useEffect(() => {
    setFilteredUsers(
      mockUsers.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);
  const handleSelectUser = (user: User) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateChat = () => {
    if (selectedUsers.length === 0) return;

    onCreateChat(
      selectedUsers.map((user) => user._id),
      isGroup ? groupName : undefined,
      isGroup
    );

    // Reset state
    setSelectedUsers([]);
    setGroupName("");
    setSearchTerm("");
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-description="new-chat-dialog">
        <DialogHeader>
          <DialogTitle>
            {isGroup ? "Create Group Chat" : "New Message"}
          </DialogTitle>
        </DialogHeader>

        {isGroup && (
          <div className="mb-4">
            <Input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-2"
            />
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-1 bg-accent rounded-full py-1 px-2"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{user.fullName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  onClick={() => handleSelectUser(user)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <ScrollArea className="h-[200px] mt-4">
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.fullName}</p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={selectedUsers.some((u) => u._id === user._id)}
                  onCheckedChange={() => handleSelectUser(user)}
                />
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || (isGroup && !groupName)}
          >
            {isGroup ? "Create Group" : "Start Chat"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
