import React, { useState } from "react";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Logout function
  const handleLogout = () => {
    logout();
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
              <Link to="/" className="text-2xl font-bold">
                <span className="text-primary">Suggest</span>
                <span className="text-primary-600">.me</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
              <Link
                to="/"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                  isActive("/")
                    ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/suggested-to-me"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                  isActive("/suggested-to-me")
                    ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                Suggested to Me
              </Link>
              <Link
                to="/my-suggestions"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                  isActive("/my-suggestions")
                    ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground",
                )}
              >
                <User className="mr-2 h-4 w-4" />
                My Suggestions
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
                className="w-full py-1.5 pl-10 pr-4 rounded-full bg-accent/50 border-0 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {/* User profile dropdown and suggest button */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-card"></span>
            </Button>

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
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary-100 text-primary-800">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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
              "block px-3 py-2 rounded-md text-base font-medium",
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
              "block px-3 py-2 rounded-md text-base font-medium",
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
              "block px-3 py-2 rounded-md text-base font-medium",
              isActive("/my-suggestions")
                ? "bg-primary-50 text-primary dark:bg-primary-900 dark:text-primary-300"
                : "text-foreground/70 hover:bg-accent hover:text-foreground",
            )}
          >
            <User className="inline-block mr-2 h-5 w-5" />
            My Suggestions
          </Link>
        </div>

        {/* Mobile profile section */}
        {isAuthenticated && user ? (
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-800">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user.name}</div>
                <div className="text-sm font-medium text-muted-foreground">
                  {user.email}
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
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
