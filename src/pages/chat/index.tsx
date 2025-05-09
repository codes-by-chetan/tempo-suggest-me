import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatInfo from "@/components/chat/ChatInfo";
import NewChatDialog from "@/components/chat/NewChatDialog";
import { Chat, Message } from "@/interfaces/chat.interfaces";
import {
  getChats,
  getChatMessages,
  sendMessage,
  createChat,
  markChatAsRead,
} from "@/services/chat.service";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chatId || null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  // Get selected chat object
  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await getChats();
        setChats(fetchedChats);

        // If no chat is selected and we have chats, select the first one
        if (!selectedChatId && fetchedChats.length > 0) {
          setSelectedChatId(fetchedChats[0].id);
          navigate(`/chat/${fetchedChats[0].id}`);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (!selectedChatId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const fetchedMessages = await getChatMessages(selectedChatId);
        setMessages(fetchedMessages);

        // Mark chat as read
        await markChatAsRead(selectedChatId);

        // Update unread count in chats list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === selectedChatId ? { ...chat, unreadCount: 0 } : chat,
          ),
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    navigate(`/chat/${selectedChatId}`);
  }, [selectedChatId]);

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      // If the message is for the current chat, add it to messages
      if (selectedChatId === newMessage.chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // Update the chat's last message and unread count
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === newMessage.chatId) {
            return {
              ...chat,
              lastMessage: newMessage,
              unreadCount:
                selectedChatId === newMessage.chatId ? 0 : chat.unreadCount + 1,
              updatedAt: newMessage.timestamp,
            };
          }
          return chat;
        }),
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, selectedChatId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId || !content.trim()) return;

    try {
      setIsLoading(true);
      const newMessage = await sendMessage(selectedChatId, content);

      // Update messages
      setMessages([...messages, newMessage]);

      // Update chat's last message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: newMessage,
                updatedAt: newMessage.timestamp,
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSuggestion = async (content: string, suggestion: any) => {
    if (!selectedChatId) return;

    try {
      setIsLoading(true);
      const newMessage = await sendMessage(
        selectedChatId,
        content,
        undefined,
        suggestion,
      );

      // Update messages
      setMessages([...messages, newMessage]);

      // Update chat's last message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage: newMessage,
                updatedAt: newMessage.timestamp,
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error("Error sending suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async (
    participantIds: string[],
    name?: string,
    isGroup: boolean = false,
  ) => {
    try {
      const newChat = await createChat(participantIds, name, isGroup);
      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.id);
      navigate(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto h-[calc(100vh-64px)]">
        <div className="grid grid-cols-12 h-full">
          {/* Chat Sidebar */}
          <div className="col-span-3 border-r border-border">
            <ChatSidebar
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
              onNewChat={() => setShowNewChatDialog(true)}
              onNewGroup={() => setShowNewGroupDialog(true)}
            />
          </div>

          {/* Chat Main Area */}
          <div
            className={`${showInfo ? "col-span-6" : "col-span-9"} flex flex-col`}
          >
            {selectedChat ? (
              <>
                <ChatHeader
                  chat={selectedChat}
                  onViewInfo={() => setShowInfo(!showInfo)}
                />
                <ChatMessages
                  messages={messages}
                  currentUserId={user?._id || "user1"}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onSendSuggestion={handleSendSuggestion}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Welcome to Chat
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Select a conversation or start a new one
                  </p>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => setShowNewChatDialog(true)}
                  >
                    Start a new conversation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Info Sidebar */}
          {showInfo && selectedChat && (
            <div className="col-span-3">
              <ChatInfo
                chat={selectedChat}
                onClose={() => setShowInfo(false)}
              />
            </div>
          )}
        </div>
      </main>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onCreateChat={handleCreateChat}
      />

      {/* New Group Dialog */}
      <NewChatDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        onCreateChat={handleCreateChat}
        isGroup
      />
    </div>
  );
};

export default ChatPage;
