'use client';

import { useState, useEffect } from 'react';
import { getStudentSessions } from '@/services/api/student/sessions';

export default function Sessions() {
  const [sessions, setSessions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getStudentSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const upcomingSessions = sessions?.sessions?.filter((s: any) => s.status === 'confirmed' || s.status === 'scheduled') || [];
  const completedSessions = sessions?.sessions?.filter((s: any) => s.status === 'completed') || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">My Sessions</h1>
      
      {/* Upcoming Sessions */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Upcoming Sessions</h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-2">
            {upcomingSessions.map((session: any, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">
                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {session.time}
                  </div>
                  <div className="text-sm text-gray-400">
                    Trainer: {session.trainerName || 'TBA'} • Vehicle: {session.vehicle || 'TBA'}
                  </div>
                </div>
                <div className="text-blue-400 font-medium">
                  {session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Scheduled'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-4xl mb-2">📅</div>
            <p>No upcoming sessions</p>
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Completed Sessions</h2>
        {completedSessions.length > 0 ? (
          <div className="space-y-2">
            {completedSessions.map((session: any, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">
                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {session.time}
                  </div>
                  <div className="text-sm text-gray-400">
                    Trainer: {session.trainerName || 'N/A'} • Duration: {session.duration || '1'} hour
                  </div>
                </div>
                <div className="text-green-400 font-medium">✓ Completed</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p>No completed sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
