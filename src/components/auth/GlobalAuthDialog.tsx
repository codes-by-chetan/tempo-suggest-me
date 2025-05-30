"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useAuth } from "@/lib/auth-context"
import { useAuthDialog } from "@/lib/auth-dialog-context"
import { AuthTab } from "../layout/AuthTab"
import { isProtectedRoute } from "@/lib/route-config"

export const GlobalAuthDialog: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { authDialog, hideAuthDialog } = useAuthDialog()
  const navigate = useNavigate()

  const findSafeRoute = (targetRoute: string): string => {
    // If target route is not protected, it's safe
    if (!isProtectedRoute(targetRoute)) {
      return targetRoute
    }

    // If target route is protected, return home
    return "/"
  }

  const handleClose = (success = false) => {
    if (success && isAuthenticated) {
      // If authentication was successful, navigate to the intended route
      navigate(authDialog.redirectTo)
    } else if (authDialog.isProtectedRoute && !isAuthenticated) {
      // For protected routes, navigate to a safe route
      const safeRoute = findSafeRoute(authDialog.previousRoute || "/")
      navigate(safeRoute)
    }
    // For unprotected routes, user stays on current page (no navigation needed)

    hideAuthDialog()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
  }

  return (
    <Dialog open={authDialog.isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">Authentication Required</DialogTitle>
      <DialogContent
        className="sm:max-w-md p-0 gap-0 max-h-[95vh] overflow-hidden [&>button]:hidden"
        onEscapeKeyDown={() => handleClose()}
        onPointerDownOutside={() => handleClose()}
      >
        <AuthTab onClose={handleClose} defaultTab={authDialog.defaultTab} isOpen={authDialog.isOpen} />
      </DialogContent>
    </Dialog>
  )
}
