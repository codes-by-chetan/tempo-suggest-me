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
  PanelRight,
  PanelLeft,
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
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/lib/sidebar-context";

const DesktopSidebar = () => {
  const { collapsed, setCollapsed } = useSidebar();
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
    <motion.div
      className={cn(
        "hidden md:flex flex-col h-screen-[80%]  m-2 bg-card border-r border-border rounded-lg transition-colors relative",
        collapsed ? "w-14" : "w-56"
      )}
      initial={false}
      animate={{
        width: collapsed ? "3.5rem" : "14rem",
        transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
      }}
    >
      <div className="flex justify-end px-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={collapsed ? "collapsed" : "expanded"}
              initial={{ rotate: collapsed ? -180 : 0, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: collapsed ? 0 : -180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {collapsed ? (
                <PanelRight className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      <div className="flex-1 space-y-1 px-2">
        <TooltipProvider>
          {[
            { to: "/", icon: Home, label: "Home" },
            {
              to: "/suggested-to-me",
              icon: BookOpenCheck,
              label: "Suggested to Me",
            },
            { to: "/my-suggestions", icon: User, label: "My Suggestions" },
            { to: "/my-watchlist", icon: BookMarked, label: "My Watchlist" },
            { to: "/chat", icon: MessageCircle, label: "Messages" },
          ].map((item, index) => (
            <div key={item.to}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md transition-colors",
                      isActive(item.to)
                        ? "bg-primary-100 text-primary dark:bg-primary-900 dark:text-primary-300"
                        : "text-foreground/70 hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          className="ml-3 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.07,
                            ease: "easeOut",
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </div>

      {isAuthenticated && user && (
        <div className="py-3 px-auto border-t border-border">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/profile">
                    <Avatar className="h-10 w-10 mx-auto">
                      {user?.avatar ? (
                        <AvatarImage
                          src={user.avatar.url || "/placeholder.svg"}
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
                <motion.div
                  className="flex items-center justify-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Avatar className="h-10 w-10">
                    {user?.avatar ? (
                      <AvatarImage
                        src={user.avatar.url || "/placeholder.svg"}
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
                </motion.div>
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
    </motion.div>
  );
};

export default DesktopSidebar;
