import { Habit } from "@/types/habit"

const HABITS_STORAGE_KEY = "habit-tracker-habits"

export const loadHabits = (): Habit[] => {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const serializedHabits = localStorage.getItem(HABITS_STORAGE_KEY)
    if (serializedHabits === null) {
      return []
    }
    const habits: Habit[] = JSON.parse(serializedHabits)
    // Convert createdAt strings back to Date objects
    return habits.map(habit => ({
      ...habit,
      createdAt: new Date(habit.createdAt)
    }))
  } catch (error) {
    console.error("Error loading habits from localStorage:", error)
    return []
  }
}

export const saveHabits = (habits: Habit[]) => {
  if (typeof window === "undefined") {
    return
  }
  try {
    // Convert Date objects to ISO strings before saving
    const serializableHabits = habits.map(habit => ({
      ...habit,
      createdAt: habit.createdAt.toISOString()
    }))
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(serializableHabits))
  } catch (error) {
    console.error("Error saving habits to localStorage:", error)
  }
}

export const getHabitById = (id: string): Habit | null => {
  const habits = loadHabits()
  return habits.find(habit => habit.id === id) || null
}

export const updateHabit = (updatedHabit: Habit) => {
  const habits = loadHabits()
  const newHabits = habits.map(habit => 
    habit.id === updatedHabit.id ? updatedHabit : habit
  )
  saveHabits(newHabits)
}

export const deleteHabit = (id: string) => {
  const habits = loadHabits()
  const newHabits = habits.filter(habit => habit.id !== id)
  saveHabits(newHabits)
}
