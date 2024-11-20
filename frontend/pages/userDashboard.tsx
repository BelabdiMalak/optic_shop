import { useState } from 'react';
import { Moon, Sun, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const initialUsers = [
  { id: '1', name: 'John', surename: 'Doe', sphere: '+2.00', cylinder: '-0.50', axis: '180', createdAt: '2023-01-01', updatedAt: '2023-01-15' },
  { id: '2', name: 'Jane', surename: 'Smith', sphere: '-1.75', cylinder: '-0.25', axis: '90', createdAt: '2023-02-01', updatedAt: '2023-02-10' },
];

const translations = {
  en: {
    title: 'User Management',
    id: 'ID',
    name: 'Name',
    surename: 'Surname',
    sphere: 'Sphere',
    cylinder: 'Cylinder',
    axis: 'Axis',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    actions: 'Actions',
    addUser: 'Add User',
    search: 'Search users...',
    edit: 'Edit',
    delete: 'Delete',
  },
  es: {
    title: 'Gestión de Usuarios',
    id: 'ID',
    name: 'Nombre',
    surename: 'Apellido',
    sphere: 'Esfera',
    cylinder: 'Cilindro',
    axis: 'Eje',
    createdAt: 'Creado el',
    updatedAt: 'Actualizado el',
    actions: 'Acciones',
    addUser: 'Añadir Usuario',
    search: 'Buscar usuarios...',
    edit: 'Editar',
    delete: 'Eliminar',
  },
} as const;

type Lang = keyof typeof translations;

export default function UserDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Control dropdown visibility
  const t = translations[lang];

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkTheme ? 'dark' : ''}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" onClick={toggleDropdown}>
                  {lang.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              {isDropdownOpen && (
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLang('en')}>EN</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLang('es')}>ES</DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {isDarkTheme ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} className="pl-8" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t.addUser}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.id}</TableHead>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.surename}</TableHead>
              <TableHead>{t.sphere}</TableHead>
              <TableHead>{t.cylinder}</TableHead>
              <TableHead>{t.axis}</TableHead>
              <TableHead>{t.createdAt}</TableHead>
              <TableHead>{t.updatedAt}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surename}</TableCell>
                <TableCell>{user.sphere}</TableCell>
                <TableCell>{user.cylinder}</TableCell>
                <TableCell>{user.axis}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.updatedAt}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
