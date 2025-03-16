import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Smile } from 'lucide-react';
import { Button } from '../ui/button';

const commonEmojis = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🤔', '😍'];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 grid grid-cols-4 gap-2 p-2">
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="text-xl hover:bg-gray-100 rounded p-1"
          >
            {emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}