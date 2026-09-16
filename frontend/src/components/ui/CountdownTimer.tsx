import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onReleaseReady?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onReleaseReady,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isReady: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isReady: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isReady: true });
        if (onReleaseReady) onReleaseReady();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isReady: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onReleaseReady]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-slate-900/90 border ${
      timeLeft.isReady
        ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5'
        : 'border-purple-300 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-500/5'
    } shadow-xs ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {timeLeft.isReady ? (
          <>
            <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Release Window Active</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Cryptographic Time-Lock Active</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 font-mono text-2xl md:text-3xl font-bold tracking-tight">
        <div className="flex flex-col items-center">
          <span className="text-slate-900 dark:text-slate-100">{pad(timeLeft.hours)}</span>
          <span className="text-[10px] text-slate-500 uppercase font-sans">Hrs</span>
        </div>
        <span className="text-slate-400 dark:text-slate-600 mb-3">:</span>
        <div className="flex flex-col items-center">
          <span className="text-slate-900 dark:text-slate-100">{pad(timeLeft.minutes)}</span>
          <span className="text-[10px] text-slate-500 uppercase font-sans">Min</span>
        </div>
        <span className="text-slate-400 dark:text-slate-600 mb-3">:</span>
        <div className="flex flex-col items-center">
          <span className={`${timeLeft.isReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-brand-400'}`}>
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-sans">Sec</span>
        </div>
      </div>
    </div>
  );
};
