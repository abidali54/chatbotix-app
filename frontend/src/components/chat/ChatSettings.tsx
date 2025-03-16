import React from 'react';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ChatSettingsProps {
  onThemeChange: (theme: string) => void;
  onShortcutChange: (action: string, shortcut: string) => void;
  onSoundChange: (soundType: string) => void;
}

export function ChatSettings({ onThemeChange, onShortcutChange, onSoundChange }: ChatSettingsProps) {
  const codeThemes = ['github', 'dracula', 'monokai', 'solarized'];
  const notificationSounds = ['default', 'subtle', 'cheerful', 'alert'];

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">Code Theme</label>
        <Select onValueChange={onThemeChange}>
          {codeThemes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Notification Sound</label>
        <Select onValueChange={onSoundChange}>
          {notificationSounds.map(sound => (
            <option key={sound} value={sound}>{sound}</option>
          ))}
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Keyboard Shortcuts</label>
        <div className="space-y-2">
          {['bold', 'italic', 'quote', 'code'].map(action => (
            <div key={action} className="flex items-center space-x-2">
              <span className="w-20">{action}</span>
              <Input
                type="text"
                placeholder="Press keys..."
                onKeyDown={(e) => {
                  e.preventDefault();
                  const shortcut = [
                    e.ctrlKey && 'Ctrl',
                    e.shiftKey && 'Shift',
                    e.key.toUpperCase()
                  ].filter(Boolean).join('+');
                  onShortcutChange(action, shortcut);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}