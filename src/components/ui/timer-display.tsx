/**
 * TimerDisplay Component - Display de timer com countdown
 * 
 * T068: Mostra countdown em segundos com warning visual quando < 10s
 */

import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  maxSeconds?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TimerDisplay({ seconds, maxSeconds = 30, label, size = 'md' }: TimerDisplayProps) {
  const isWarning = seconds < 10;
  const isCritical = seconds < 5;
  const percent = (seconds / maxSeconds) * 100;

  const sizeStyles = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <div className="text-gray-400 text-sm font-bold">{label}</div>}

      <div
        className={`
          relative ${sizeStyles[size]} rounded-full
          flex items-center justify-center
          ${
            isCritical
              ? 'bg-red-600 animate-pulse'
              : isWarning
                ? 'bg-yellow-600'
                : 'bg-green-600'
          }
          transition-colors duration-300
        `}
      >
        {/* Barra de progresso circular (simplificada) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray={`${percent * 2.83} 283`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Tempo */}
        <div className="relative z-10 text-white font-bold">{seconds}s</div>
      </div>
    </div>
  );
}

