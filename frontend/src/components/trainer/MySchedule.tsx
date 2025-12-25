export default function MySchedule() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">My Schedule</h1>
      
      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Weekly Availability</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Repeat for Weeks</label>
              <input type="number" className="w-full border border-border rounded-lg p-2" placeholder="e.g., 4" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vehicle</label>
              <select className="w-full border border-border rounded-lg p-2">
                <option>Select Vehicle</option>
                <option>ABC123 - Toyota Corolla</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Weekly Time Slots</h3>
            <div className="space-y-2">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="w-24 font-medium">{day}</span>
                  <input type="time" className="border border-border rounded p-1 text-sm" />
                  <span>to</span>
                  <input type="time" className="border border-border rounded p-1 text-sm" />
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-smooth">
            Create Schedule
          </button>
        </div>
      </div>
      
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Current Schedules</h2>
        <div className="text-muted-foreground">No schedules created yet</div>
      </div>
    </div>
  );
}
