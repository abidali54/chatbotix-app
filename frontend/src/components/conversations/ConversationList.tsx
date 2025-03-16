import React from 'react';
import { Card } from '../ui/card';
import { MessageSquare, Clock } from 'lucide-react';

interface Conversation {
  id: string;
  user: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'completed';
}

const conversations: Conversation[] = [
  {
    id: '1',
    user: 'John Smith',
    lastMessage: 'How can I reset my password?',
    timestamp: '5 min ago',
    status: 'active'
  },
  {
    id: '2',
    user: 'Sarah Wilson',
    lastMessage: 'Thanks for your help!',
    timestamp: '1 hour ago',
    status: 'completed'
  }
];

export function ConversationList() {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className={`h-5 w-5 ${
                conversation.status === 'active' ? 'text-green-500' : 'text-gray-400'
              }`} />
              <div>
                <h4 className="font-medium">{conversation.user}</h4>
                <p className="text-sm text-gray-500">{conversation.lastMessage}</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {conversation.timestamp}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}