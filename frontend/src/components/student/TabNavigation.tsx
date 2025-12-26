interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'course', label: 'My Course' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'progress', label: 'Progress' },
    { id: 'payments', label: 'Payments' },
    { id: 'exams', label: 'Exams' },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-12 z-40">
      <div className="flex gap-1 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-2 rounded transition-all duration-300 font-bold ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
