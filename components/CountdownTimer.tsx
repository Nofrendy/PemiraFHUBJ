"use client";

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) return null; // Mencegah hydration mismatch

  return (
    <div className="flex justify-center gap-4 sm:gap-6 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="bg-white shadow-[0_4px_20px_-4px_rgba(139,0,0,0.1)] rounded-xl border border-red-50 w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mb-3">
            <span className="text-2xl sm:text-4xl font-bold text-merah-formal font-serif">
              {value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest">
            {unit === 'days' ? 'Hari' : unit === 'hours' ? 'Jam' : unit === 'minutes' ? 'Menit' : 'Detik'}
          </span>
        </div>
      ))}
    </div>
  );
}
