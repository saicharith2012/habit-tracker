import { CalendarGrid } from "@/components/CalendarGrid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Placeholder data - in a real app, this would come from a database
const getHabitData = (habitId: string) => {
  const habits = {
    "1": {
      id: "1",
      name: "Morning Exercise",
      createdAt: new Date("2023-10-01"),
      completedDates: [
        "2023-10-01",
        "2023-10-02",
        "2023-10-05",
        "2023-10-08",
        "2023-10-10",
        "2023-11-01",
        "2023-11-03",
        "2023-11-05",
        "2023-11-08",
        "2023-11-12",
        "2023-12-02",
        "2023-12-05",
        "2023-12-08",
        "2023-12-12",
        "2023-12-15",
        "2024-01-01",
        "2024-01-02",
        "2024-01-05",
        "2024-01-08",
        "2024-01-10",
        "2024-01-12",
        "2024-01-15",
        "2024-01-18",
        "2024-01-20",
        "2024-01-22",
      ],
    },
    "2": {
      id: "2",
      name: "Read 30 Minutes",
      createdAt: new Date("2023-12-01"),
      completedDates: [
        "2023-12-01",
        "2023-12-03",
        "2023-12-05",
        "2023-12-08",
        "2023-12-12",
        "2024-01-15",
        "2024-01-16",
        "2024-01-17",
        "2024-01-19",
        "2024-01-21",
        "2024-01-23",
        "2024-01-25",
      ],
    },
    "3": {
      id: "3",
      name: "Drink 8 Glasses of Water",
      createdAt: new Date("2023-09-01"),
      completedDates: [
        "2023-09-01",
        "2023-09-03",
        "2023-09-05",
        "2023-09-08",
        "2023-09-12",
        "2023-10-02",
        "2023-10-05",
        "2023-10-08",
        "2023-10-12",
        "2023-10-15",
        "2023-11-01",
        "2023-11-03",
        "2023-11-05",
        "2023-11-08",
        "2023-11-12",
        "2023-12-02",
        "2023-12-05",
        "2023-12-08",
        "2023-12-12",
        "2023-12-15",
        "2024-01-01",
        "2024-01-03",
        "2024-01-04",
        "2024-01-06",
        "2024-01-07",
        "2024-01-09",
        "2024-01-11",
        "2024-01-13",
        "2024-01-14",
        "2024-01-16",
        "2024-01-17",
        "2024-01-19",
        "2024-01-21",
        "2024-01-24",
      ],
    },
  }

  return habits[habitId as keyof typeof habits] || null
}

// Generate array of months from start date to current date
const getMonthsRange = (startDate: Date, endDate: Date = new Date()) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (current <= end) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }

  return months
}

interface HabitDetailPageProps {
  params: Promise<{ habitId: string }>
}

export default async function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { habitId } = await params
  const habit = getHabitData(habitId)

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Habit not found</h1>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const months = getMonthsRange(habit.createdAt)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{habit.name}</h1>
            <p className="text-gray-600 mt-1">
              Started{" "}
              {habit.createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Calendar Grids */}
        <div className="space-y-8">
          {months.reverse().map((month) => (
            <div key={month.toISOString()} className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <CalendarGrid
                year={month.getFullYear()}
                month={month.getMonth()}
                completedDates={habit.completedDates}
                onDateClick={(date) => {
                  console.log("Date clicked:", date)
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
