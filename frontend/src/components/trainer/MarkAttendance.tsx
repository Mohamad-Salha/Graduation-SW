import DataTable from './DataTable';

export default function MarkAttendance() {
  const columns = ['Student', 'Time', 'Vehicle', 'Attendance', 'Payment', 'Actions'];
  const data = []; // Will be fetched from backend

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
        <input type="date" className="border border-border rounded-lg px-4 py-2" />
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm">📋 Select a session below to mark attendance and payment</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={data}
        searchPlaceholder="Search by student name..."
      />
    </div>
  );
}
