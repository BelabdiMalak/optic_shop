// components/ui/input.tsx
export const Input = ({ placeholder, className }: any) => (
    <input
      type="text"
      placeholder={placeholder}
      className={`border border-gray-300 p-2 rounded-md ${className}`}
    />
  );
  