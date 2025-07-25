import { CalendarGrid } from "./CalendarGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface HabitCardProps {
  id: string
  name: string
  createdAt: Date
  completedDates: string[]
}

export function HabitCard({ id, name, createdAt, completedDates }: HabitCardProps) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Calculate completion rate for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const completedThisMonth = completedDates.filter((date) => {
    const d = new Date(date)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  }).length

  const completionRate = Math.round((completedThisMonth / daysInMonth) * 100)

  return (
    <Link href={`/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{name}</CardTitle>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
              <div className="text-xs text-gray-500">this month</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarGrid
            year={currentYear}
            month={currentMonth}
            completedDates={completedDates}
            onDateClick={(date) => {
              console.log("Date clicked:", date)
            }}
            compact={true}
          />
          <div className="mt-4 text-sm text-gray-500">
            Started{" "}
            {createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
