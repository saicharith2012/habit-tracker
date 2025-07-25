"use client"

import { cn } from "@/lib/utils"

interface CalendarGridProps {
  year: number
  month: number
  completedDates: string[]
  onDateClick: (date: string) => void
  compact?: boolean
}

export function CalendarGrid({ year, month, completedDates, onDateClick, compact = false }: CalendarGridProps) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Create array of all dates in the calendar grid
  const calendarDates = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDates.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDates.push(day)
  }

  // Check if a date is completed
  const isDateCompleted = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return completedDates.includes(dateString)
  }

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  // Check if date is in the future
  const isFuture = (day: number) => {
    const today = new Date()
    const dateToCheck = new Date(year, month, day)
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
    today.setHours(0, 0, 0, 0)
    dateToCheck.setHours(0, 0, 0, 0)
    return dateToCheck > today
  }

  // Check if date is in the past
  const isPast = (day: number) => {
    const today = new Date()
    const dateToCheck = new Date(year, month, day)
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
    today.setHours(0, 0, 0, 0)
    dateToCheck.setHours(0, 0, 0, 0)
    return dateToCheck < today
  }

  const handleDateClick = (day: number) => {
    if (isFuture(day) || isPast(day)) return

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    onDateClick(dateString)
  }

  
  const gridGap = compact ? "gap-0.5" : "gap-1"

  return (
    <div className={cn(compact ? "w-[280px]" : "w-[350px]", "h-fit")}>
      {/* Days of week header */}
      <div className={cn("grid grid-cols-7 mb-2", gridGap)}>
        {daysOfWeek.map((day) => (
          <div key={day} className={cn("text-center font-medium text-gray-500", compact ? "text-xs" : "text-sm")}>
            {compact ? day.slice(0, 1) : day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={cn("grid grid-cols-7", gridGap)}>
        {calendarDates.map((day, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square flex items-center justify-center rounded-md transition-colors",
              day && !isFuture(day) && "cursor-pointer hover:bg-gray-100",
              day && isFuture(day) && "cursor-not-allowed text-gray-400",
              !day && "cursor-default",
            )}
            onClick={() => day && handleDateClick(day)}
          >
            {day && (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center rounded-md transition-colors leading-none",
                  compact ? "text-xs" : "text-sm", // Apply text size here
                  isFuture(day) ? "bg-gray-50 text-gray-400" : // If future, always grey
              isDateCompleted(day) ? "bg-green-500 text-white font-medium" : // If completed, green (prioritize completed)
              isPast(day) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : // If past and not completed, grey and not allowed
              isToday(day) ? "ring-2 ring-blue-500 bg-blue-50 text-blue-700" : // If today and not completed, blue ring
              "bg-gray-100 text-gray-700 hover:bg-gray-200", // Default for current non-completed and not completed
              isToday(day) && isDateCompleted(day) && "ring-2 ring-black", // Additional ring for completed today,
                )}
              >
                {day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
