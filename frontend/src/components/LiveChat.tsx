import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface LiveChatProps {
  chatId: string;
}

export const LiveChat = ({ chatId }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // TODO: Implement WebSocket connection
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'User',
        content: 'Hello, I need help with integration',
        timestamp: new Date(),
      },
      {
        id: '2',
        sender: 'Agent',
        content: 'Hi! I\'d be happy to help. What specific integration are you working on?',
        timestamp: new Date(),
      },
    ];
    setMessages(mockMessages);
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Agent',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Live Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'Agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'Agent' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </Card>
  );
};