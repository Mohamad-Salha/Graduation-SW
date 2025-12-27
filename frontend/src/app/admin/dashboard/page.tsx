'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import DashboardHeader from '@/components/common/DashboardHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Admin-specific menu items
  const adminMenuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'teachers', icon: '👨‍🏫', label: 'Teachers' },
    { id: 'trainers', icon: '🚗', label: 'Trainers' },
    { id: 'vehicles', icon: '🚙', label: 'Vehicles' },
    { id: 'licenses', icon: '📄', label: 'Licenses' },
    { id: 'exams', icon: '📝', label: 'Exams' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          role="admin"
          userName="Admin Name"
          userEmail="admin@example.com"
        />
      }
      sidebar={
        <DashboardSidebar
          menuItems={adminMenuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      }
    >
      {/* TODO: Add Admin Dashboard Content */}
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Content coming soon - using shared layout! ✨</p>
      </div>
    </DashboardLayout>
  );
}
