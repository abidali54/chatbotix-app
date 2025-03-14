import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Conversation {
  id: string;
  status: 'ACTIVE' | 'RESOLVED' | 'TRANSFERRED';
  messages: Message[];
  chatbot: {
    name: string;
    platform: string;
  };
}

interface Message {
  id: string;
  content: string;
  type: 'USER' | 'BOT' | 'AGENT' | 'SYSTEM';
  createdAt: string;
}

const LiveChat: NextPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { data: conversations, isLoading } = useQuery('active-conversations', async () => {
    const response = await axios.get('/api/conversations?status=ACTIVE');
    return response.data;
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post(`/api/messages`, {
        conversationId: selectedConversation,
        content: newMessage,
        type: 'AGENT'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTakeOver = async (conversationId: string) => {
    try {
      await axios.post(`/api/conversations/${conversationId}/takeover`);
    } catch (error) {
      console.error('Failed to take over conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Live Chat</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Conversations List */}
          <div className="col-span-4 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Active Conversations</h2>
            </div>
            {isLoading ? (
              <div className="p-4">Loading...</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations?.map((conversation: Conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {conversation.chatbot.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Platform: {conversation.chatbot.platform}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTakeOver(conversation.id);
                        }}
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Take Over
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Window */}
          <div className="col-span-8 bg-white rounded-lg shadow">
            {selectedConversation ? (
              <div className="h-[calc(100vh-12rem)] flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {conversations
                    ?.find((c: Conversation) => c.id === selectedConversation)
                    ?.messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${
                          message.type === 'AGENT' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block px-4 py-2 rounded-lg ${
                            message.type === 'AGENT'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-12rem)] flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;