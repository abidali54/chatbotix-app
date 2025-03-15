import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border bg-card p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}