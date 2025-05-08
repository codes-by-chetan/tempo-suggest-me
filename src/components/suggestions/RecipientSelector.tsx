import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import UserService from "@/services/user.service";
import { searchPeople } from "@/services/search.service";
import { useAuth } from "@/lib/auth-context";

export interface Recipient {
  fullName: FullName;
  profile: friendProfile;
  [key: string]: any;
}
interface friendProfile {
  avatar: Avatar;
  isVerified: boolean;
  [key: string]: any;
}
interface Avatar {
  publicId: string;
  url: string;
  [key: string]: any;
}

interface FullName {
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface RecipientSelectorProps {
  onSelect?: (recipients: Recipient[]) => void;
  onBack?: () => void;
  onComplete?: (recipients: Recipient[]) => void;
  preSelectedRecipients?: Recipient[];
}

const RecipientSelector = ({
  onSelect = () => {},
  onBack = () => {},
  onComplete = () => {},
  preSelectedRecipients = [],
}: RecipientSelectorProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>(
    preSelectedRecipients
  );
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);

  // Mock data for search results
  const [users, setUsers] = useState<Recipient[]>([]);
  const userService = new UserService();
  // Filter users based on search query
  const searchPeoples = useCallback(async () => {
    console.log("searchPeople : ", searchQuery);

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const peoples = (await searchPeople({ searchTerm: searchQuery })).data;
    const filteredResults = peoples.data.filter((people) => {
      if (people._id === user._id) return;
      return {
        _id: people._id,
        fullName: people.fullName,
        profile: {
          avatar: people.profile.avatar,
          isVerified: people.profile.isVerified,
          displayName: people.profile?.displayName || "",
        },
        fullNameString: people?.fullNameString || "",
      };
    });

    setSearchResults(filteredResults);
  }, [searchQuery]);
  useEffect(() => {
    searchPeoples();
  }, [searchQuery]);
  useEffect(() => {
    userService.getUserFriends().then((res) => {
      if (res.success) {
        setUsers(res.data);
      }
    });
  }, []);

  const handleSelectRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.some((r) => r._id === recipient._id)) {
      const newSelectedRecipients = [...selectedRecipients, recipient];
      setSelectedRecipients(newSelectedRecipients);
      onSelect(newSelectedRecipients);
    }
    setSearchQuery("");
  };

  const handleRemoveRecipient = (id: string) => {
    console.log(id);
    const newSelectedRecipients = selectedRecipients.filter(
      (r) => r._id !== id
    );
    setSelectedRecipients(newSelectedRecipients);
    console.log(selectedRecipients);
    onSelect(newSelectedRecipients);
  };

  const handleComplete = () => {
    onComplete(selectedRecipients);
  };

  return (
    <div className="w-full bg-white dark:bg-muted p-6 rounded-lg shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Select Recipients</h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search for friends by name or email..."
          value={searchQuery}
          onChange={(e) => {
            console.log(e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="pl-10"
        />
      </div>

      {/* Selected recipients */}
      {selectedRecipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRecipients.map((recipient) => (
            <div
              key={recipient._id}
              className="flex items-center gap-2 bg-gray-100 dark:bg-muted-foreground rounded-full py-1 px-3"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={recipient.profile?.avatar?.url}
                  alt={recipient.name}
                />
                <AvatarFallback>
                  {recipient.fullName.firstName.charAt(0)}
                  {recipient.fullName.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{recipient.fullNameString}</span>
              <button
                onClick={() => handleRemoveRecipient(recipient._id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <ul className="divide-y">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectRecipient(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.profile?.avatar?.url}
                      alt={user.fullNameString}
                    />
                    <AvatarFallback>
                      {user.fullName.firstName.charAt(0)}
                      {user.fullName.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullNameString}</p>
                    {user.displayName && (
                      <p className="text-sm text-gray-500">
                        {user.displayName}
                      </p>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={selectedRecipients.some((r) => r._id === user._id)}
                  onCheckedChange={() => handleSelectRecipient(user)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested recipients */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested</h3>
        <div className="grid grid-cols-1 gap-2">
          {users.slice(0, 3).map((user) => (
            <div
              key={user._id}
              className={cn(
                "p-3 rounded-md flex items-center justify-between",
                selectedRecipients.some((r) => r._id === user._id)
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-700"
              )}
              onClick={() => {
                if (!selectedRecipients.some((r) => r.id === user.id)) {
                  handleSelectRecipient(user);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={user.profile?.avatar?.url}
                    alt={user.fullNameString}
                  />
                  <AvatarFallback>
                    {user.fullName.firstName.charAt(0)}
                    {user.fullName.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.fullNameString}</p>
                  {user.displayName && (
                    <p className="text-sm text-gray-500">{user.displayName}</p>
                  )}
                </div>
              </div>
              <Checkbox
                checked={selectedRecipients.some((r) => r._id === user._id)}
                onCheckedChange={() => {
                  if (selectedRecipients.some((r) => r._id === user._id)) {
                    handleRemoveRecipient(user._id);
                  } else {
                    handleSelectRecipient(user);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={selectedRecipients.length === 0}
        >
          {selectedRecipients.length === 0
            ? "Select Recipients"
            : `Send to ${selectedRecipients.length} ${
                selectedRecipients.length === 1 ? "person" : "people"
              }`}
        </Button>
      </div>
    </div>
  );
};

export default RecipientSelector;
