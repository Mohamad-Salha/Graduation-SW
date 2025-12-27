'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivities } from '@/services/api/admin/dashboard';

interface AdminDashboardContentProps {
  onNavigate: (section: string) => void;
}

export default function AdminDashboardContent({ onNavigate }: AdminDashboardContentProps) {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activitiesData] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(5)
      ]);
      console.log('Stats Data:', statsData);
      console.log('Activities Data:', activitiesData);
      setStats(statsData?.stats || statsData);
      setActivities(activitiesData?.activities || activitiesData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-4">Failed to load dashboard data</div>
        {error && <p className="text-gray-500 text-sm">{error}</p>}
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome! Here's an overview of your driving school</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <button
          onClick={() => onNavigate('students')}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.students.total}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.students.active} active
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </button>

        {/* Pending Approvals */}
        <button
          onClick={() => onNavigate('students')}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.students.pending}</p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting review
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </button>

        {/* Staff Members */}
        <button
          onClick={() => onNavigate('staff')}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Staff Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.staff.teachers + stats.staff.trainers}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.staff.teachers} teachers, {stats.staff.trainers} trainers
              </p>
            </div>
            <div className="text-4xl">👨‍🏫</div>
          </div>
        </button>

        {/* Monthly Revenue */}
        <button
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stats.revenue.monthly.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: ${stats.revenue.total.toFixed(0)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </button>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicles */}
        <button
          onClick={() => onNavigate('vehicles')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicles</h3>
            <span className="text-2xl">🚗</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">{stats.vehicles.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-semibold text-green-600">{stats.vehicles.available}</span>
            </div>
          </div>
        </button>

        {/* Exams */}
        <button
          onClick={() => onNavigate('exams')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ready for Exams</h3>
            <span className="text-2xl">📝</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Theoretical:</span>
              <span className="font-semibold text-blue-600">{stats.exams.readyForTheo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Practical:</span>
              <span className="font-semibold text-green-600">{stats.exams.readyForPractical}</span>
            </div>
          </div>
        </button>

        {/* Payments */}
        <button
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
            <span className="text-2xl">💳</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-semibold text-green-600">{stats.payments.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="font-semibold text-yellow-600">{stats.payments.pending}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activities */}
      {activities && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Recent Students */}
            {activities.students && activities.students.length > 0 && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">New Student Registrations</h3>
                  <button
                    onClick={() => onNavigate('students')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {activities.students.slice(0, 3).map((student: any) => (
                    <div key={student._id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {student.userId?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.userId?.name || 'Unknown'}</p>
                          <p className="text-gray-500 text-xs">{student.userId?.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(student.userId?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Payments */}
            {activities.payments && activities.payments.length > 0 && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Recent Payments</h3>
                  <button
                    onClick={() => onNavigate('payments')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {activities.payments.slice(0, 3).map((payment: any) => (
                    <div key={payment._id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">💰</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.studentId?.userId?.name || 'Unknown'}
                          </p>
                          <p className="text-gray-500 text-xs">
                            ${payment.amount} - {payment.status}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('students')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-700">Manage Students</p>
          </button>
          <button 
            onClick={() => onNavigate('staff')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div className="text-3xl mb-2">👨‍🏫</div>
            <p className="text-sm font-medium text-gray-700">Manage Staff</p>
          </button>
          <button 
            onClick={() => onNavigate('exams')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-medium text-gray-700">Schedule Exams</p>
          </button>
          <button 
            onClick={() => onNavigate('reports')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-700">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
