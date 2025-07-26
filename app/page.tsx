"use client"

import { useEffect, useState } from "react"
import { HabitCard } from "@/components/HabitCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddHabitDialog } from "@/components/AddHabitDialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { loadHabits, saveHabits } from "@/lib/localStorageUtils"
import { Habit } from "@/types/habit"

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const currentDay = currentDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    setHabits(loadHabits())
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      saveHabits(habits)
    }
  }, [habits, loading])

  const handleAddHabit = (habitName: string) => {
    const newHabit: Habit = {
      id: String(Date.now()), // Unique ID
      name: habitName,
      createdAt: new Date(),
      completedDates: [],
    }
    setHabits((prevHabits) => [...prevHabits, newHabit])
  }

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const newCompletedDates = habit.completedDates.includes(date)
            ? habit.completedDates.filter((d) => d !== date)
            : [...habit.completedDates, date]
          return { ...habit, completedDates: newCompletedDates }
        }
        return habit
      })
    )
  }

  const handleDateClick = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly progress for {currentMonthYear}</h1>
            <p className="text-gray-600 mt-1">{currentDay}</p>
          </div>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="flex items-center gap-2" onClick={() => setIsAddHabitOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Add New Habit
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Add a new habit to track</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Habits Grid */}
        <div className="flex flex-wrap justify-start gap-4">
          {loading ? (
            <div className="w-full text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">Loading habits...</h2>
            </div>
          ) : habits.length > 0 ? (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                createdAt={habit.createdAt}
                completedDates={habit.completedDates}
                onDateClick={(date) => handleDateClick(habit.id, date)}
              />
            ))
          ) : (
            <div className="w-full text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700">No habits yet!</h2>
              <p className="text-gray-500 mt-2">Click &quot;Add New Habit&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {isAddHabitOpen && (
        <AddHabitDialog
          onOpenChange={setIsAddHabitOpen}
          onAddHabit={handleAddHabit}
        />
      )}
    </div>
  )
}
