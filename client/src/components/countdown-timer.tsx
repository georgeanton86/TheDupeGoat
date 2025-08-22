import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CountdownTimerProps {
  nextReleaseDate: string;
}

export default function CountdownTimer({ nextReleaseDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetDate = new Date(nextReleaseDate).getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextReleaseDate]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg" data-testid="card-countdown">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 text-sm font-medium">
          <span className="text-gray-600">Next release in:</span>
          <div className="flex space-x-2">
            <span className="bg-luxury-black text-white px-2 py-1 rounded text-xs min-w-[24px] text-center">
              {timeLeft.days.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400">:</span>
            <span className="bg-luxury-black text-white px-2 py-1 rounded text-xs min-w-[24px] text-center">
              {timeLeft.hours.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400">:</span>
            <span className="bg-luxury-black text-white px-2 py-1 rounded text-xs min-w-[24px] text-center">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
