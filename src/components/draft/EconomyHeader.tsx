import React from 'react';

interface EconomyHeaderProps {
  wallet: number;
  timeLeft: number;
}

const EconomyHeader: React.FC<EconomyHeaderProps> = ({ wallet, timeLeft }) => {
  // Format timer as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 font-pixel">
      {/* Wallet Display */}
      <div className="bg-slate-900 border-4 border-green-900 px-4 py-2 rounded-sm shadow-inner flex items-center gap-2 w-full sm:w-auto justify-center">
        <div className="bg-green-500 rounded-full p-1 text-slate-900">
           <span className="font-bold text-xs">$</span>
        </div>
        <span className="text-green-400 text-lg sm:text-xl tracking-wider drop-shadow-md">
          SCHMECKLES: {wallet}
        </span>
      </div>

      {/* Timer Display */}
      <div className="bg-slate-900 border-4 border-red-900 px-4 py-2 rounded-sm shadow-inner w-full sm:w-auto text-center">
        <span className="text-red-500 text-lg sm:text-xl tracking-wider drop-shadow-md">
           DRAFT ENDS IN: {timeString}
        </span>
      </div>
    </div>
  );
};

export default EconomyHeader;
