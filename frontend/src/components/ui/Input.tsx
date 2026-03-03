import { InputHTMLAttributes } from 'react';

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
};