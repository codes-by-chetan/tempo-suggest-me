"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IoMdPaperPlane } from "react-icons/io"
import { useAuthDialog } from "@/lib/auth-dialog-context"

import {
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  MessageCircle,
  LogOut,
  Search,
  Library,
  Bell,
  Settings,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/lib/sidebar-context"
import { useNotifications } from "@/lib/notification-context"

const DesktopSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const { collapsed, setCollapsed } = useSidebar()
  const { showAuthDialog, hideAuthDialog } = useAuthDialog()

  const isActive = (path: string) => {
    if (path === "/profile") {
      return (
        location.pathname === path || location.pathname.startsWith("/profile/") || location.pathname === "/edit-profile"
      )
    }
    return location.pathname === path
  }

  const handleNavigation = (path: string, isProtected = false) => {
    // Close any open auth dialog when navigating
    hideAuthDialog()

    // If route is protected and user is not authenticated, show auth dialog
    if (isProtected && !isAuthenticated) {
      showAuthDialog(path, "login", true, location.pathname)
      return
    }

    navigate(path)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
      protected: false,
    },
    {
      label: "Search",
      icon: Search,
      path: "/search",
      protected: false,
    },
    {
      label: "Suggested to Me",
      icon: BookOpenCheck,
      path: "/suggested-to-me",
      protected: true,
    },
    {
      label: "My Suggestions",
      icon: IoMdPaperPlane,
      path: "/my-suggestions",
      protected: true,
    },
    {
      label: "My Content list",
      icon: Library,
      path: "/my-watchlist",
      protected: true,
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
      protected: true,
      badge: isAuthenticated ? unreadCount : 0,
    },
    {
      label: "Messages",
      icon: MessageCircle,
      path: "/chat",
      protected: true,
    },
  ]

  return (
    <div
      className={cn(
        "hidden md:flex flex-col justify-center bg-card border-r border-border transition-all duration-300  !my-auto  m-2  rounded-lg relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/suggestMeLogo.png" alt="Logo" className="h-6 w-6 hidden dark:block" />
            <img src="/suggestMeLogoDark.png" alt="Logo" className="h-6 w-6 block dark:hidden" />
            <span className="font-semibold">SuggestMe</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 p-4">
        {menuItems.map((item) => {
          const isItemActive = isActive(item.path)

          return (
            <div key={item.label} className="relative">
              <Button
                variant={isItemActive ? "default" : "ghost"}
                className={cn("w-full justify-start relative", collapsed && "justify-center px-2")}
                onClick={() => handleNavigation(item.path, item.protected)}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.label}</span>}
                {item.badge > 0 && (
                  <span
                    className={cn(
                      "absolute bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center",
                      collapsed ? "top-0 right-0 -mt-1 -mr-1" : "right-2",
                    )}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Button>
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border h-full">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn("w-full justify-start p-2", collapsed && "justify-center")}>
                <Avatar className={cn("h-8 w-8", !collapsed && "mr-3")}>
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar.url || "/placeholder.svg"} alt={user.fullNameString} />
                  ) : (
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {user.fullName.firstName.charAt(0)}
                      {user.fullName.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user.fullNameString}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
          <div className={cn("space-y-2", collapsed && "space-y-1")}>
            <Button
              variant="default"
              className={cn("w-full", collapsed && "px-2")}
              onClick={() => showAuthDialog("/profile", "login", true, location.pathname)}
            >
              {collapsed ? <User className="h-4 w-4" /> : "Sign In"}
            </Button>
            {!collapsed && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => showAuthDialog("/profile", "signup", true, location.pathname)}
              >
                Sign Up
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DesktopSidebar
