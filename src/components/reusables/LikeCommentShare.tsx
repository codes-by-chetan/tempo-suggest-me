import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Heart, MessageCircle, Share2, SmilePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { log } from "console";

function LikeCommentShare() {
  const [emojiPanel, setEmojiPanel] = useState(false);
  const emojiPickerRef = useRef(null);
  const [reactions, setReactions] = useState<string[]>([]);
  const [emojiEvent, setEmojiEvent] = useState(null);

  useEffect(() => {
    function handleClickOutside(emojiEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        console.log(emojiPickerRef);
        console.log(emojiPickerRef.current);
        console.log(emojiPickerRef.current.cont);
    
        
        
        setEmojiPanel(!emojiPanel);
      }
    }

    if (emojiPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPanel]);

  const updateReactions = (emoji: string) => {
    console.log(reactions);

    setReactions([...reactions, emoji]);
  };

  return (
    <div className="flex items-center justify-between mb-4 relative z-50">
      {/* Social media style interaction buttons */}

      <Button
        variant="ghost"
        size="sm"
        className="rounded-full p-2 h-auto flex justify-center items-center"
        onClick={() => setEmojiPanel(!emojiPanel)}
      >
        {reactions.length > 0 ? (
          <div className="flex gap-2"><div className="flex justify-center items-center">{reactions}</div> <div className="bg-slate-100 p-1 rounded-full"> <SmilePlus size={15}/></div> </div>
        ) : (
          <SmilePlus className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
        <Share2 className="h-4 w-4 text-muted-foreground" />
      </Button>
      {emojiPanel && (
        <div className="absolute z-50">
          <EmojiPicker
            onEmojiClick={(emojiData: EmojiClickData,event:MouseEvent) => {
              console.log(event);
              
              updateReactions(emojiData.emoji);
              setEmojiPanel(!emojiPanel);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default LikeCommentShare;
