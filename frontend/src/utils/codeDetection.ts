import { detect } from 'highlight.js/lib/core';

export const detectLanguage = (code: string): string => {
  try {
    const result = detect(code);
    return result?.language || 'plaintext';
  } catch {
    return 'plaintext';
  }
};