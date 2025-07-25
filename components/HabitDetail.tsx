"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  getHabitById,
  updateHabit,
  deleteHabit,
} from "@/lib/localStorageUtils";
import { Habit } from "@/types/habit";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { YearlyHabitTracker } from "@/components/YearlyHabitTracker";

interface HabitDetailProps {
  habitId: string;
}

export function HabitDetail({ habitId }: HabitDetailProps) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmAction, setModalConfirmAction] = useState<
    (() => void) | null
  >(null);
  const router = useRouter();

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
    setModalConfirmAction(null);
    setModalMessage("");
  };

  const handleConfirmModalConfirm = () => {
    if (modalConfirmAction) {
      modalConfirmAction();
    }
    handleConfirmModalClose();
  };

  useEffect(() => {
    console.log("HabitDetail: habitId from params", habitId);
    const loadedHabit = getHabitById(habitId);
    console.log("HabitDetail: loadedHabit", loadedHabit);
    setHabit(loadedHabit);
  }, [habitId]);

  const toggleHabitCompletion = (date: string) => {
    if (!habit) return;

    const newCompletedDates = habit.completedDates.includes(date)
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date];

    const updatedHabit = { ...habit, completedDates: newCompletedDates };
    setHabit(updatedHabit);
    updateHabit(updatedHabit);
  };

  const handleDateClick = (date: string) => {
    toggleHabitCompletion(date);
  };

  const handleDeleteHabit = () => {
    setModalMessage(
      `Are you sure you want to delete the habit "${habit?.name}"? This action cannot be undone.`
    );
    setModalConfirmAction(() => () => {
      if (habit) {
        deleteHabit(habit.id);
        router.push("/"); // Redirect to dashboard after deletion
      }
    });
    setIsConfirmModalOpen(true);
  };

  if (!habit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Habit not found
            </h1>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdAtDate = habit.createdAt;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-start gap-4 mb-8">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="mx-2 my-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {habit.name.charAt(0).toUpperCase() + habit.name.slice(1)}
            </h1>
            <p className="text-gray-600 mt-1">
              Started{" "}
              {createdAtDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteHabit}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Habit
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Delete this habit permanently</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Yearly Habit Tracker */}
        <YearlyHabitTracker
          completedDates={habit.completedDates}
          onDateClick={handleDateClick}
          createdAt={habit.createdAt}
        />
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmModalConfirm}
        message={modalMessage}
      />
    </div>
  );
}
