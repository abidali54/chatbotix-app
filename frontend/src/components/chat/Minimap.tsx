import React, { useEffect, useRef } from 'react';
import { tokenize } from '../utils/codeTokenizer';
import { ScrollArea } from '../ui/scroll-area';

interface MinimapProps {
  code: string;
  highlightedLines: number[];
  onLineClick: (lineNumber: number) => void;
  height: string;
  language: string;
  foldedSections?: { start: number; end: number }[];
}

export function Minimap({ code, highlightedLines, onLineClick, height, language, foldedSections }: MinimapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');
  const lineHeight = 2;
  const tokens = tokenize(code, language);

  const getLineColor = (line: string, idx: number) => {
    if (highlightedLines.includes(idx + 1)) return 'bg-yellow-200';
    if (foldedSections?.some(section => idx >= section.start && idx <= section.end)) {
      return 'bg-gray-400';
    }
    
    // Syntax highlighting colors
    if (line.match(/(function|class|interface|type|enum)/)) return 'bg-purple-200';
    if (line.match(/(const|let|var)/)) return 'bg-blue-200';
    if (line.match(/".*"|'.*'/)) return 'bg-green-200';
    if (line.match(/\/\/.*/)) return 'bg-gray-200';
    return 'bg-gray-300';
  };

  return (
    <ScrollArea className="w-20 border-l">
      <div 
        ref={containerRef}
        className="relative bg-gray-50 cursor-pointer"
        style={{ height }}
      >
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`
              ${getLineColor(line, idx)}
              hover:bg-blue-200 transition-colors
              ${idx % 10 === 0 ? 'border-t border-gray-200' : ''}
            `}
            style={{ height: `${lineHeight}px` }}
            onClick={() => onLineClick(idx + 1)}
            title={`Line ${idx + 1}`}
          />
        ))}
        <div className="absolute right-0 top-0 w-1 h-full">
          {highlightedLines.map(line => (
            <div
              key={`marker-${line}`}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{ top: `${(line - 1) * lineHeight}px` }}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}