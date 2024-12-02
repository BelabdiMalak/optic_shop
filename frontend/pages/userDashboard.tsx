import { useState } from 'react';
import { Moon, Sun, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  fr: {
    title: 'Gestion des utilisateurs',
    id: 'ID',
    name: 'Nom',
    surename: 'Prénom',
    sphere: 'Sphère',
    cylinder: 'Cylindre',
    axis: 'Axe',
    createdAt: 'Créé le',
    updatedAt: 'Mis à jour le',
    actions: 'Actions',
    addUser: 'Ajouter un utilisateur',
    search: 'Rechercher des utilisateurs...',
    edit: 'Modifier',
    delete: 'Supprimer',
  },
} as const;

type Lang = keyof typeof translations;

export default function UserDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark', !isDarkTheme);
  };

  return (
    <div className={`min-h-screen p-8 bg-gray-100 dark:bg-gray-900 dark:text-gray-100`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <div className="flex items-center space-x-4">
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
      </div>
    </div>
  );
}
