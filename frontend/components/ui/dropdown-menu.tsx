// components/ui/dropdown-menu.tsx
export const DropdownMenu = ({ children }: any) => (
    <div className="relative inline-block text-left">
      {children}
    </div>
  );
  
  export const DropdownMenuTrigger = ({ children }: any) => (
    <button className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
      {children}
    </button>
  );
  
  export const DropdownMenuContent = ({ children }: any) => (
    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      {children}
    </div>
  );
  
  export const DropdownMenuItem = ({ children, onClick }: any) => (
    <button onClick={onClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {children}
    </button>
  );
  