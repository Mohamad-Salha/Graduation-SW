'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/common/DashboardLayout';
import DashboardHeader from '@/components/common/DashboardHeader';
import DashboardSidebar from '@/components/common/DashboardSidebar';
import TrainerDashboardContent from '@/components/trainer/TrainerDashboardContent';
import MyStudents from '@/components/trainer/MyStudents';
import MySchedule from '@/components/trainer/MySchedule';
import ScheduledSessions from '@/components/trainer/ScheduledSessions';
import MarkAttendance from '@/components/trainer/MarkAttendance';
import MyVehicle from '@/components/trainer/MyVehicle';
import PaymentTracking from '@/components/trainer/PaymentTracking';
import { getTrainerProfile } from '@/services/api/trainer/profile';
import { getUserData } from '@/utils/auth';

export default function TrainerDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch trainer profile data
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          router.push('/login');
          return;
        }

        const profile = await getTrainerProfile();
        setTrainer(profile);
      } catch (error) {
        console.error('Failed to fetch trainer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [router]);

  // Trainer-specific menu items
  const trainerMenuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'My Students' },
    { id: 'schedule', icon: '📅', label: 'My Schedule' },
    { id: 'sessions', icon: '🕐', label: 'Scheduled Sessions' },
    { id: 'attendance', icon: '✅', label: 'Mark Attendance' },
    { id: 'vehicle', icon: '🚙', label: 'My Vehicle' },
    { id: 'payments', icon: '💰', label: 'Payment Tracking' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TrainerDashboardContent />;
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
        return <TrainerDashboardContent />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          role="trainer"
          userName={trainer?.name}
          userEmail={trainer?.email}
          profileData={trainer}
        />
      }
      sidebar={
        <DashboardSidebar
          menuItems={trainerMenuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          quickStats={{
            label: 'Total Students',
            value: trainer?.totalStudents || 24
          }}
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
}
