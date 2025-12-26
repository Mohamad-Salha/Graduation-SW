'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { getTrainerSessions } from '@/services/api/trainer/sessions';

export default function ScheduledSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getTrainerSessions();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getFilteredSessions = () => {
    if (filter === 'all') return sessions;
    
    const now = new Date();
    if (filter === 'today') {
      return sessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        return sessionDate.toDateString() === now.toDateString();
      });
    }
    
    if (filter === 'week') {
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return sessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= now && sessionDate <= weekFromNow;
      });
    }
    
    return sessions;
  };

  const columns = ['Date', 'Time', 'Student', 'Vehicle', 'Status', 'Actions'];
  const tableData = getFilteredSessions().map((session: any) => [
    new Date(session.date).toLocaleDateString(),
    session.time || 'N/A',
    session.student?.name || 'Unknown',
    session.vehicle?.plateNumber || 'N/A',
    <span key={session._id} className={`px-3 py-1 rounded-full text-xs ${
      session.status === 'completed' ? 'bg-green-100 text-green-700' :
      session.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
      session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
      'bg-yellow-100 text-yellow-700'
    }`}>
      {session.status}
    </span>,
    <button key={session._id} className="text-secondary hover:underline text-sm">View</button>
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Scheduled Sessions</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
            }`}
          >
            All ({sessions.length})
          </button>
          <button 
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'today' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'week' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
            }`}
          >
            This Week
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={tableData}
          searchPlaceholder="Search sessions..."
        />
      )}
    </div>
  );
}
