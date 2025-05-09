import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/interfaces/chat.interfaces";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = format(new Date(message.timestamp), "MMMM d, yyyy");
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <ScrollArea className="h-[calc(100vh-180px)] px-4 py-2">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {date}
            </span>
          </div>

          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const showAvatar =
              index === 0 ||
              dateMessages[index - 1].senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex mb-4",
                  isCurrentUser ? "justify-end" : "justify-start",
                )}
              >
                {!isCurrentUser && showAvatar && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    !isCurrentUser && !showAvatar && "ml-10",
                  )}
                >
                  {!isCurrentUser && showAvatar && (
                    <span className="text-xs text-muted-foreground mb-1">
                      {message.senderName}
                    </span>
                  )}

                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-sm",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent",
                    )}
                  >
                    {message.content}
                  </div>

                  {/* Suggestion preview */}
                  {message.suggestion && (
                    <Card className="mt-2 overflow-hidden max-w-xs">
                      {message.suggestion.imageUrl && (
                        <div className="h-32 w-full overflow-hidden">
                          <img
                            src={message.suggestion.imageUrl}
                            alt={message.suggestion.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1 uppercase">
                          {message.suggestion.type}
                        </div>
                        <h4 className="font-medium text-sm">
                          {message.suggestion.title}
                        </h4>
                        {message.suggestion.creator && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.suggestion.creator}{" "}
                            {message.suggestion.year &&
                              `• ${message.suggestion.year}`}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <span
                    className={cn(
                      "text-xs text-muted-foreground mt-1",
                      isCurrentUser ? "text-right" : "text-left",
                    )}
                  >
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={scrollRef} />
    </ScrollArea>
  );
};

export default ChatMessages;
