'use client';

import { useState } from 'react';
import StudentHeader from '@/components/student/StudentHeader';
import StudentSidebar from '@/components/student/StudentSidebar';
import TabNavigation from '@/components/student/TabNavigation';
import Overview from '@/components/student/Overview';
import MyCourse from '@/components/student/MyCourse';
import Schedule from '@/components/student/Schedule';
import Sessions from '@/components/student/Sessions';
import Progress from '@/components/student/Progress';
import Payments from '@/components/student/Payments';
import Exams from '@/components/student/Exams';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'course':
        return <MyCourse />;
      case 'schedule':
        return <Schedule />;
      case 'sessions':
        return <Sessions />;
      case 'progress':
        return <Progress />;
      case 'payments':
        return <Payments />;
      case 'exams':
        return <Exams />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <StudentHeader />
      
      <div className="flex">
        <StudentSidebar />
        
        <main className="flex-1">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="p-6">
            <div key={activeTab} className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
