import React, { useState } from 'react';

interface AlphaIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export const AlphaIcon: React.FC<AlphaIconProps> = ({
  size = 'md',
  className = '',
  showGlow = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeClass = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden select-none transition-transform duration-200 ${sizeClass} ${className}`}
    >
      {/* Background glow if enabled */}
      {showGlow && (
        <div
          className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-xl blur-sm opacity-50 -z-10"
          aria-hidden="true"
        />
      )}

      {!imageError ? (
        <img
          src="/src/assets/images/alpha_ai_symbol_1790453335894.jpg"
          alt="Alpha AI - 'አ' and 'A' interwoven symbol"
          className="w-full h-full object-cover rounded-xl"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Fallback Vector SVG Monogram fusing 'አ' and 'A' */
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border border-blue-500/30 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
          
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="alphaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* The outer Latin 'A' apex and legs */}
            <path
              d="M 50 14 L 20 86 M 50 14 L 80 86"
              stroke="url(#alphaBlueGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Interwoven Amharic 'አ' central core and crossbar */}
            <path
              d="M 32 58 L 68 58"
              stroke="url(#alphaBlueGrad)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 50 36 L 50 84"
              stroke="url(#alphaBlueGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 40 44 Q 50 38 60 44"
              stroke="#60a5fa"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Crown node representing AI synthesis */}
            <circle cx="50" cy="14" r="5" fill="#38bdf8" />
          </svg>
        </div>
      )}
    </div>
  );
};
