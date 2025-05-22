import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  BookMarked,
  BookOpenCheck,
  MessageCircle,
  Search,
  Library,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

// Mobile tab bar
const MobileTabBar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const contentPaths = [
    "/my-watchlist",
    "/suggested-to-me",
    "/my-suggestions",
  ];

  const isActive = (path: string) => {
    if (path === "/chat") {
      return (
        location.pathname === path || location.pathname.startsWith("/chat/")
      );
    }
    return location.pathname === path;
  };

  const isContentTabActive = contentPaths.some((path) => isActive(path));

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="md:hidden sticky bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2",
                isContentTabActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Library className="h-5 w-5" />
              <span className="text-xs mt-1">Content</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-40 bg-card border border-border p-2 rounded-md z-50">
              <Dialog.Title className="text-sm font-semibold mb-2">
                Select Content
              </Dialog.Title>
              <div className="flex flex-col gap-1">
                <Link
                  to="/my-watchlist"
                  onClick={() => setIsDialogOpen(false)}
                  className={cn(
                    "p-1 rounded-md text-center text-sm",
                    isActive("/my-watchlist")
                      ? "bg-primary text-primary-foreground cursor-not-allowed"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  Watchlist
                </Link>
                <Link
                  to="/suggested-to-me"
                  onClick={() => setIsDialogOpen(false)}
                  className={cn(
                    "p-1 rounded-md text-center text-sm",
                    isActive("/suggested-to-me")
                      ? "bg-primary text-primary-foreground cursor-not-allowed"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  Suggested
                </Link>
                <Link
                  to="/my-suggestions"
                  onClick={() => setIsDialogOpen(false)}
                  className={cn(
                    "p-1 rounded-md text-center text-sm",
                    isActive("/my-suggestions")
                      ? "bg-primary text-primary-foreground cursor-not-allowed"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  My Suggestions
                </Link>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Link
          to="/search"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/search")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
        </Link>

        <Link
          to="/chat"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/chat")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs mt-1">Messages</span>
        </Link>

        {isAuthenticated && user && (
          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2",
              isActive("/profile")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Avatar className="h-6 w-6">
              {user?.avatar ? (
                <AvatarImage
                  src={user.avatar.url || "/placeholder.svg"}
                  alt={user.fullNameString}
                />
              ) : (
                <AvatarFallback className="bg-primary-100 text-primary-800 text-xs">
                  {user.fullName.firstName.charAt(0)}
                  {user.fullName.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileTabBar;