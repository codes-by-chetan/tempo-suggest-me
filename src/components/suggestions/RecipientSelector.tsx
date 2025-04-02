import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>(
    preSelectedRecipients,
  );
  const [searchResults, setSearchResults] = useState<Recipient[]>([]);

  // Mock data for search results
  const mockUsers: Recipient[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      email: "alex@example.com",
    },
    {
      id: "2",
      name: "Jamie Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
      email: "jamie@example.com",
    },
    {
      id: "3",
      name: "Taylor Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
      email: "taylor@example.com",
    },
    {
      id: "4",
      name: "Jordan Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
      email: "jordan@example.com",
    },
    {
      id: "5",
      name: "Casey Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casey",
      email: "casey@example.com",
    },
  ];

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email &&
          user.email.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    setSearchResults(filteredResults);
  }, [searchQuery]);

  const handleSelectRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.some((r) => r.id === recipient.id)) {
      const newSelectedRecipients = [...selectedRecipients, recipient];
      setSelectedRecipients(newSelectedRecipients);
      onSelect(newSelectedRecipients);
    }
    setSearchQuery("");
  };

  const handleRemoveRecipient = (id: string) => {
    const newSelectedRecipients = selectedRecipients.filter((r) => r.id !== id);
    setSelectedRecipients(newSelectedRecipients);
    onSelect(newSelectedRecipients);
  };

  const handleComplete = () => {
    onComplete(selectedRecipients);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm flex flex-col gap-4">
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected recipients */}
      {selectedRecipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRecipients.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center gap-2 bg-gray-100 rounded-full py-1 px-3"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={recipient.avatar} alt={recipient.name} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{recipient.name}</span>
              <button
                onClick={() => handleRemoveRecipient(recipient.id)}
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
                key={user.id}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectRecipient(user)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {user.email && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
                <Checkbox
                  checked={selectedRecipients.some((r) => r.id === user.id)}
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
          {mockUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className={cn(
                "p-3 rounded-md flex items-center justify-between",
                selectedRecipients.some((r) => r.id === user.id)
                  ? "bg-gray-100"
                  : "hover:bg-gray-50 cursor-pointer",
              )}
              onClick={() => {
                if (!selectedRecipients.some((r) => r.id === user.id)) {
                  handleSelectRecipient(user);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  {user.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
              <Checkbox
                checked={selectedRecipients.some((r) => r.id === user.id)}
                onCheckedChange={() => {
                  if (selectedRecipients.some((r) => r.id === user.id)) {
                    handleRemoveRecipient(user.id);
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
            : `Send to ${selectedRecipients.length} ${selectedRecipients.length === 1 ? "person" : "people"}`}
        </Button>
      </div>
    </div>
  );
};

export default RecipientSelector;
