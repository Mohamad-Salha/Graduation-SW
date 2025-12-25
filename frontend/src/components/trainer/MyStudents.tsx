import DataTable from './DataTable';

export default function MyStudents() {
  const columns = ['Name', 'Progress', 'Sessions', 'Payment Status', 'Last Session', 'Actions'];
  const data = []; // Will be fetched from backend

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Students</h1>
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold">24 Total</span>
      </div>
      
      <DataTable 
        columns={columns} 
        data={data}
        searchPlaceholder="Search students by name..."
      />
    </div>
  );
}
