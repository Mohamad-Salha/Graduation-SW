export default function TrainerHeader() {
  return (
    <header className="bg-gradient-to-r from-primary via-[#2545a8] to-primary text-primary-foreground px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🚗</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">Driving School</div>
            <div className="text-xs text-primary-foreground/70">Trainer Portal</div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="hover:bg-white/10 p-2.5 rounded-xl transition-smooth relative group">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6b6b] rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
            <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold group-hover:scale-110 transition-smooth">3</span>
          </button>
          
          {/* Settings */}
          <button className="hover:bg-white/10 p-2.5 rounded-xl transition-smooth">
            <span className="text-xl">⚙️</span>
          </button>
          
          {/* Divider */}
          <div className="w-px h-10 bg-white/20"></div>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/15 transition-smooth cursor-pointer group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-[#60a5fa] rounded-full flex items-center justify-center text-sm font-bold shadow-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-smooth">
                TR
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10b981] rounded-full border-2 border-primary"></div>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Trainer Name</div>
              <div className="text-xs text-primary-foreground/70">Online</div>
            </div>
            <span className="text-primary-foreground/70 group-hover:text-primary-foreground transition-smooth">▼</span>
          </div>
          
          {/* Logout Button */}
          <button className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52] hover:from-[#ff5252] hover:to-[#e63946] text-white px-5 py-2.5 rounded-xl font-medium transition-smooth shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group">
            <span className="group-hover:rotate-12 transition-smooth">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
