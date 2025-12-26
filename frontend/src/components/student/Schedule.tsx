'use client';

import { useState, useEffect } from 'react';
import { getAllSchedules } from '@/services/api/student/schedule';

export default function Schedule() {
  const [schedules, setSchedules] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getAllSchedules();
        setSchedules(data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Schedule</h1>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Theory Lecture Schedule</h2>
        {schedules?.theory && schedules.theory.length > 0 ? (
          <div className="space-y-2">
            {schedules.theory.map((item: any, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between">
                <div>
                  <div className="text-white">{item.day} - {item.topic || 'Theory Lecture'}</div>
                  <div className="text-sm text-gray-400">{item.time}</div>
                </div>
                <div className="text-gray-400">{item.teacherName || 'Teacher'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-4">No theory schedule available</div>
        )}
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Practical Sessions</h2>
        {schedules?.practical && schedules.practical.length > 0 ? (
          <div className="space-y-2">
            {schedules.practical.map((item: any, index: number) => (
              <div key={index} className="bg-gray-700 p-3 rounded flex justify-between">
                <div>
                  <div className="text-white">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-sm text-gray-400">{item.time} - {item.trainerName || 'Trainer'}</div>
                </div>
                <div className={`${item.status === 'completed' ? 'text-green-400' : item.status === 'confirmed' ? 'text-blue-400' : 'text-yellow-400'}`}>
                  {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Scheduled'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-4">No practical sessions scheduled</div>
        )}
      </div>
    </div>
  );
}
