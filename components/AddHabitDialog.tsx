"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddHabitDialogProps {
  onOpenChange: (isOpen: boolean) => void
  onAddHabit: (habitName: string) => void
}

export function AddHabitDialog({ onOpenChange, onAddHabit }: AddHabitDialogProps) {
  const [habitName, setHabitName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleAddHabit = () => {
    if (habitName.trim() !== "") {
      onAddHabit(habitName.trim())
      onOpenChange(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Add New Habit</h2>
        <Input
          ref={inputRef}
          placeholder="Habit name (e.g., Drink Water)"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddHabit}>Add Habit</Button>
        </div>
      </div>
    </div>
  )
}
