'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getStudentProfile } from '@/services/api/student/profile';

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const profile: any = await getStudentProfile();
        
        console.log('Profile check:', profile);
        
        // Check for license (chosenLicense field)
        if (!profile || !profile.chosenLicense) {
          console.log('No license found, redirecting to enroll');
          router.replace('/student/enroll');
          return;
        }

        // Check for teacher (theoTeacherId field)
        if (!profile.theoTeacherId) {
          console.log('No teacher found, redirecting to teachers');
          router.replace('/student/teachers');
          return;
        }

        console.log('Profile complete, loading dashboard');
        setLoading(false);
      } catch (error: any) {
        console.error('Error checking enrollment:', error);
        router.replace('/student/enroll');
      }
    };

    checkEnrollment();
  }, [router]);

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

  // Show loading while checking enrollment status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
          <p className="text-white mt-4 text-lg">Verifying enrollment...</p>
        </div>
      </div>
    );
  }

  // Dashboard UI - only renders if loading is false (checks passed)
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