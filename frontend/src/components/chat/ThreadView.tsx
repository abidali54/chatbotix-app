import React from 'react';
import { Card } from '../ui/card';
import { Message } from './types';
import { formatRelativeTime } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface ThreadViewProps {
  message: Message;
  thread: Message[];
  onClose: () => void;
  onReply: (text: string) => void;
}

export function ThreadView({ message, thread, onClose, onReply }: ThreadViewProps) {
  const [reply, setReply] = useState('');

  return (
    <Card className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">Thread</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500 mb-1">Original message</div>
          {message.text}
        </div>
        {thread.map((reply) => (
          <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
            <div className="text-sm text-gray-500 mb-1">
              {reply.sender === 'user' ? 'You' : 'Bot'} • {formatRelativeTime(reply.timestamp)}
            </div>
            {reply.text}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onReply(reply)}
          placeholder="Reply in thread..."
          className="w-full rounded-md border-gray-300"
        />
      </div>
    </Card>
  );
}