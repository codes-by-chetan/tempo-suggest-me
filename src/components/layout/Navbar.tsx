import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  BookMarked,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Check,
  BookOpenCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import NotificationItem, { Notification } from "./NotificationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect as useReactEffect } from "react";
import AppName from "../tags/AppName";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get auth context
  const auth = useAuth();
  // Create state variables that will trigger re-renders when they change
  const [currentUser, setCurrentUser] = useState(auth.user);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    auth.isAuthenticated,
  );
  console.log(auth);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Update local state when auth context changes
  useReactEffect(() => {
    setCurrentUser(auth.user);
    setIsUserAuthenticated(auth.isAuthenticated);
  }, [auth.user, auth.isAuthenticated]);

  // Mock notifications data
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "suggestion",
        title: "New Suggestion",
        message: "Emma Watson suggested 'Inception' to you",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        contentType: "movie",
        user: {
          id: "1",
          name: "Emma Watson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        },
      },
      {
        id: "2",
        type: "suggestion",
        title: "New Suggestion",
        message: "John Smith suggested 'To Kill a Mockingbird' to you",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        contentType: "book",
        user: {
          id: "2",
          name: "John Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        },
      },
      {
        id: "3",
        type: "like",
        title: "New Like",
        message: "Sophia Chen liked your suggestion 'Attack on Titan'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        read: true,
        contentType: "anime",
        user: {
          id: "3",
          name: "Sophia Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
        },
      },
      {
        id: "4",
        type: "comment",
        title: "New Comment",
        message:
          "Michael Johnson commented on your suggestion 'Bohemian Rhapsody': 'Great song! I love Queen.'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        contentType: "song",
        user: {
          id: "4",
          name: "Michael Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        },
      },
      {
        id: "5",
        type: "system",
        title: "Welcome to Suggest.me",
        message:
          "Thanks for joining! Start by suggesting content to your friends or exploring suggestions made to you.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
    setUnreadCount(0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logout function
  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  // Check if the current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-card dark:bg-card border-b border-border fixed w-full z-50 top-0 left-0 shadow-social dark:shadow-social-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              
               <AppName/>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 text-sm font-medium flex items-center transition-colors",
                  isActive("/")
                    ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/suggested-to-me"
                className={cn(
                  "px-3 py-2 text-sm font-medium flex items-center transition-colors",
                  isActive("/suggested-to-me")
                    ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <BookOpenCheck className="mr-2 h-4 w-4" />
                Suggested to Me
              </Link>
              <Link
                to="/my-suggestions"
                className={cn(
                  "px-3 py-2 text-sm font-medium flex items-center transition-colors",
                  isActive("/my-suggestions")
                    ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <User className="mr-2 h-4 w-4" />
                My Suggestions
              </Link>
              <Link
                to="/my-watchlist"
                className={cn(
                  "px-3 py-2 text-sm font-medium flex items-center transition-colors",
                  isActive("/my-watchlist")
                    ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                My Watchlist
              </Link>
            </div>
          </div>

          {/* Search bar - desktop only */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search suggestions..."
                className="w-full py-1.5 pl-10 pr-4 rounded-full bg-accent/50 border-0 text-sm ring-1 ring-primary/30 focus:ring-1 focus:ring-primary/70 focus:outline-none"
              />
            </div>
          </div>

          {/* User profile dropdown and suggest button */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {/* Notification bell */}
            <DropdownMenu
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0  h-5 w-5 rounded-full bg-primary ring-2 ring-card text-[10px] text-white font-medium flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-3">
                  <DropdownMenuLabel className="p-0">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs flex items-center gap-1"
                      onClick={handleMarkAllAsRead}
                    >
                      <Check className="h-3 w-3" /> Mark all as read
                    </Button>
                  )}
                </div>
                <Separator />
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No notifications yet
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <Button variant="default" size="sm" className="rounded-full px-4">
              Suggest
            </Button>

            {isUserAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/30 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={currentUser.avatar.url}
                        alt={currentUser.fullNameString}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {currentUser.fullName.firstName.charAt(0)}{currentUser.fullName.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{currentUser.fullNameString}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {currentUser.email}
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
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn("sm:hidden", isMenuOpen ? "block" : "hidden")}>
        {/* Mobile search */}
        <div className="px-4 pt-2 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search suggestions..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-accent/50 border-0 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            to="/"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
          >
            <Home className="inline-block mr-2 h-5 w-5" />
            Home
          </Link>
          <Link
            to="/suggested-to-me"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/suggested-to-me")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
          >
            <BookMarked className="inline-block mr-2 h-5 w-5" />
            Suggested to Me
          </Link>
          <Link
            to="/my-suggestions"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/my-suggestions")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
          >
            <User className="inline-block mr-2 h-5 w-5" />
            My Suggestions
          </Link>
          <Link
            to="/my-watchlist"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/my-watchlist")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
          >
            <BookMarked className="inline-block mr-2 h-5 w-5" />
            My Watchlist
          </Link>
        </div>

        {/* Mobile profile section */}
        {isUserAuthenticated && currentUser ? (
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage
                    src={currentUser.avatar.url}
                    alt={currentUser.fullNameString}
                  />
                  <AvatarFallback className="bg-primary-100 text-primary-800">
                  {currentUser.fullName.firstName.charAt(0)}{currentUser.fullName.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{currentUser.fullNameString}</div>
                <div className="text-sm font-medium text-muted-foreground">
                  {currentUser.email}
                </div>
              </div>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0  h-5 w-5 rounded-full bg-primary ring-2 ring-card text-[10px] text-white font-medium flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-4">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
              >
                <User className="inline-block mr-2 h-5 w-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="inline-block mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex flex-col space-y-2 px-4">
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Mobile suggest button */}
        <div className="p-4 border-t border-border">
          <Button className="w-full rounded-full" variant="default">
            Suggest
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
