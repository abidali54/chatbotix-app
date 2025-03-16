import React, { useState, useEffect } from 'react';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../ui/button';
import { Copy, Check, ChevronDown, ChevronUp, Maximize, Minimize } from 'lucide-react';
import { CodeSearch } from './CodeSearch';
import { diffLines } from 'diff';

interface CodePreviewProps {
  code: string;
  language: string;
  theme: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  previousVersion?: string;
  showDiff?: boolean;
}

export function CodePreview({ code, language, theme, showLineNumbers = true, maxHeight = '300px', previousVersion, showDiff }: CodePreviewProps) {
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const getDiffHighlighting = () => {
    if (!showDiff || !previousVersion) return null;
    
    const differences = diffLines(previousVersion, code);
    let lineNumber = 0;
    
    return differences.map(part => {
      const lines = part.value.split('\n').filter(line => line);
      const currentLineNumber = lineNumber;
      lineNumber += lines.length;
      
      return {
        value: part.value,
        added: part.added,
        removed: part.removed,
        lineStart: currentLineNumber + 1
      };
    });
  };

  const diffHighlighting = getDiffHighlighting();

  return (
    <div className="relative group border rounded">
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{language}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-200 ${isCollapsed ? 'h-0' : ''}`}
           style={{ maxHeight: isExpanded ? 'none' : maxHeight }}>
        <SyntaxHighlighter
          language={language}
          style={themes[systemTheme]}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{ margin: 0 }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      
      {showSearch && (
        <CodeSearch
          code={code}
          onHighlight={setHighlightedLines}
        />
      )}
      
      <div className="overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={themes[theme]}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: highlightedLines.includes(lineNumber) 
                ? 'rgba(255, 255, 0, 0.2)'
                : diffHighlighting 
                  ? getDiffLineColor(lineNumber, diffHighlighting)
                  : undefined
            }
          })}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function getDiffLineColor(lineNumber: number, diffs: any[]) {
  for (const diff of diffs) {
    if (lineNumber >= diff.lineStart && lineNumber < diff.lineStart + diff.value.split('\n').length) {
      if (diff.added) return 'rgba(0, 255, 0, 0.1)';
      if (diff.removed) return 'rgba(255, 0, 0, 0.1)';
    }
  }
  return undefined;
}