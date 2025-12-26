'use client';

import { useState, useEffect } from 'react';
import { getPaymentHistory } from '@/services/api/student/payments';

export default function Payments() {
  const [payments, setPayments] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentHistory();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalPaid = payments?.payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalPending = payments?.payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
  const totalAmount = totalPaid + totalPending;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Payments</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Total Cost</div>
          <div className="text-2xl font-bold text-white">${totalAmount}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Paid</div>
          <div className="text-2xl font-bold text-green-400">${totalPaid}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Outstanding</div>
          <div className="text-2xl font-bold text-red-400">${totalPending}</div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Payment History</h2>
        {payments?.payments && payments.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left text-white">Date</th>
                  <th className="p-3 text-left text-white">Description</th>
                  <th className="p-3 text-left text-white">Amount</th>
                  <th className="p-3 text-left text-white">Status</th>
                  <th className="p-3 text-left text-white">Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.payments.map((payment: any, index: number) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-3 text-gray-300">
                      {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3 text-gray-300">{payment.description || 'Course Payment'}</td>
                    <td className="p-3 text-gray-300">${payment.amount}</td>
                    <td className="p-3">
                      <span className={`${payment.status === 'paid' ? 'text-green-400' : payment.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">{payment.method || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-4xl mb-2">💳</div>
            <p>No payment history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
