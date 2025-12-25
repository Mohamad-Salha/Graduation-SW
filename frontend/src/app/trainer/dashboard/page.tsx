'use client';

import { useState } from 'react';
import TrainerHeader from '@/components/trainer/Header';
import TrainerSidebar from '@/components/trainer/Sidebar';
import TrainerDashboardLayout from '@/components/trainer/TrainerDashboardLayout';
import MyStudents from '@/components/trainer/MyStudents';
import MySchedule from '@/components/trainer/MySchedule';
import ScheduledSessions from '@/components/trainer/ScheduledSessions';
import MarkAttendance from '@/components/trainer/MarkAttendance';
import MyVehicle from '@/components/trainer/MyVehicle';
import PaymentTracking from '@/components/trainer/PaymentTracking';

export default function TrainerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TrainerDashboardLayout />;
      case 'students':
        return <MyStudents />;
      case 'schedule':
        return <MySchedule />;
      case 'sessions':
        return <ScheduledSessions />;
      case 'attendance':
        return <MarkAttendance />;
      case 'vehicle':
        return <MyVehicle />;
      case 'payments':
        return <PaymentTracking />;
      default:
        return <TrainerDashboardLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20">
      {/* Header */}
      <TrainerHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <TrainerSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
