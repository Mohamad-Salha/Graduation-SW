import DataTable from './DataTable';

export default function ScheduledSessions() {
  const columns = ['Date', 'Time', 'Student', 'Vehicle', 'Status', 'Actions'];
  const data = []; // Will be fetched from backend

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Scheduled Sessions</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium">All</button>
          <button className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">Today</button>
          <button className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">This Week</button>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={data}
        searchPlaceholder="Search sessions..."
      />
    </div>
  );
}
