export default function WeeklySchedule() {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 shadow-card">
      <div className="flex justify-between items-center mb-6">
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-smooth flex items-center gap-1">
          <span>←</span> Previous
        </button>
        <div className="font-semibold text-lg">📅 Week of Dec 25 - Dec 31</div>
        <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-smooth flex items-center gap-1">
          Next <span>→</span>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Sun</div>
          <div className="bg-muted hover:bg-muted/80 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth">3 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Mon</div>
          <div className="bg-success text-success-foreground hover:bg-success/90 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth shadow-sm">5 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Tue</div>
          <div className="bg-muted hover:bg-muted/80 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth">2 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Wed</div>
          <div className="bg-success text-success-foreground hover:bg-success/90 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth shadow-sm">4 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Thu</div>
          <div className="bg-muted hover:bg-muted/80 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth">3 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Fri</div>
          <div className="bg-warning text-warning-foreground hover:bg-warning/90 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth shadow-sm">6 slots</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Sat</div>
          <div className="bg-muted hover:bg-muted/80 p-3 rounded-lg text-sm font-medium cursor-pointer transition-smooth">1 slot</div>
        </div>
      </div>
    </div>
  );
}
