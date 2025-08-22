import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CountdownTimerProps {
  nextReleaseDate: string;
  isPreOrder?: boolean;
}

export default function CountdownTimer({ nextReleaseDate, isPreOrder = false }: CountdownTimerProps) {
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

  const total = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds;
  
  // Don't show timer if time is up and it's not a pre-order
  if (total === 0 && !isPreOrder) return null;

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-champagne/20" data-testid="card-countdown">
      <CardContent className="p-6">
        <div className="text-center space-y-3">
          <div className="text-sm font-medium text-gray-700">
            {isPreOrder ? "🚀 Release countdown:" : "⏰ Next release in:"}
          </div>
          <div className="flex justify-center space-x-3">
            <div className="text-center">
              <div className="bg-luxury-black text-champagne px-3 py-2 rounded-lg text-lg font-bold min-w-[48px]">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">DAYS</div>
            </div>
            <div className="text-center">
              <div className="bg-luxury-black text-champagne px-3 py-2 rounded-lg text-lg font-bold min-w-[48px]">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">HRS</div>
            </div>
            <div className="text-center">
              <div className="bg-luxury-black text-champagne px-3 py-2 rounded-lg text-lg font-bold min-w-[48px]">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">MIN</div>
            </div>
            <div className="text-center">
              <div className="bg-luxury-black text-champagne px-3 py-2 rounded-lg text-lg font-bold min-w-[48px]">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 mt-1">SEC</div>
            </div>
          </div>
          {isPreOrder && (
            <div className="text-xs text-champagne font-medium bg-luxury-black/10 px-3 py-1 rounded-full">
              September 1st, 2025 • Early Bird Pricing
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
