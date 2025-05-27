"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, LogIn, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AuthenticationFallbackProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function AuthenticationFallback({ title, description, icon }: AuthenticationFallbackProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto pb-[10vh] pt-0 px-4 sm:px-6 lg:px-8"
    >
      <div className="py-6">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md mx-auto shadow-social dark:shadow-social-dark border-0">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6"
              >
                {icon || <Lock className="h-10 w-10 text-primary" />}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl font-bold text-foreground mb-3"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-muted-foreground mb-8 leading-relaxed"
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button onClick={() => navigate("/login")} className="flex-1 rounded-full gap-2" size="lg">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  variant="outline"
                  className="flex-1 rounded-full gap-2"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <p className="text-xs text-muted-foreground">
                  Join our community to discover amazing content recommendations from friends and fellow enthusiasts.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
