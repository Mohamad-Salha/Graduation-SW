'use client';

interface LicenseCardProps {
  name: string;
  description: string;
  category: string;
  totalPrice: number;
  pricePerSession: number;
  minPracticalSessions: number;
  estimatedDuration: string;
  difficulty: string;
  color: string;
  icon: string;
  isPopular: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function LicenseCard({
  name,
  description,
  category,
  totalPrice,
  pricePerSession,
  minPracticalSessions,
  estimatedDuration,
  difficulty,
  color,
  icon,
  isPopular,
  isSelected = false,
  onClick,
}: LicenseCardProps) {
  // Icon mapping (simple for now)
  const getIcon = () => {
    switch (icon) {
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'truck':
        return '🚛';
      case 'bus':
        return '🚌';
      default:
        return '🚗';
    }
  };

  // Color mapping for button
  const getColorClasses = () => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      orange: 'bg-orange-500 hover:bg-orange-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
      red: 'bg-red-600 hover:bg-red-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-xl shadow-lg p-8
        transition-all duration-500 cursor-pointer
        hover:shadow-2xl hover:-translate-y-3
        min-h-[650px] flex flex-col
        ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}
      `}
    >
      {/* Most Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon and Title */}
      <div className="text-center mb-6">
        <div className="text-7xl mb-4 transition-transform duration-300 hover:scale-110">{getIcon()}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Pricing Box */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center flex-grow">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          ${totalPrice}
        </div>
        <div className="text-sm text-gray-600 mb-3">Total Course</div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            {minPracticalSessions} sessions × ${pricePerSession}
          </div>
          <div className="text-sm text-gray-500">
            📅 {estimatedDuration}
          </div>
        </div>
      </div>

      {/* Info Tags */}
      <div className="flex justify-between items-center mb-4 text-xs">
        <span className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full capitalize font-medium">
          {difficulty}
        </span>
        <span className="text-gray-500 capitalize">{category}</span>
      </div>

      {/* Enroll Button */}
      <button
        className={`
          w-full py-4 rounded-lg text-white font-bold text-lg
          transition-all duration-300
          hover:shadow-lg active:scale-95
          ${getColorClasses()}
        `}
      >
        Enroll Now
      </button>
    </div>
  );
}
