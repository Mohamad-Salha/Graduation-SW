'use client';

import { useState, useEffect } from 'react';
import { getTodaySessions } from '@/services/api/trainer/sessions';

export default function TodaysSessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getTodaySessions();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to fetch today sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-card h-64 animate-pulse"></div>;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-card">
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">📅</div>
          <p>No sessions scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session: any, index: number) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition-smooth">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">{session.studentName || 'Student'}</div>
                  <div className="text-sm text-muted-foreground">{session.time} • {session.duration || '1'} hour</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session.status === 'completed' ? 'bg-success/10 text-success' : 
                  session.status === 'confirmed' ? 'bg-secondary/10 text-secondary' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Scheduled'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border">
        <a href="#" className="text-secondary hover:text-secondary/80 text-sm font-medium inline-flex items-center gap-1 transition-smooth">
          View All Sessions <span>→</span>
        </a>
      </div>
    </div>
  );
}
