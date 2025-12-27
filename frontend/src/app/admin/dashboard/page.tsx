'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import DashboardHeader from '@/components/common/DashboardHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import AdminStudentsManagement from '@/components/admin/AdminStudentsManagement';
import AdminStaffManagement from '@/components/admin/AdminStaffManagement';
import AdminVehiclesLicenses from '@/components/admin/AdminVehiclesLicenses';
import AdminPaymentsManagement from '@/components/admin/AdminPaymentsManagement';
import AdminExamsManagement from '@/components/admin/AdminExamsManagement';
import AdminReportsManagement from '@/components/admin/AdminReportsManagement';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Admin-specific menu items
  const adminMenuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'staff', icon: '👨‍🏫', label: 'Staff' },
    { id: 'vehicles', icon: '�', label: 'Vehicles & Licenses' },
    { id: 'exams', icon: '📝', label: 'Exams' },
    { id: 'payments', icon: '💰', label: 'Payments' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardContent onNavigate={setActiveSection} />;
      case 'students':
        return <AdminStudentsManagement />;
      case 'staff':
        return <AdminStaffManagement />;
      case 'vehicles':
        return <AdminVehiclesLicenses />;
      case 'payments':
        return <AdminPaymentsManagement />;
      case 'exams':
        return <AdminExamsManagement />;
      case 'reports':
        return <AdminReportsManagement />;
      default:
        return <AdminDashboardContent onNavigate={setActiveSection} />;
    }
  };

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
      {renderContent()}
    </DashboardLayout>
  );
}
