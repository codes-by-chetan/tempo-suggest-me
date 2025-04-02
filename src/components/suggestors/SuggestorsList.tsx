import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Suggestor {
  id: string;
  name: string;
  avatar?: string;
  suggestionCount: number;
}

interface SuggestorsListProps {
  suggestors?: Suggestor[];
  onSuggestorClick?: (suggestor: Suggestor) => void;
  className?: string;
}

const SuggestorsList = ({
  suggestors = [
    {
      id: "1",
      name: "Emma Watson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      suggestionCount: 12,
    },
    {
      id: "2",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      suggestionCount: 8,
    },
    {
      id: "3",
      name: "Sophia Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      suggestionCount: 15,
    },
    {
      id: "4",
      name: "Michael Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      suggestionCount: 6,
    },
    {
      id: "5",
      name: "Olivia Parker",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
      suggestionCount: 10,
    },
    {
      id: "6",
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      suggestionCount: 9,
    },
  ],
  onSuggestorClick = () => {},
  className = "",
}: SuggestorsListProps) => {
  if (suggestors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg shadow-sm">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground">
          No suggestors yet
        </h3>
        <p className="text-muted-foreground mt-2 text-center">
          When people suggest content to you, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-card p-4", className)}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        People who suggested to you
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suggestors.map((suggestor) => (
          <motion.div
            key={suggestor.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-300"
              onClick={() => onSuggestorClick(suggestor)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={suggestor.avatar} alt={suggestor.name} />
                    <AvatarFallback>
                      {suggestor.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg text-foreground">
                    {suggestor.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-0">
                <p className="text-sm text-muted-foreground">
                  Has suggested {suggestor.suggestionCount}{" "}
                  {suggestor.suggestionCount === 1 ? "item" : "items"} to you
                </p>
              </CardContent>
              <CardFooter className="pt-4">
                <button
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSuggestorClick(suggestor);
                  }}
                >
                  View suggestions
                </button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SuggestorsList;
