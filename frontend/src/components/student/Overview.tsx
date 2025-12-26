'use client';

import { useState, useEffect } from 'react';
import { getStudentProfile } from '@/services/api/student/profile';
import { getStudentProgress } from '@/services/api/student/progress';
import { getUpcomingSessions } from '@/services/api/student/sessions';
import { getPendingPayments } from '@/services/api/student/payments';

export default function Overview() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, progressData, sessionsData, paymentsData] = await Promise.all([
          getStudentProfile(),
          getStudentProgress(),
          getUpcomingSessions(),
          getPendingPayments(),
        ]);
        
        setProfile(profileData);
        setProgress(progressData);
        setUpcomingSessions(sessionsData.sessions || []);
        setPendingPayments(paymentsData.payments || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const nextSession = upcomingSessions[0];
  const theoryProgress = progress?.theoryProgress || 0;
  const practicalProgress = progress?.practicalProgress || 0;
  const overallProgress = Math.round((theoryProgress + practicalProgress) / 2);
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Theory Status</div>
          <div className={`text-2xl font-bold ${profile?.theoPassed ? 'text-green-400' : 'text-yellow-400'}`}>
            {profile?.theoPassed ? 'Passed' : 'In Progress'}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Practical Sessions</div>
          <div className="text-2xl font-bold text-white">
            {profile?.practicalSessionsCompleted || 0}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Payment Status</div>
          <div className={`text-2xl font-bold ${totalPending > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {totalPending > 0 ? `$${totalPending} Due` : 'Paid'}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Next Session</div>
          {nextSession ? (
            <div className="text-sm text-white">
              {new Date(nextSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {nextSession.time}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No upcoming</div>
          )}
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Upcoming Sessions</h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 3).map((session, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded flex justify-between">
                <div>
                  <div className="text-white font-semibold">{session.type || 'Practical'} Session</div>
                  <div className="text-sm text-gray-400">
                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {session.time} - {session.trainerName || session.teacherName || 'Instructor'}
                  </div>
                </div>
                <button className="text-blue-400 hover:text-blue-300">View</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-4">No upcoming sessions</div>
        )}
      </div>
      
      {/* Progress Circle */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Overall Progress</h2>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{overallProgress}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-400">Theory: {theoryProgress}%</div>
              <div className="w-48 bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: `${theoryProgress}%`}}></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Practical: {practicalProgress}%</div>
              <div className="w-48 bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{width: `${practicalProgress}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
