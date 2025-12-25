interface DataTableProps {
  columns: string[];
  data: any[];
  searchPlaceholder?: string;
}

export default function DataTable({ columns, data, searchPlaceholder = "Search..." }: DataTableProps) {
  return (
    <div className="bg-white border border-blue-200 rounded-lg shadow-lg">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-border flex gap-4">
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          className="flex-1 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-smooth">
          🔍 Search
        </button>
        <button className="px-4 py-2 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-smooth">
          🔽 Filter
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/30 transition-smooth">
                {Object.values(row).map((cell: any, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm">
                    {cellIndex === Object.values(row).length - 1 ? (
                      <button className="px-3 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-smooth font-medium">
                        {cell}
                      </button>
                    ) : cell === 'Paid' ? (
                      <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">✓ {cell}</span>
                    ) : cell === 'Pending' ? (
                      <span className="px-2 py-1 bg-error/10 text-error rounded-full text-xs font-medium">⏳ {cell}</span>
                    ) : cell === 'Upcoming' ? (
                      <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">📅 {cell}</span>
                    ) : cell === 'Scheduled' ? (
                      <span className="px-2 py-1 bg-blue-100 text-secondary rounded-full text-xs font-medium">📋 {cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-border flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {data.length} results
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-muted rounded hover:bg-muted/80 transition-smooth">← Previous</button>
          <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded">1</button>
          <button className="px-3 py-1 bg-muted rounded hover:bg-muted/80 transition-smooth">2</button>
          <button className="px-3 py-1 bg-muted rounded hover:bg-muted/80 transition-smooth">Next →</button>
        </div>
      </div>
    </div>
  );
}
