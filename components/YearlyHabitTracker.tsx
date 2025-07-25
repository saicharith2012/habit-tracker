"use client"

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface YearlyHabitTrackerProps {
  completedDates: string[];
  createdAt: Date;
  onDateClick: (date: string) => void;
}

export function YearlyHabitTracker({ completedDates, createdAt, onDateClick }: YearlyHabitTrackerProps) {
  const startYear = createdAt.getFullYear();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  const getDaysInYear = (year: number) => {
    const days = [];
    
    const date = new Date(year, 0, 1);
    

    while (date.getFullYear() === year) {
      // console.log("getDaysInYear - Date before push:", date);
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDayColorClass = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    // console.log("getDayColorClass - Checking date:", date, "Date string:", dateString, "Completed dates:", completedDates);
    if (completedDates.includes(dateString)) {
      return 'bg-green-500'; // Completed
    }
    return 'bg-gray-200'; // Not completed
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col items-center space-y-8 p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      {years.map(year => {
        const days = getDaysInYear(year);

        // Group days into weeks for rendering
        const weeks: (Date | null)[][] = [];
        let currentWeek: (Date | null)[] = Array(7).fill(null);

        // Find the starting day of the week for Jan 1st
        const firstDayOfYear = new Date(year, 0, 1);
        const dayOffset = firstDayOfYear.getDay(); // 0 for Sunday, 1 for Monday, etc.

        // Fill initial padding for the first week
        for (let i = 0; i < dayOffset; i++) {
          currentWeek[i] = null;
        }

        days.forEach(day => {
          const dayOfWeek = day.getDay();
          currentWeek[dayOfWeek] = day;

          if (dayOfWeek === 6) { // If it's Saturday, week is complete
            weeks.push(currentWeek);
            currentWeek = Array(7).fill(null);
          }
        });

        // Push the last partial week if it exists
        if (currentWeek.some(day => day !== null)) {
          weeks.push(currentWeek);
        }

        return (
          <div key={year} className="flex flex-col items-center space-y-4 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{year}</h2>
            <div className="flex justify-center w-full overflow-x-auto">
              <div className="flex flex-col gap-1 mr-2 text-xs text-gray-500 justify-around py-1">
                {dayNames.map(day => (
                  <div key={day} className="h-4 flex items-center justify-end">
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex flex-grow overflow-x-auto pb-2 gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((date, dayIndex) => {
                      const dayBlock = (
                        <div
                          className={cn(
                            'w-4 h-4 rounded-sm',
                            date ? getDayColorClass(date) : 'bg-transparent',
                            date && date > new Date() ? 'cursor-default' : 
                            date && date.toDateString() === new Date().toDateString() ? 'cursor-pointer' : 'cursor-default'
                          )}
                          onClick={() => {
                            const today = new Date();
                            const isToday = date && date.getFullYear() === today.getFullYear() &&
                                          date.getMonth() === today.getMonth() &&
                                          date.getDate() === today.getDate();
                            if (isToday) {
                              onDateClick(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`);
                            }
                          }}
                        >
                          {date && date.getDate() === 1 && (
                            <div className="absolute -top-4 text-xs text-gray-500 -ml-2">
                              {date.toLocaleString('en-US', { month: 'short' })}
                            </div>
                          )}
                        </div>
                      );

                      return (
                        <TooltipProvider key={date ? date.toISOString() : `empty-${weekIndex}-${dayIndex}`} delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {dayBlock}
                            </TooltipTrigger>
                            <TooltipContent>
                              {date && date.toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
