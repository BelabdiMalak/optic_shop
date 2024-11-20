// components/ui/button.tsx
export const Button = ({ children, variant, size, onClick }: any) => {
    const baseStyles = 'px-4 py-2 rounded-md focus:outline-none';
    const variantStyles = variant === 'outline' ? 'border border-gray-500' : 'bg-blue-500 text-white';
    const sizeStyles = size === 'icon' ? 'p-2' : 'text-base';
    
    return (
      <button onClick={onClick} className={`${baseStyles} ${variantStyles} ${sizeStyles}`}>
        {children}
      </button>
    );
  };
  