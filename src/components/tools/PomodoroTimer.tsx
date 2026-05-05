import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    toast.success(mode === 'work' ? 'Break time!' : 'Time to focus!', {
      duration: 5000,
    });
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-2">
          <Button 
            variant={mode === 'work' ? 'default' : 'outline'} 
            onClick={() => { setMode('work'); reset(); }}
          >
            Work (25m)
          </Button>
          <Button 
            variant={mode === 'break' ? 'default' : 'outline'} 
            onClick={() => { setMode('break'); reset(); }}
          >
            Break (5m)
          </Button>
        </div>

        <div className="relative inline-flex items-center justify-center">
          <svg className="w-64 h-64">
            <circle
              className="text-muted/20"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
            <circle
              className="text-primary transition-all duration-1000 -rotate-90 origin-center"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60))}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
          </svg>
          <div className="absolute text-6xl font-bold font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" className="rounded-full w-16 h-16" onClick={toggle}>
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
          <Button variant="outline" size="lg" className="rounded-full w-16 h-16" onClick={reset}>
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
