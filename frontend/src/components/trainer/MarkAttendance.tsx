'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { getTodaySessions } from '@/services/api/trainer/sessions';
import { markAttendance } from '@/services/api/trainer/attendance';

export default function MarkAttendance() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getTodaySessions();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [selectedDate]);

  const handleMarkAttendance = async (sessionId: string, attended: boolean) => {
    try {
      await markAttendance(sessionId, { attended });
      // Refresh sessions
      const data = await getTodaySessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const columns = ['Student', 'Time', 'Vehicle', 'Attendance', 'Payment', 'Actions'];
  const tableData = sessions.map((session: any) => [
    session.student?.name || 'Unknown',
    session.time || 'N/A',
    session.vehicle?.plateNumber || 'N/A',
    <span key={`attendance-${session._id}`} className={`px-3 py-1 rounded-full text-xs ${
      session.attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
    }`}>
      {session.attended ? 'Present' : 'Pending'}
    </span>,
    <span key={`payment-${session._id}`} className={`px-3 py-1 rounded-full text-xs ${
      session.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {session.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
    </span>,
    <button 
      key={`action-${session._id}`}
      onClick={() => handleMarkAttendance(session._id, true)}
      disabled={session.attended}
      className="text-secondary hover:underline text-sm disabled:opacity-50"
    >
      Mark Present
    </button>
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-border rounded-lg px-4 py-2" 
        />
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm">📋 Select a session below to mark attendance and payment</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={tableData}
          searchPlaceholder="Search by student name..."
        />
      )}
    </div>
  );
}
