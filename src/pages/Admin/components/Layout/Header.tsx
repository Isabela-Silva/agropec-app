import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="focus:ring-admin-primary-500 rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2"
            />
          </div>

          {/* Notifications */}
          <button className="focus:ring-admin-primary-500 relative rounded-lg p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
