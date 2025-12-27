'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  header: ReactNode;
  sidebar: ReactNode;
}

/**
 * Shared Dashboard Layout Wrapper
 * Used by all roles (admin, teacher, trainer, student)
 * Provides consistent structure: Header + Sidebar + Main Content
 */
export default function DashboardLayout({ children, header, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20">
      {/* Header */}
      {header}
      
      <div className="flex">
        {/* Sidebar */}
        {sidebar}
        
        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
