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
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Mobile tab bar
const MobileTabBar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/chat") {
      return (
        location.pathname === path || location.pathname.startsWith("/chat/")
      );
    }
    return location.pathname === path;
  };

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

        <Link
          to="/suggested-to-me"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/suggested-to-me")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpenCheck className="h-5 w-5" />
          <span className="text-xs mt-1">Suggested</span>
        </Link>

        <Link
          to="/my-suggestions"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/my-suggestions")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">My Suggestions</span>
        </Link>

        <Link
          to="/my-watchlist"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/my-watchlist")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookMarked className="h-5 w-5" />
          <span className="text-xs mt-1">Watchlist</span>
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
