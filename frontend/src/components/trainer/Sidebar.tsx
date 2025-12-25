interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function TrainerSidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'students', icon: '👥', label: 'My Students' },
    { id: 'schedule', icon: '📅', label: 'My Schedule' },
    { id: 'sessions', icon: '🕐', label: 'Scheduled Sessions' },
    { id: 'attendance', icon: '✅', label: 'Mark Attendance' },
    { id: 'vehicle', icon: '🚙', label: 'My Vehicle' },
    { id: 'payments', icon: '💰', label: 'Payment Tracking' },
  ];

  return (
<aside className="w-64 bg-gradient-to-b from-slate-200 via-slate-300/70 to-slate-200 border-r border-border min-h-screen p-4 shadow-md">
      <nav className="space-y-1.5">
        <div className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
          Navigation
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-smooth group ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/20 scale-[1.02]'
                : 'hover:bg-secondary/5 hover:shadow-md'
            }`}
          >
            <span className={`text-lg ${activeSection !== item.id && 'group-hover:scale-110'} transition-smooth`}>
              {item.icon}
            </span>
            <span className={`${activeSection === item.id ? 'font-semibold' : 'group-hover:translate-x-1'} transition-smooth`}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-8 p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl border border-border">
        <div className="text-xs text-muted-foreground mb-2">Quick Stats</div>
        <div className="text-2xl font-bold text-secondary">24</div>
        <div className="text-xs text-muted-foreground">Total Students</div>
      </div>
    </aside>
  );
}
