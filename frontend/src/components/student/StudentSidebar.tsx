export default function StudentSidebar() {
  return (
    <aside className="w-56 bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 h-screen p-3 border-r border-indigo-900/50 sticky top-12 overflow-y-auto shadow-xl">
      {/* Course Card */}
      <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg mb-4 border border-white/10 shadow-lg">
        <div className="text-sm text-blue-100 mb-2">Current Course</div>
        <div className="font-bold text-white mb-1">Category B</div>
        <div className="text-xs text-blue-200">License Type</div>
        
        <div className="mt-4">
          <div className="text-xs text-blue-100 mb-1">Overall Progress</div>
          <div className="w-full bg-white/10 rounded-full h-2 border border-white/20">
            <div className="bg-yellow-400 h-2 rounded-full shadow-lg" style={{width: '60%'}}></div>
          </div>
          <div className="text-xs text-blue-100 mt-1">60% Complete</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-xs text-blue-200 mb-2 font-semibold">QUICK ACTIONS</div>
        <button className="w-full bg-blue-600/40 hover:bg-blue-600/60 backdrop-blur-sm text-white p-2 rounded text-sm transition-colors duration-200 shadow-md font-medium border border-blue-500/30">📅 Book Session</button>
        <button className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-2 rounded text-sm transition-colors duration-200 border border-white/10">💰 Make Payment</button>
        <button className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-2 rounded text-sm transition-colors duration-200 border border-white/10">📞 Contact Teacher</button>
      </div>
      
      {/* Status Summary */}
      <div className="mt-4 space-y-2">
        <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
          <div className="text-xs text-blue-200">Theory</div>
          <div className="text-sm text-green-300 font-semibold">✓ Passed</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
          <div className="text-xs text-blue-200">Practical</div>
          <div className="text-sm text-white">15/20 Sessions</div>
        </div>
      </div>
    </aside>
  );
}
