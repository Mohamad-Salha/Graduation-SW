'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import DashboardHeader from '@/components/common/DashboardHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';

export default function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Teacher-specific menu items
  const teacherMenuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'My Students' },
    { id: 'attendance', icon: '✅', label: 'Attendance' },
    { id: 'schedule', icon: '📅', label: 'Schedule' },
    { id: 'mark-ready', icon: '✓', label: 'Mark Ready' },
  ];

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          role="teacher"
          userName="Teacher Name"
          userEmail="teacher@example.com"
        />
      }
      sidebar={
        <DashboardSidebar
          menuItems={teacherMenuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      }
    >
      {/* TODO: Add Teacher Dashboard Content */}
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Teacher Dashboard</h1>
        <p className="text-gray-600">Content coming soon - using shared layout! ✨</p>
      </div>
    </DashboardLayout>
  );
}
