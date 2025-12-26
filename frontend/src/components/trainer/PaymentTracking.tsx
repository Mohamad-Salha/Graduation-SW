'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import { getPaymentTracking } from '@/services/api/trainer/payments';

export default function PaymentTracking() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalCollected: 0, pending: 0 });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentTracking();
        setPayments(data.payments || []);
        
        // Calculate summary
        const collected = data.payments?.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
        const pending = data.payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
        setSummary({ totalCollected: collected, pending });
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const columns = ['Student', 'Session Date', 'Amount', 'Status', 'Payment Date', 'Actions'];
  const tableData = payments.map((payment: any) => [
    payment.student?.name || 'Unknown',
    new Date(payment.sessionDate).toLocaleDateString(),
    `$${payment.amount || 0}`,
    <span key={payment._id} className={`px-3 py-1 rounded-full text-xs ${
      payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {payment.status === 'paid' ? 'Paid' : 'Pending'}
    </span>,
    payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-',
    <button key={payment._id} className="text-secondary hover:underline text-sm">View</button>
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Payment Tracking</h1>
        <div className="flex gap-4">
          <div className="bg-success/10 px-4 py-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Collected</div>
            <div className="text-lg font-bold text-success">${summary.totalCollected}</div>
          </div>
          <div className="bg-error/10 px-4 py-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-lg font-bold text-error">${summary.pending}</div>
          </div>
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
          searchPlaceholder="Search by student name..."
        />
      )}
    </div>
  );
}
