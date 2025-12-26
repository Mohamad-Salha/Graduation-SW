'use client';

import { useState, useEffect } from 'react';
import { getTrainerSchedule } from '@/services/api/trainer/schedule';

export default function MySchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getTrainerSchedule();
        setSchedules(data.schedules || []);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">My Schedule</h1>
      
      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Weekly Availability</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Repeat for Weeks</label>
              <input type="number" className="w-full border border-border rounded-lg p-2" placeholder="e.g., 4" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle</label>
              <select className="w-full border border-border rounded-lg p-2">
                <option>Select Vehicle</option>
                <option>ABC123 - Toyota Corolla</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Weekly Time Slots</h3>
            <div className="space-y-2">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="w-24 font-medium">{day}</span>
                  <input type="time" className="border border-border rounded p-1 text-sm" />
                  <span>to</span>
                  <input type="time" className="border border-border rounded p-1 text-sm" />
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-smooth">
            Create Schedule
          </button>
        </div>
      </div>
      
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Current Schedules</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          </div>
        ) : schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((schedule: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{schedule.day} - {schedule.time}</div>
                    <div className="text-sm text-muted-foreground">Duration: {schedule.duration || '1 hour'}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    schedule.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {schedule.available ? 'Available' : 'Booked'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📅</div>
            <p>No schedules created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
