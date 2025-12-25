export default function RecentStudents() {
  // Data will be fetched from backend
  const students = [];

  return (
    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-5 shadow-card">
      {students.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent students
        </div>
      ) : (
        <div className="space-y-4">
          {/* Students will be mapped here */}
        </div>
      )}
      
      <div className="mt-5 pt-4 border-t border-border">
        <a href="#" className="text-secondary hover:text-secondary/80 text-sm font-medium inline-flex items-center gap-1 transition-smooth">
          View All Students <span>→</span>
        </a>
      </div>
    </div>
  );
}
