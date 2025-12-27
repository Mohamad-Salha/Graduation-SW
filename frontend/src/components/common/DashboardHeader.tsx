'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '@/services/api/auth/logout';
import { getUserData } from '@/utils/auth';

interface DashboardHeaderProps {
  role: 'admin' | 'teacher' | 'trainer' | 'student';
  userName?: string;
  userEmail?: string;
  profileData?: any;
}

/**
 * Shared Dashboard Header Component
 * Displays logo, role portal name, notifications, and user profile
 * Used across all dashboard types
 */
export default function DashboardHeader({ role, userName, userEmail, profileData }: DashboardHeaderProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    apiLogout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || role.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin Portal';
      case 'teacher': return 'Teacher Portal';
      case 'trainer': return 'Trainer Portal';
      case 'student': return 'Student Portal';
      default: return 'Portal';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-[#2545a8] to-primary text-primary-foreground px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🚗</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">Driving School</div>
            <div className="text-xs text-primary-foreground/70">{getRoleLabel()}</div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button 
            onClick={() => router.push('/notifications')}
            className="hover:bg-white/10 p-2.5 rounded-xl transition-smooth relative group"
          >
            <span className="text-xl">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6b6b] rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
          </button>
          
          {/* Divider */}
          <div className="w-px h-10 bg-white/20"></div>
          
          {/* Profile Section - Click to go to profile */}
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-xl transition-smooth"
          >
            <div className="flex flex-col items-end">
              <div className="text-sm font-semibold">
                {userName || profileData?.name || 'User'}
              </div>
              <div className="text-xs text-primary-foreground/60">
                {userEmail || profileData?.email || role}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-[#20c997] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {getInitials(userName || profileData?.name || role)}
            </div>
          </button>

          {/* Dropdown Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="hover:bg-white/10 p-2.5 rounded-xl transition-smooth flex items-center gap-1"
            >
              <span className="text-xl">▼</span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-50">
                <button
                  onClick={() => router.push('/notifications')}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/10 transition-smooth text-foreground flex items-center gap-3"
                >
                  <span className="text-lg">💬</span>
                  <span>Messages</span>
                </button>
                <button
                  onClick={() => router.push('/notifications')}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/10 transition-smooth text-foreground flex items-center gap-3"
                >
                  <span className="text-lg">🔔</span>
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => {/* Add settings handler */}}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/10 transition-smooth text-foreground flex items-center gap-3"
                >
                  <span className="text-lg">⚙️</span>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {/* Add help handler */}}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/10 transition-smooth text-foreground flex items-center gap-3"
                >
                  <span className="text-lg">❓</span>
                  <span>Help & Support</span>
                </button>
                <div className="border-t border-border"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 transition-smooth text-red-600 font-medium flex items-center gap-3"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
