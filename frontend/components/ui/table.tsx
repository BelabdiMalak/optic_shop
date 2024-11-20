// components/ui/table.tsx
export const Table = ({ children }: any) => (
    <table className="min-w-full border-collapse">{children}</table>
  );
  
  export const TableHeader = ({ children }: any) => (
    <thead className="bg-gray-100">{children}</thead>
  );
  
  export const TableBody = ({ children }: any) => (
    <tbody>{children}</tbody>
  );
  
  export const TableRow = ({ children }: any) => (
    <tr className="border-b">{children}</tr>
  );
  
  export const TableHead = ({ children }: any) => (
    <th className="px-4 py-2 text-left">{children}</th>
  );
  
  export const TableCell = ({ children }: any) => (
    <td className="px-4 py-2">{children}</td>
  );
  