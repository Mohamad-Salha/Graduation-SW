import DataTable from './DataTable';

export default function PaymentTracking() {
  const columns = ['Student', 'Session Date', 'Amount', 'Status', 'Payment Date', 'Actions'];
  const data = []; // Will be fetched from backend

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Payment Tracking</h1>
        <div className="flex gap-4">
          <div className="bg-success/10 px-4 py-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Collected</div>
            <div className="text-lg font-bold text-success">$2,450</div>
          </div>
          <div className="bg-error/10 px-4 py-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-lg font-bold text-error">$250</div>
          </div>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={data}
        searchPlaceholder="Search by student name..."
      />
    </div>
  );
}
