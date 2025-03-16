import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface QuotedMessageProps {
  text: string;
  sender: string;
  timestamp: Date;
}

export function QuotedMessage({ text, sender, timestamp }: QuotedMessageProps) {
  return (
    <div className="border-l-4 border-gray-300 pl-3 my-2 bg-gray-50 rounded">
      <div className="text-sm text-gray-500 mb-1">
        {sender} • {new Date(timestamp).toLocaleTimeString()}
      </div>
      <SyntaxHighlighter
        language="markdown"
        style={vscDarkPlus}
        customStyle={{ background: 'transparent', padding: '0' }}
      >
        {text}
      </SyntaxHighlighter>
    </div>
  );
}