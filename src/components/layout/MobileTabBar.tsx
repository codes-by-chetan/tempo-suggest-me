"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, User, Search, Library, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import AuthDialog from "./AuthDialog"

// Mobile tab bar
const MobileTabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { unreadCount } = useNotifications()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [authDialog, setAuthDialog] = useState<{
    isOpen: boolean
    redirectTo: string
    defaultTab: "login" | "signup"
  }>({
    isOpen: false,
    redirectTo: "/",
    defaultTab: "login",
  })

  const contentPaths = ["/my-watchlist", "/suggested-to-me", "/my-suggestions"]

  const isActive = (path: string) => {
    if (path === "/chat") {
      return location.pathname === path || location.pathname.startsWith("/chat/")
    }
    if (path === "/profile") {
      return (
        location.pathname === path || location.pathname.startsWith("/profile/") || location.pathname === "/edit-profile"
      )
    }
    return location.pathname === path
  }

  const isContentTabActive = contentPaths.some((path) => isActive(path))

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      setAuthDialog({
        isOpen: true,
        redirectTo: path,
        defaultTab: "login",
      })
    } else {
      navigate(path)
    }
  }

  const handleContentClick = () => {
    if (!isAuthenticated) {
      setAuthDialog({
        isOpen: true,
        redirectTo: "/my-watchlist",
        defaultTab: "login",
      })
    } else {
      setIsDialogOpen(true)
    }
  }

  return (
    <>
      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-card border-t border-border z-1000">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2",
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          {/* Content Tab */}
          {isAuthenticated ? (
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 py-2",
                    isContentTabActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Library className="h-5 w-5" />
                  <span className="text-xs mt-1">Content</span>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-40 bg-card border border-border p-2 rounded-md z-50">
                  <Dialog.Title className="text-sm font-semibold mb-2">Select Content</Dialog.Title>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/my-watchlist"
                      onClick={() => setIsDialogOpen(false)}
                      className={cn(
                        "p-1 rounded-md text-center text-sm",
                        isActive("/my-watchlist")
                          ? "bg-primary text-primary-foreground cursor-not-allowed"
                          : "text-foreground hover:bg-muted",
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
                          : "text-foreground hover:bg-muted",
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
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      My Suggestions
                    </Link>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          ) : (
            <button
              onClick={handleContentClick}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2",
                isContentTabActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Library className="h-5 w-5" />
              <span className="text-xs mt-1">Content</span>
            </button>
          )}

          <Link
            to="/search"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2",
              isActive("/search") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>

          {/* Notifications Tab */}
          <button
            onClick={() => handleProtectedNavigation("/notifications")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 relative",
              isActive("/notifications") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Bell className="h-5 w-5" />
            {isAuthenticated && unreadCount > 0 && (
              <span className="absolute top-1 right-1/3 translate-x-2 h-4 w-4 rounded-full bg-primary ring-1 ring-card text-[10px] text-white font-medium flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <span className="text-xs mt-1">Alerts</span>
          </button>

          {/* Profile Tab - Always visible */}
          <button
            onClick={() => handleProtectedNavigation("/profile")}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2",
              isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isAuthenticated && user ? (
              <Avatar className="h-6 w-6">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar.url || "/placeholder.svg"} alt={user.fullNameString} />
                ) : (
                  <AvatarFallback className="bg-primary-100 text-primary-800 text-xs">
                    {user.fullName.firstName.charAt(0)}
                    {user.fullName.lastName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      <AuthDialog
        isOpen={authDialog.isOpen}
        onClose={() => setAuthDialog({ ...authDialog, isOpen: false })}
        redirectTo={authDialog.redirectTo}
        defaultTab={authDialog.defaultTab}
      />
    </>
  )
}

export default MobileTabBar
