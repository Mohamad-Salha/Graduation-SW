export default function TodaysSessions() {
  // Data will be fetched from backend
  const sessions = [];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-card">
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No sessions scheduled for today
        </div>
      ) : (
        <div className="space-y-3">
          {/* Sessions will be mapped here */}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border">
        <a href="#" className="text-secondary hover:text-secondary/80 text-sm font-medium inline-flex items-center gap-1 transition-smooth">
          View All Sessions <span>→</span>
        </a>
      </div>
    </div>
  );
}
