'use client';

import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '@/services/api/auth/logout';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

interface DashboardSidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  quickStats?: {
    label: string;
    value: string | number;
  };
}

/**
 * Shared Dashboard Sidebar Component
 * Accepts role-specific menu items
 * Provides consistent navigation structure
 */
export default function DashboardSidebar({ 
  menuItems, 
  activeSection, 
  onSectionChange,
  quickStats 
}: DashboardSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    apiLogout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-200 via-slate-300/70 to-slate-200 border-r border-border min-h-screen p-4 shadow-md flex flex-col">
      <nav className="space-y-1.5">
        <div className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
          Navigation
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-smooth group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/20 scale-[1.02]'
                : 'hover:bg-secondary/5 hover:shadow-md'
            }`}
          >
            <span className={`text-lg ${activeSection !== item.id && 'group-hover:scale-110'} transition-smooth`}>
              {item.icon}
            </span>
            <span className={`${activeSection === item.id ? 'font-semibold' : 'group-hover:translate-x-1'} transition-smooth`}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Quick Stats Section (Optional) */}
      {quickStats && (
        <div className="mt-8 p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl border border-border">
          <div className="text-xs text-muted-foreground mb-2">{quickStats.label}</div>
          <div className="text-2xl font-bold text-secondary">{quickStats.value}</div>
        </div>
      )}

      {/* Logout Button at Bottom */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-smooth group bg-red-50 hover:bg-red-100 border border-red-200"
        >
          <span className="text-lg group-hover:scale-110 transition-smooth">🚪</span>
          <span className="group-hover:translate-x-1 transition-smooth text-red-600 font-semibold">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
