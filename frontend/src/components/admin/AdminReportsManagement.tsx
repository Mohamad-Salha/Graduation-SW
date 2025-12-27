'use client';

import { useState, useEffect } from 'react';
import { getRevenueAnalytics } from '@/services/api/admin/dashboard';
import { getAllStudents } from '@/services/api/admin/students';
import { getAllTeachers, getAllTrainers } from '@/services/api/admin/staff';
import { getAllPayments } from '@/services/api/admin/payments';
import { getAllExams, getAllExamAttempts } from '@/services/api/admin/exams';

export default function AdminReportsManagement() {
  const [activeReport, setActiveReport] = useState<'overview' | 'revenue' | 'students' | 'staff' | 'exams'>('overview');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any>(null);
  const [examsData, setExamsData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeReport, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeReport === 'overview') {
        const [students, teachers, trainers, payments]: any[] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllTrainers(),
          getAllPayments()
        ]);

        setOverviewData({
          totalStudents: students?.students?.length || students?.length || 0,
          activeStudents: (students?.students || students)?.filter((s: any) => s.status === 'approved').length || 0,
          pendingStudents: (students?.students || students)?.filter((s: any) => s.status === 'pending').length || 0,
          totalTeachers: teachers?.teachers?.length || teachers?.length || 0,
          totalTrainers: trainers?.trainers?.length || trainers?.length || 0,
          totalPayments: payments?.payments?.length || payments?.length || 0,
          completedPayments: (payments?.payments || payments)?.filter((p: any) => p.status === 'completed').length || 0,
          totalRevenue: (payments?.payments || payments)
            ?.filter((p: any) => p.status === 'completed')
            .reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0
        });
      } else if (activeReport === 'revenue') {
        const data = await getRevenueAnalytics(dateRange.start, dateRange.end);
        setRevenueData(data.analytics || data);
      } else if (activeReport === 'students') {
        const data: any = await getAllStudents();
        setStudentsData(data?.students || data || []);
      } else if (activeReport === 'staff') {
        const [teachers, trainers]: any[] = await Promise.all([
          getAllTeachers(),
          getAllTrainers()
        ]);
        setStaffData({
          teachers: teachers?.teachers || teachers || [],
          trainers: trainers?.trainers || trainers || []
        });
      } else if (activeReport === 'exams') {
        const [exams, attempts]: any[] = await Promise.all([
          getAllExams(),
          getAllExamAttempts()
        ]);
        const attemptsArray = attempts?.attempts || attempts || [];
        setExamsData({
          exams: exams?.exams || exams || [],
          attempts: attemptsArray,
          totalAttempts: attemptsArray.length,
          passedAttempts: attemptsArray.filter((a: any) => a.status === 'passed').length,
          failedAttempts: attemptsArray.filter((a: any) => a.status === 'failed').length,
          pendingAttempts: attemptsArray.filter((a: any) => a.status === 'pending').length
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Export functionality will be implemented with a proper export library (e.g., xlsx, csv)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed reports and analytics</p>
        </div>

        <button
          onClick={handleExport}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          📥 Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveReport('overview')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeReport === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveReport('revenue')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeReport === 'revenue'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          💰 Revenue
        </button>
        <button
          onClick={() => setActiveReport('students')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeReport === 'students'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👥 Students
        </button>
        <button
          onClick={() => setActiveReport('staff')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeReport === 'staff'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👨‍🏫 Staff
        </button>
        <button
          onClick={() => setActiveReport('exams')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeReport === 'exams'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📝 Exams
        </button>
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && overviewData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overviewData.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">
                {overviewData.activeStudents} active, {overviewData.pendingStudents} pending
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-600">Total Staff</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {overviewData.totalTeachers + overviewData.totalTrainers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {overviewData.totalTeachers} teachers, {overviewData.totalTrainers} trainers
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${overviewData.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {overviewData.completedPayments} completed payments
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-600">Total Payments</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overviewData.totalPayments}</p>
              <p className="text-xs text-gray-500 mt-1">
                {overviewData.totalPayments - overviewData.completedPayments} pending
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {activeReport === 'revenue' && revenueData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600">
                ${revenueData.total?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Average per Payment</p>
              <p className="text-3xl font-bold text-green-600">
                ${revenueData.average?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Transactions</p>
              <p className="text-3xl font-bold text-purple-600">
                {revenueData.count || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Students Report */}
      {activeReport === 'students' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Students Report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentsData.map((student: any) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.userId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.userId?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.licenseId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${student.progressPercentage || 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Report */}
      {activeReport === 'staff' && staffData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Teachers ({staffData.teachers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffData.teachers.map((teacher: any) => (
                <div key={teacher._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{teacher.userId?.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600">{teacher.userId?.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Joined: {new Date(teacher.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Trainers ({staffData.trainers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffData.trainers.map((trainer: any) => (
                <div key={trainer._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{trainer.userId?.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600">{trainer.userId?.email}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Joined: {new Date(trainer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exams Report */}
      {activeReport === 'exams' && examsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-600">Total Exams</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{examsData.exams.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-600">Passed</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{examsData.passedAttempts}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <h3 className="text-sm font-medium text-gray-600">Failed</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{examsData.failedAttempts}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{examsData.pendingAttempts}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pass Rate</h2>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600">
                  {examsData.totalAttempts > 0
                    ? ((examsData.passedAttempts / examsData.totalAttempts) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-gray-600 mt-2">
                  {examsData.passedAttempts} passed out of {examsData.totalAttempts} attempts
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
