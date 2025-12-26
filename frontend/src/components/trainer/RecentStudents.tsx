'use client';

import { useState, useEffect } from 'react';
import { getRecentStudents } from '@/services/api/trainer/students';

export default function RecentStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getRecentStudents();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Failed to fetch recent students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-5 shadow-card h-64 animate-pulse"></div>;
  }

  return (
    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-5 shadow-card">
      {students.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">👥</div>
          <p>No recent students</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.slice(0, 5).map((student: any, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-border hover:shadow-md transition-smooth">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center font-semibold text-secondary">
                {student.name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{student.name}</div>
                <div className="text-xs text-muted-foreground">{student.phone || 'No phone'}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {student.sessions || 0} sessions
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-5 pt-4 border-t border-border">
        <a href="#" className="text-secondary hover:text-secondary/80 text-sm font-medium inline-flex items-center gap-1 transition-smooth">
          View All Students <span>→</span>
        </a>
      </div>
    </div>
  );
}
