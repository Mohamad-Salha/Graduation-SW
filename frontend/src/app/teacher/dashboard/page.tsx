'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import DashboardHeader from '@/components/common/DashboardHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import TeacherDashboardContent from '@/components/teacher/TeacherDashboardContent';
import TeacherMyStudents from '@/components/teacher/TeacherMyStudents';
import TeacherAttendance from '@/components/teacher/TeacherAttendance';
import TeacherSchedule from '@/components/teacher/TeacherSchedule';
import TeacherMarkReady from '@/components/teacher/TeacherMarkReady';

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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TeacherDashboardContent />;
      case 'students':
        return <TeacherMyStudents />;
      case 'attendance':
        return <TeacherAttendance />;
      case 'schedule':
        return <TeacherSchedule />;
      case 'mark-ready':
        return <TeacherMarkReady />;
      default:
        return <TeacherDashboardContent />;
    }
  };

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
      {renderContent()}
    </DashboardLayout>
  );
}
