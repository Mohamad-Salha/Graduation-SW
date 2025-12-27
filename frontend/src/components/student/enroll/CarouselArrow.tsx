'use client';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}

export default function CarouselArrow({ direction, onClick, disabled = false }: CarouselArrowProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        fixed top-1/2 -translate-y-1/2 z-20
        ${direction === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}
        bg-white/95 hover:bg-white shadow-2xl
        rounded-full p-4 sm:p-5
        transition-all duration-500 ease-out
        hover:scale-125 active:scale-95
        disabled:opacity-20 disabled:cursor-not-allowed
        group
        animate-pulse-slow
      `}
      aria-label={`Navigate ${direction}`}
    >
      <svg
        className="w-10 h-10 text-gray-800 group-hover:text-blue-600 transition-all duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        {direction === 'left' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}
