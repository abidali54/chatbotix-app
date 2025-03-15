import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      className="rounded-md border px-3 py-2 text-sm"
      {...props}
    />
  );
}