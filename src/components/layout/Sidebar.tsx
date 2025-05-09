import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
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

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div
      className={cn(
        "hidden md:flex flex-col h-[calc(100vh-64px)] bg-card border-r border-border transition-all duration-300 pt-4",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex justify-end px-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 space-y-1 px-2">
        <TooltipProvider>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    isActive("/")
                      ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Home className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Home</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Home</TooltipContent>}
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/suggested-to-me"
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    isActive("/suggested-to-me")
                      ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <BookOpenCheck className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Suggested to Me</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Suggested to Me</TooltipContent>
              )}
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/my-suggestions"
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    isActive("/my-suggestions")
                      ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <User className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">My Suggestions</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">My Suggestions</TooltipContent>
              )}
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/my-watchlist"
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    isActive("/my-watchlist")
                      ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <BookMarked className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">My Watchlist</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">My Watchlist</TooltipContent>
              )}
            </Tooltip>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/chat"
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md transition-colors",
                    isActive("/chat")
                      ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Messages</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Messages</TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {isAuthenticated && user && (
        <div className="p-3 border-t border-border">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/profile">
                    <Avatar className="h-10 w-10 mx-auto">
                      {user?.avatar ? (
                        <AvatarImage
                          src={user.avatar.url}
                          alt={user.fullNameString}
                        />
                      ) : (
                        <AvatarFallback className="bg-primary-100 text-primary-800">
                          {user.fullName.firstName.charAt(0)}
                          {user.fullName.lastName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-accent">
                  <Avatar className="h-10 w-10">
                    {user?.avatar ? (
                      <AvatarImage
                        src={user.avatar.url}
                        alt={user.fullNameString}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {user.fullName.firstName.charAt(0)}
                        {user.fullName.lastName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.fullNameString}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.fullNameString}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );

  // Mobile tab bar
  const MobileTabBar = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-2",
            isActive("/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Avatar className="h-6 w-6">
              {user?.avatar ? (
                <AvatarImage src={user.avatar.url} alt={user.fullNameString} />
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

  return (
    <>
      <DesktopSidebar />
      <MobileTabBar />
    </>
  );
};

export default Sidebar;
