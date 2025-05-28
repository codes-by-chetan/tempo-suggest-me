"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AuthTab } from "./AuthTab";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    fullName: z.object({
      firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" }),
      lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" }),
    }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    contactNumber: z.object({
      countryCode: z.string().default("+1"),
      number: z.string().min(1, { message: "Phone number is required" }),
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
  defaultTab?: "login" | "signup";
}

export default function AuthDialog({
  isOpen,
  onClose,
  redirectTo = "/",
  defaultTab = "login",
}: AuthDialogProps) {
  const onCloseHandler = (success: boolean) => {
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-md p-0 gap-0 max-h-[95vh] overflow-hidden [&>button]:hidden">
        <AuthTab onClose={onCloseHandler} defaultTab={defaultTab} isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  );
}
