import React, { useState, useEffect, useCallback, useRef } from "react";
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
import NotificationItem from "./NotificationItem";
import SearchResultsPopup from "./SearchResultsPopup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AppName from "../tags/AppName";
import { globalSearch, searchPeople } from "@/services/search.service";
import debounce from "lodash.debounce";
import { useNotifications } from "@/lib/notification-context";

// Hook to detect clicks outside a ref
const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalResults, setGlobalResults] = useState<any>(null);
  const [peopleResults, setPeopleResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close search popup on outside click
  useOutsideClick(desktopSearchRef, () => setDesktopSearchOpen(false));
  useOutsideClick(mobileSearchRef, () => setMobileSearchOpen(false));

  useEffect(() => {
    console.log("peopleResults:", peopleResults); // Debug peopleResults state
  }, [peopleResults]);

  useEffect(() => {
    const closePopups = () => {
      setDesktopSearchOpen(false);
      setMobileSearchOpen(false);
    };
    document.addEventListener("closeSearchPopups", closePopups);
    return () => {
      document.removeEventListener("closeSearchPopups", closePopups);
    };
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim().length < 1) {
        setGlobalResults(null);
        setPeopleResults(null);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setDesktopSearchOpen(true); // Open popup for desktop
        setMobileSearchOpen(true); // Open popup for mobile
        const [global, people] = await Promise.all([
          globalSearch({ searchTerm: term }),
          searchPeople({ searchTerm: term }),
        ]);
        setGlobalResults(global.data.results);
        setPeopleResults(people.data);
        console.log("Search results:", {
          global: global.data.results,
          people: people.data,
        });
      } catch (error) {
        console.error("Search error:", error);
        setGlobalResults(null);
        setPeopleResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  useEffect(() => {
    performSearch(searchTerm);
    return () => {
      performSearch.cancel(); // Clean up debounce on unmount
    };
  }, [searchTerm, performSearch]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle input focus to ensure typing and open popup
  const handleInputFocus = (isDesktop: boolean) => {
    if (isDesktop) {
      desktopInputRef.current?.focus();
      setDesktopSearchOpen(searchTerm.length > 0 ? true : false);
    } else {
      mobileInputRef.current?.focus();
      setMobileSearchOpen(searchTerm.length > 0 ? true : false);
    }
  };

  return (
    <nav className="bg-card dark:bg-card border-b border-border fixed w-full z-50 top-0 left-0 shadow-social dark:shadow-social-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <AppName />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 text-sm font-medium flex items-center transition-colors",
                  isActive("/")
                    ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
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
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
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
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
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
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                My Watchlist
              </Link>
            </div>
          </div>

          {/* Search bar - desktop only */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div ref={desktopSearchRef} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                ref={desktopInputRef}
                type="text"
                placeholder="Search suggestions..."
                className="w-full py-1.5 pl-10 pr-4 rounded-full bg-accent/50 border-0 text-sm ring-1 ring-primary/30 focus:ring-1 focus:ring-primary/70 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => handleInputFocus(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInputFocus(true);
                }}
              />
              {desktopSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full z-[1000]">
                  <SearchResultsPopup
                    globalResults={globalResults}
                    peopleResults={peopleResults}
                    isSearching={isSearching}
                  />
                </div>
              )}
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
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary ring-2 ring-card text-[10px] text-white font-medium flex items-center justify-center">
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
                      onClick={markAllAsRead}
                    >
                      <Check className="h-3 w-3" />
                      Mark all as read
                    </Button>
                  )}
                </div>
                <Separator />
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    notifications
                      .slice(0, 5) // Show only the latest 5 notifications
                      .map((notification) => (
                        <NotificationItem
                          key={notification._id}
                          notification={{
                            id: notification._id,
                            type: notification.type,
                            title:
                              notification.type === "Suggestion"
                                ? "New Suggestion"
                                : notification.type === "Like"
                                ? "New Like"
                                : notification.type === "Comment"
                                ? "New Comment"
                                : notification.type === "System"
                                ? "System Notification"
                                : notification.type === "FollowRequest"
                                ? "Follow Request"
                                : notification.type === "FollowAccepted"
                                ? "Follow Accepted"
                                : notification.type === "FollowedYou"
                                ? "Followed You"
                                : notification.type === "NewContent"
                                ? "New Content"
                                : notification.type === "Mention"
                                ? "Mention"
                                : "Notification",
                            message: notification.message,
                            timestamp: notification.createdAt,
                            read: notification.status === "Read",
                            contentType:
                              notification.relatedContent?.contentType,
                            user: notification.sender
                              ? {
                                  id: notification.sender._id,
                                  fullName: notification.sender.fullName,
                                  fullNameString:
                                    notification.sender.fullNameString ||
                                    `${notification.sender.fullName.firstName} ${notification.sender.fullName.lastName}`,
                                  avatar:
                                    notification.sender.avatar?.url || null,
                                }
                              : undefined,
                          }}
                          onMarkAsRead={() => markAsRead(notification._id)}
                        />
                      ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No notifications yet
                    </div>
                  )}
                </ScrollArea>
                <Separator />
                <div className="p-3">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigate("/notifications")}
                  >
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <Button variant="default" size="sm" className="rounded-full px-4">
              Suggest
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/30 transition-all"
                  >
                    <Avatar className="h-9 w-9">
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
                  </Button>
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
          <div ref={mobileSearchRef} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search suggestions..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-accent/50 border-0 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => handleInputFocus(false)}
              onClick={(e) => {
                e.stopPropagation();
                handleInputFocus(false);
              }}
            />
            {mobileSearchOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[1000]">
                <SearchResultsPopup
                  globalResults={globalResults}
                  peopleResults={peopleResults}
                  isSearching={isSearching}
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 pb-3 space-y-1 px-4">
          <Link
            to="/"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground"
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
                : "text-foreground/70 hover:bg-accent hover:text-foreground"
            )}
          >
            <BookOpenCheck className="inline-block mr-2 h-5 w-5" />
            Suggested to Me
          </Link>
          <Link
            to="/my-suggestions"
            className={cn(
              "block px-3 py-2 text-base font-medium",
              isActive("/my-suggestions")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground"
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
                : "text-foreground/70 hover:bg-accent hover:text-foreground"
            )}
          >
            <BookMarked className="inline-block mr-2 h-5 w-5" />
            My Watchlist
          </Link>
        </div>

        {/* Mobile profile section */}
        {isAuthenticated && user ? (
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
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
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">
                  {user.fullNameString}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {user.email}
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
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary ring-2 ring-card text-[10px] text-white font-medium flex items-center justify-center">
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
