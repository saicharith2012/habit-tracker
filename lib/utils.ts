import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateMaxStreak(completedDates: string[]): number {
  if (completedDates.length === 0) {
    return 0
  }

  const sortedDates = completedDates
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime())

  let maxStreak = 0
  let currentStreak = 0

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1
    } else {
      const prevDate = sortedDates[i - 1]
      const currentDate = sortedDates[i]

      // Calculate difference in days
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
      } else if (diffDays > 1) {
        currentStreak = 1
      }
      // If diffDays is 0, it's a duplicate date, currentStreak remains the same
    }
    maxStreak = Math.max(maxStreak, currentStreak)
  }

  return maxStreak
}

export function getDaysSinceCreation(createdAt: Date): number {
  const today = new Date()
  // Set both dates to midnight to ensure accurate day difference calculation
  today.setHours(0, 0, 0, 0)
  createdAt.setHours(0, 0, 0, 0)

  const diffTime = Math.abs(today.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays + 1 // Add 1 to include the start day
}
