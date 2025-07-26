"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useLayoutEffect } from "react";

interface YearlyHabitTrackerProps {
  completedDates: string[];
  onDateClick: (date: string) => void;
  displayMode: "last371days" | "yearly";
  selectedYear?: number;
}

export function YearlyHabitTracker({
  completedDates,
  onDateClick,
  displayMode,
  selectedYear,
}: YearlyHabitTrackerProps) {
  const todayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (displayMode === "last371days" && todayRef.current && containerRef.current) {
      const container = containerRef.current;
      const today = todayRef.current;
      const containerWidth = container.offsetWidth;
      const todayPosition = today.offsetLeft + today.offsetWidth / 2;
      const scrollPosition = todayPosition - containerWidth / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [displayMode]);

  const getDays = () => {
    const days = [];
    if (displayMode === "last371days") {
      const today = new Date();
      for (let i = 0; i < 371; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push(date);
      }
      return days.reverse();
    } else if (displayMode === "yearly" && selectedYear) {
      const date = new Date(selectedYear, 0, 1);
      while (date.getFullYear() === selectedYear) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    }
    return [];
  };

  const days = getDays();

  const getDayColorClass = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    if (completedDates.includes(dateString)) {
      return "bg-green-500";
    }
    return "bg-gray-200";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeks: (Date | null)[][] = [];
  if (days.length > 0) {
    let currentWeek: (Date | null)[] = Array(7).fill(null);
    const firstDay = days[0];
    const dayOffset = firstDay.getDay();

    for (let i = 0; i < dayOffset; i++) {
      currentWeek[i] = null;
    }

    days.forEach((day) => {
      const dayOfWeek = day.getDay();
      currentWeek[dayOfWeek] = day;
      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    });

    if (currentWeek.some((day) => day !== null)) {
      weeks.push(currentWeek);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full bg-white px-2 pt-2 pb-0 rounded-lg">
      <div
        className="flex justify-center w-full overflow-x-auto"
        ref={containerRef}
      >
        <div className="flex flex-col gap-1 mr-3 text-xs text-gray-500 justify-start h-fit">
          {dayNames.map((day) => (
            <div key={day} className="h-4 flex items-center justify-end">
              {day}
            </div>
          ))}
        </div>
        <div className="flex flex-grow overflow-x-auto pb-2 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const isToday = date && date.toDateString() === new Date().toDateString();
                const dayBlock = (
                  <div
                    ref={isToday ? todayRef : null}
                    className={cn(
                      "w-4 h-4 rounded-sm",
                      date ? getDayColorClass(date) : "bg-transparent",
                      date && date > new Date()
                        ? "cursor-default"
                        : isToday
                        ? "cursor-pointer"
                        : "cursor-default"
                    )}
                    onClick={() => {
                      if (isToday) {
                        onDateClick(
                          `${date.getFullYear()}-${(date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}-${date
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`
                        );
                      }
                    }}
                  >
                    {date && date.getDate() === 1 && (
                      <div className="absolute -top-4 text-xs text-gray-500 -ml-2">
                        {date.toLocaleString("en-US", { month: "short" })}
                      </div>
                    )}
                  </div>
                );

                return (
                  <TooltipProvider
                    key={
                      date
                        ? date.toISOString()
                        : `empty-${weekIndex}-${dayIndex}`
                    }
                    delayDuration={100}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>{dayBlock}</TooltipTrigger>
                      <TooltipContent>
                        {date &&
                          date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
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
}