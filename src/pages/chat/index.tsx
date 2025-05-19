import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import ChatSidebar from "@/components/chat/ChatSidebar";
import NewChatDialog from "@/components/chat/NewChatDialog";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import { useChat } from "@/lib/chat-context";
import api from "@/services/api.service";

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { chats, selectChat, fetchChats } = useChat();

  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);

  const handleCreateChat = async (
    participantIds: string[],
    name?: string,
    isGroup: boolean = false
  ) => {
    try {
      const response = await api.post(
        "/chats",

        {
          participants: participantIds,
          groupName: name,
          chatType: isGroup ? "group" : "private",
          createdBy: user._id,
        }
      );
      if (!response.status) throw new Error("Failed to create chat");
      const newChat = await response.data.data;
      navigate(`/chat/${newChat._id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId); // Use ChatContext's selectChat to load messages
    navigate(`/chat/${chatId}`);
  };
  const initialise = async () => {
    fetchChats().then(()=>{if (chatId) {
      handleSelectChat(chatId);
    }})
    // if (chatId) {
    //   handleSelectChat(chatId);
    // }
  };

  useEffect(() => {
    initialise();
  }, []);
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
        // Render different conversation components based on screen size
        <Outlet />
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
