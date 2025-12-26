'use client';

import { useState, useEffect } from 'react';
import { getAssignedStudents } from '@/services/api/trainer/students';
import DataTable from './DataTable';

export default function MyStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAssignedStudents();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = ['Name', 'Progress', 'Sessions', 'Payment Status', 'Last Session', 'Actions'];
  
  const tableData = students.map((student) => ({
    Name: student.name || 'N/A',
    Progress: `${student.progress || 0}%`,
    Sessions: `${student.completedSessions || 0}/${student.totalSessions || 20}`,
    'Payment Status': student.paymentStatus || 'Pending',
    'Last Session': student.lastSession ? new Date(student.lastSession).toLocaleDateString() : 'N/A',
    Actions: 'View',
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Students</h1>
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold">
          {students.length} Total
        </span>
      </div>
      
      <DataTable 
        columns={columns} 
        data={tableData}
        searchPlaceholder="Search students by name..."
      />
    </div>
  );
}
