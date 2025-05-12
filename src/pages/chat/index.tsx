import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import ChatSidebar from "@/components/chat/ChatSidebar";
import NewChatDialog from "@/components/chat/NewChatDialog";
import { Chat } from "@/interfaces/chat.interfaces";
import { getChats, createChat } from "@/services/chat.service";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import DesktopChatConversation from "./desktop-conversation";
import MobileChatConversation from "./mobile-conversation";

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chats, setChats] = useState<Chat[]>([]);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await getChats();
        setChats(fetchedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Listen for new messages from socket to update chat list
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      // Update the chat's last message and unread count
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === newMessage?.chatId) {
            return {
              ...chat,
              lastMessage: newMessage,
              unreadCount:
                chatId === newMessage?.chatId ? 0 : chat.unreadCount + 1,
              updatedAt: newMessage.timestamp,
            };
          }
          return chat;
        }),
      );
    };

    socket?.on("new_message", handleNewMessage);

    return () => {
      socket?.off("new_message", handleNewMessage);
    };
  }, [socket, chatId]);

  const handleCreateChat = async (
    participantIds: string[],
    name?: string,
    isGroup: boolean = false,
  ) => {
    try {
      const newChat = await createChat(participantIds, name, isGroup);
      setChats([newChat, ...chats]);
      navigate(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // Determine if we're on a small screen (mobile or tablet)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Add window resize listener to update isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="w-full pb-[10vh] md:pb-0 mx-auto h-full">
      {!chatId ? (
        // Chat List View - Only shown when no chat is selected
        <div className="h-full overflow-hidden">
          <ChatSidebar
            chats={chats}
            selectedChatId={chatId || null}
            onSelectChat={handleSelectChat}
            onNewChat={() => setShowNewChatDialog(true)}
            onNewGroup={() => setShowNewGroupDialog(true)}
          />
        </div>
      ) : (
        // Render different conversation components based on screen size and pass context directly
        <Outlet context={{ chats, setChats }} />
      )}

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
    </main>
  );
};

export default ChatPage;
