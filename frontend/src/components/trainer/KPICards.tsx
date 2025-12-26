'use client';

import { useState, useEffect } from 'react';
import { getTrainerProfile } from '@/services/api/trainer/profile';
import { getTodaySessions } from '@/services/api/trainer/sessions';
import { getPendingPayments } from '@/services/api/trainer/payments';
import { getVehicleInfo } from '@/services/api/trainer/vehicle';
import TotalStudentsCard from './TotalStudentsCard';
import UpcomingSessionsCard from './UpcomingSessionsCard';
import CompletedSessionsCard from './CompletedSessionsCard';
import PendingPaymentsCard from './PendingPaymentsCard';
import MyVehicleCard from './MyVehicleCard';
import AttendanceTodayCard from './AttendanceTodayCard';

export default function KPICards() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const [profile, sessions, payments, vehicle] = await Promise.all([
          getTrainerProfile(),
          getTodaySessions(),
          getPendingPayments(),
          getVehicleInfo(),
        ]);
        
        setData({ profile, sessions, payments, vehicle });
      } catch (error) {
        console.error('Failed to fetch KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-card rounded-lg border border-border animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TotalStudentsCard count={data?.profile?.assignedStudentsCount || 0} />
      <UpcomingSessionsCard count={data?.sessions?.sessions?.length || 0} />
      <CompletedSessionsCard count={data?.profile?.completedSessions || 0} />
      <PendingPaymentsCard amount={data?.payments?.totalPending || 0} />
      <MyVehicleCard vehicle={data?.vehicle} />
      <AttendanceTodayCard attendance={data?.sessions?.sessions?.filter((s: any) => s.attended).length || 0} />
    </div>
  );
}
