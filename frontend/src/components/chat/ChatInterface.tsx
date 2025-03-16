import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { EmojiPicker } from './EmojiPicker';
import { format } from 'date-fns';
import { ThreadView } from './ThreadView';
import ReactMarkdown from 'react-markdown';
import { QuotedMessage } from './QuotedMessage';
import { useHotkeys } from 'react-hotkeys-hook';
import { detectLanguage } from '@/utils/codeDetection';
import useSound from 'use-sound';
import { ChatSettings } from './ChatSettings';
import { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  reactions?: string[];
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
  isEdited?: boolean;
  readBy?: string[];
  replyTo?: string;
  format?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  thread?: Message[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { isConnected, lastMessage, sendMessage, error } = useWebSocket('ws://your-websocket-server-url', {
    reconnectAttempts: 5,
    reconnectInterval: 3000
  });
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((groups, message) => {
      const date = format(new Date(message.timestamp), 'MMMM d, yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {} as Record<string, Message[]>);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const messageId = Date.now().toString();
    setUploadProgress({ [messageId]: 0 });

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[messageId] || 0;
        return current < 100 ? { ...prev, [messageId]: current + 10 } : prev;
      });
    }, 500);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate file upload - replace with actual API call
      const fileUrl = URL.createObjectURL(file);
      const newMessage = {
        id: Date.now().toString(),
        text: '',
        sender: 'user',
        timestamp: new Date(),
        status: 'sending',
        attachment: {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: fileUrl,
          name: file.name
        }
      };
      
      setMessages(prev => [...prev, newMessage]);
      await sendMessage({ type: 'file', file: fileUrl });
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    } catch (err) {
      console.error('File upload failed:', err);
    }
    clearInterval(interval);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
          : msg
      )
    );
  };

  const filteredMessages = messages.filter(msg => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedMessages = groupMessagesByDate(filteredMessages);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditText(message.text);
    }
  };

  const saveEdit = async (messageId: string) => {
    if (!editText.trim()) return;
    
    try {
      await sendMessage({ type: 'edit', messageId, text: editText });
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: editText, isEdited: true }
          : msg
      ));
      setEditingMessageId(null);
    } catch (err) {
      console.error('Failed to edit message:', err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await sendMessage({ type: 'delete', messageId });
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [formatting, setFormatting] = useState({ bold: false, italic: false, underline: false });

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    setInput('');
  };

  const handleForward = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setInput(message.text);
    }
  };

  const toggleFormat = (type: 'bold' | 'italic' | 'underline') => {
    setFormatting(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const formatText = (text: string, format: Message['format']) => {
    let formattedText = text;
    if (format?.bold) formattedText = `**${formattedText}**`;
    if (format?.italic) formattedText = `_${formattedText}_`;
    if (format?.underline) formattedText = `__${formattedText}__`;
    return formattedText;
  };

  // Update message rendering
  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-2 border-b">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border-gray-300 text-sm"
        />
      </div>
      {error && (
        <div className="bg-red-50 p-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      {!isConnected && !error && (
        <div className="bg-yellow-50 p-4 text-yellow-600 text-sm">
          Connecting to chat server...
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {date}
              </span>
            </div>
            const [notifications, setNotifications] = useState<Record<string, number>>({});
            const [quotedMessage, setQuotedMessage] = useState<Message | null>(null);
            
            useHotkeys('ctrl+b', () => toggleFormat('bold'), []);
            useHotkeys('ctrl+i', () => toggleFormat('italic'), []);
            useHotkeys('ctrl+u', () => toggleFormat('underline'), []);
            useHotkeys('escape', () => {
              setQuotedMessage(null);
              setReplyingTo(null);
            }, []);
            
            const handleQuote = (message: Message) => {
              setQuotedMessage(message);
              setInput(`> ${message.text}\n\n`);
            };
            const [playNotification] = useSound('/sounds/notification.mp3');

            // Add new keyboard shortcuts
            useHotkeys('ctrl+q', () => quotedMessage && handleQuote(quotedMessage), [quotedMessage]);
            useHotkeys('ctrl+r', () => replyingTo && handleReply(replyingTo), [replyingTo]);
            useHotkeys('ctrl+shift+c', () => {
              setInput('```\n\n```');
              // Move cursor between the backticks
              const textarea = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(4, 4);
              }
            }, []);

            // Update thread reply handler with sound
            const handleThreadReply = async (messageId: string, text: string) => {
              // ... existing thread reply logic ...
              playNotification();
              setNotifications(prev => ({
                ...prev,
                [messageId]: (prev[messageId] || 0) + 1
              }));
            };

            // Add code block detection and formatting
            const formatMessage = (text: string) => {
              const codeBlockRegex = /```([\s\S]*?)```/g;
              let formattedText = text;
              
              formattedText = formattedText.replace(codeBlockRegex, (match, code) => {
                const language = detectLanguage(code.trim());
                return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
              });

              return formattedText;
            };

            const handleSendMessage = async () => {
              if (!input.trim()) return;
              
              const formattedText = formatMessage(input);
              // ... rest of send message logic using formattedText ...
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
                <Card className="md:col-span-2 flex flex-col">
                  {/* ... existing chat interface ... */}
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        {quotedMessage?.id === message.id && (
                          <QuotedMessage
                            text={message.text}
                            sender={message.sender}
                            timestamp={message.timestamp}
                          />
                        )}
                        <div className="flex items-center justify-between">
                          {/* ... existing message content ... */}
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleQuote(message)}>
                              <Quote className="h-4 w-4" />
                            </Button>
                            {message.thread?.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveThread(message.id)}
                                className="relative"
                              >
                                {message.thread.length} replies
                                {notifications[message.id] > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {notifications[message.id]}
                                  </span>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t p-4">
                    {quotedMessage && (
                      <div className="mb-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">
                          Quoting: {quotedMessage.text.substring(0, 50)}...
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => setQuotedMessage(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(message.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMessage(message.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm text-gray-500">
              Replying to: {messages.find(m => m.id === replyingTo)?.text}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex space-x-2 mb-2">
          <Button
            variant={formatting.bold ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleFormat('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={formatting.italic ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleFormat('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={formatting.underline ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleFormat('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected}
        >
          <PaperClip className="h-4 w-4" />
        </Button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 rounded-md border-gray-300"
          placeholder={isConnected ? "Type your message..." : "Connecting..."}
          disabled={!isConnected}
        />
        <Button onClick={handleSendMessage} disabled={!isConnected}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}


import { ChatSettings } from './ChatSettings';
import { useState, useEffect } from 'react';

export function ChatInterface() {
  // Update code options state
  const [codeOptions, setCodeOptions] = useState({
    theme: 'auto', // 'auto', 'github', 'dracula', 'vs', 'monokai'
    showLineNumbers: true,
    maxHeight: '300px',
    defaultCollapsed: false
  });

  // Add theme preview samples
  const [previewSamples] = useState({
    javascript: `function example() {\n  console.log("Hello");\n  return 42;\n}`,
    python: `def calculate(x, y):\n    return x * y + sum([1, 2, 3])`,
    typescript: `interface User {\n  name: string;\n  age: number;\n}`,
  });

  // Update ChatSettings rendering
  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-2 border-b flex justify-between items-center">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border-gray-300 text-sm"
        />
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <ChatSettings
          codeOptions={codeOptions}
          onCodeOptionsChange={setCodeOptions}
          previewSamples={previewSamples}
          volume={volume}
          onVolumeChange={setVolume}
        >
          <div className="mt-4 space-y-4">
            {Object.entries(previewSamples).map(([lang, code]) => (
              <div key={lang} className="border rounded p-4">
                <h3 className="text-sm font-medium mb-2">{lang} Preview</h3>
                <CodePreview
                  code={code}
                  language={lang}
                  theme={codeOptions.theme === 'auto' ? 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dracula' : 'github') : 
                    codeOptions.theme}
                  showLineNumbers={codeOptions.showLineNumbers}
                  maxHeight={codeOptions.maxHeight}
                />
              </div>
            ))}
          </div>
        </ChatSettings>
      )}

      {/* Update message rendering */}
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodePreview
                code={String(children).replace(/\n$/, '')}
                language={match[1]}
                theme={codeOptions.theme}
                showLineNumbers={codeOptions.showLineNumbers}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {message.text}
      </ReactMarkdown>
    </Card>
  );
}