"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Edit, Check, X } from "lucide-react";
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
import { HabitStats } from "./HabitStats";
import { YearlyHabitTracker } from "@/components/YearlyHabitTracker";
import { calculateCurrentStreak, calculateMaxStreak } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface HabitDetailProps {
  habitId: string;
  loading: boolean;
}

export function HabitDetail({ habitId, loading }: HabitDetailProps) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmAction, setModalConfirmAction] = useState<
    (() => void) | null
  >(null);
  const router = useRouter();
  const [displayMode, setDisplayMode] = useState<"last371days" | "yearly">(
    "last371days"
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!loading) {
      const loadedHabit = getHabitById(habitId);
      setHabit(loadedHabit);
      if (loadedHabit) {
        setNewName(loadedHabit.name);
      }
    }
  }, [habitId, loading]);

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
        router.push("/");
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleSaveName = () => {
    if (habit && newName.trim() !== "") {
      const updatedHabit = { ...habit, name: newName.trim() };
      setHabit(updatedHabit);
      updateHabit(updatedHabit);
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    if (habit) {
      setNewName(habit.name);
    }
    setIsEditingName(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading habit details...
            </h1>
          </div>
        </div>
      </div>
    );
  }

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
  const startYear = createdAtDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  const calculateTotalDays = () => {
    const today = new Date();
    const created = new Date(habit.createdAt);
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const maxStreak = calculateMaxStreak(habit.completedDates);
  const totalDays = calculateTotalDays();
  const currentStreak = calculateCurrentStreak(habit.completedDates);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="flex flex-col items-start mb-8 sm:mb-0 sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="mx-2 my-4">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="text-3xl font-bold text-gray-900"
                />
                <Button size="sm" onClick={handleSaveName}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEditName}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {habit.name.charAt(0).toUpperCase() + habit.name.slice(1)}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </h1>
            )}
            <p className="text-gray-600 mt-1">
              Started{" "}
              {createdAtDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <HabitStats
              currentStreak={currentStreak}
              maxStreak={maxStreak}
              totalCompleted={habit.completedDates.length}
              totalDays={totalDays}
            />
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

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <YearlyHabitTracker
              completedDates={habit.completedDates}
              onDateClick={handleDateClick}
              displayMode={displayMode}
              selectedYear={selectedYear}
            />
          </div>
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                onClick={() => {
                  setDisplayMode("yearly");
                  setSelectedYear(year);
                }}
                className="w-fit"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
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