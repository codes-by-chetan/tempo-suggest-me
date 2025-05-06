import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Smile } from "lucide-react";
import { Button } from "react-day-picker";
import { Input } from "../ui/input";
import EmojiPicker from "emoji-picker-react";

interface CommentBoxProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: (data: { note?: string }) => void;
}

const CommentBox = ({
  open,
  onOpenChange = () => {},
  onComplete = () => {},
}: CommentBoxProps) => {
  console.log("open", open);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  return (
    <>
    
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={"new-suggestion-dialogue-box-content"}
        aria-description={"new-suggestion-dialogue-box-content"}
        className="sm:max-w-[600px] md:max-w-[800px] p-0 overflow-auto max-h-[90vh] bg-background border-border"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Add a comment...
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 relative">
          <div className="flex items-center gap-2 mt-4 border border-blue-400 rounded-md p-1 ">
            <Input className="border-0 focus:border-0 focus:ring-0 focus:outline-none outline-none ring-0 focus-visible:ring-0 focus-visible:shadow-none" />

            <button className="pr-2" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
              <Smile />
            </button>
          </div>

            
        </div>
        rrrrrrrrrr
      </DialogContent>
    </Dialog>
    {
                openEmojiPicker && (
                    <div className="border border-red-500 flex absolute z-[1000] "><EmojiPicker className=""/></div>
                )
            }

    </>
  );
};

export default CommentBox;
