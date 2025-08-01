
import React from "react";

interface HabitStatsProps {
  currentStreak: number;
  maxStreak: number;
  totalCompleted: number;
  totalDays: number;
  layout?: "default" | "card";
}

export const HabitStats: React.FC<HabitStatsProps> = ({
  currentStreak,
  maxStreak,
  totalCompleted,
  totalDays,
  layout = "default",
}) => {
  if (layout === "card") {
    return (
      <div className="w-full flex justify-between">
        <div className="flex flex-col items-center text-center">
          <div className="text-xl font-semibold text-orange-500">
            {currentStreak}
          </div>
          <div className="text-xs text-gray-400">
            Current
            <br />
            streak
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="text-xl font-semibold text-blue-600">
            {maxStreak}
          </div>
          <div className="text-xs text-gray-400">
            Max
            <br />
            streak
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="text-xl font-semibold text-gray-700">
            {totalCompleted}/{totalDays}
          </div>
          <div className="text-xs text-gray-400">
            Total
            <br />
            days
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 mt-2 w-60">
      <div className="aspect-square flex flex-col items-center justify-center rounded-md bg-gray-100 text-gray-700 p-2 text-center">
        <span className="text-xs font-semibold">
          Current
          <br />
          Streak
        </span>
        <span className="text-lg font-bold text-orange-500">{currentStreak}</span>
      </div>
      <div className="aspect-square flex flex-col items-center justify-center rounded-md bg-gray-100 text-gray-700 p-2 text-center">
        <span className="text-xs font-semibold">
          Max
          <br />
          Streak
        </span>
        <span className="text-lg font-bold text-blue-600">{maxStreak}</span>
      </div>
      <div className="aspect-square flex flex-col items-center justify-center rounded-md bg-gray-100 text-gray-700 p-2 text-center">
        <span className="text-xs font-semibold">
          Total
          <br />
          Days
        </span>
        <span className="text-lg font-bold">
          {totalCompleted}/{totalDays}
        </span>
      </div>
    </div>
  );
};
