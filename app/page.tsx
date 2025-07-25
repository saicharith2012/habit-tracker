import { HabitCard } from "@/components/HabitCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Placeholder data
const habits = [
  {
    id: "1",
    name: "Morning Exercise",
    createdAt: new Date("2024-01-01"),
    completedDates: [
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
  {
    id: "2",
    name: "Read 30 Minutes",
    createdAt: new Date("2024-01-15"),
    completedDates: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-19", "2024-01-21", "2024-01-23", "2024-01-25"],
  },
  {
    id: "3",
    name: "Drink 8 Glasses of Water",
    createdAt: new Date("2023-12-01"),
    completedDates: [
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
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-600 mt-1">Track your daily habits and build consistency</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Habit
          </Button>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              id={habit.id}
              name={habit.name}
              createdAt={habit.createdAt}
              completedDates={habit.completedDates}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
