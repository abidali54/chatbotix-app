import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Search, ArrowUp, ArrowDown, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';
import { Minimap } from './Minimap';
import { Switch } from '../ui/switch';

interface CodeSection {
  start: number;
  end: number;
  label: string;
  isCollapsed: boolean;
}

interface CodeSearchProps {
  code: string;
  onHighlight: (lineNumbers: number[]) => void;
  onFold: (sections: CodeSection[]) => void;
  language: string;
}

export function CodeSearch({ code, onHighlight, onFold, language }: CodeSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);
  const [sections, setSections] = useState<CodeSection[]>([]);
  const [diffMode, setDiffMode] = useState<'inline' | 'split'>('inline');

  useEffect(() => {
    // Detect code sections (functions, classes, etc.)
    const detectSections = () => {
      const lines = code.split('\n');
      const newSections: CodeSection[] = [];
      let currentSection: CodeSection | null = null;

      lines.forEach((line, index) => {
        // Customize section detection based on language
        const sectionStart = detectSectionStart(line, language);
        if (sectionStart) {
          if (currentSection) {
            currentSection.end = index;
            newSections.push(currentSection);
          }
          currentSection = {
            start: index + 1,
            end: lines.length,
            label: sectionStart,
            isCollapsed: false
          };
        }
      });

      if (currentSection) {
        newSections.push(currentSection);
      }

      setSections(newSections);
      onFold(newSections);
    };

    detectSections();
  }, [code, language]);

  // Add new state
  const [useRegex, setUseRegex] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);

  // Update language patterns
  const patterns: Record<string, RegExp[]> = {
    javascript: [
      /function\s+(\w+)/, 
      /class\s+(\w+)/,
      /const\s+(\w+)\s*=\s*(?:function|\()/,
      /(\w+)\s*:\s*(?:function|\()/
    ],
    python: [
      /def\s+(\w+)/,
      /class\s+(\w+)/,
      /async\s+def\s+(\w+)/
    ],
    typescript: [
      /function\s+(\w+)/,
      /class\s+(\w+)/,
      /interface\s+(\w+)/,
      /type\s+(\w+)/,
      /enum\s+(\w+)/
    ],
    java: [
      /(?:public|private|protected)?\s*(?:static)?\s*(?:class|interface|enum)\s+(\w+)/,
      /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(/
    ],
    rust: [
      /fn\s+(\w+)/,
      /struct\s+(\w+)/,
      /impl\s+(\w+)/,
      /trait\s+(\w+)/
    ],
    go: [
      /func\s+(\w+)/,
      /type\s+(\w+)\s+struct/,
      /type\s+(\w+)\s+interface/
    ]
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    try {
      const searchPattern = useRegex ? new RegExp(term, 'i') : term.toLowerCase();
      const lines = code.split('\n');
      const matchingLines = lines
        .map((line, index) => {
          if (useRegex) {
            return searchPattern.test(line) ? index + 1 : -1;
          }
          return line.toLowerCase().includes(searchPattern) ? index + 1 : -1;
        })
        .filter(index => index !== -1);
      setMatches(matchingLines);
      onHighlight(matchingLines);
    } catch (error) {
      // Handle invalid regex
      console.error('Invalid search pattern:', error);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2 p-2 bg-gray-50">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search in code..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-8"
          />
          <span className="text-sm text-gray-500">
            {matches.length > 0 ? `${currentMatch + 1}/${matches.length}` : '0/0'}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setDiffMode(prev => prev === 'inline' ? 'split' : 'inline')}>
            {diffMode === 'inline' ? 'Split View' : 'Inline View'}
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              checked={useRegex}
              onCheckedChange={setUseRegex}
              id="regex-mode"
            />
            <label htmlFor="regex-mode" className="text-sm">Regex</label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={showMinimap}
              onCheckedChange={setShowMinimap}
              id="show-minimap"
            />
            <label htmlFor="show-minimap" className="text-sm">Minimap</label>
          </div>
        </div>
        {sections.map((section, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection(idx)}
            >
              {section.isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="ml-2 text-sm">{section.label}</span>
            </Button>
          </div>
        ))}
      </div>
      {showMinimap && (
        <Minimap
          code={code}
          highlightedLines={matches}
          onLineClick={(lineNumber) => {
            const element = document.querySelector(`[data-line="${lineNumber}"]`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          height="300px"
        />
      )}
    </div>
  );
}

function detectSectionStart(line: string, language: string): string | null {
  const patterns: Record<string, RegExp[]> = {
    javascript: [/function\s+(\w+)/, /class\s+(\w+)/],
    python: [/def\s+(\w+)/, /class\s+(\w+)/],
    typescript: [/function\s+(\w+)/, /class\s+(\w+)/, /interface\s+(\w+)/],
    // Add more language patterns as needed
  };

  const langPatterns = patterns[language] || patterns.javascript;
  for (const pattern of langPatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}