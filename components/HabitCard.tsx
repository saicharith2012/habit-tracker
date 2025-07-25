import { CalendarGrid } from "./CalendarGrid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { calculateMaxStreak, getDaysSinceCreation } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HabitCardProps {
  id: string;
  name: string;
  createdAt: Date;
  completedDates: string[];
  onDateClick: (date: string) => void;
}

export function HabitCard({
  id,
  name,
  createdAt,
  completedDates,
  onDateClick,
}: HabitCardProps) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const maxStreak = calculateMaxStreak(completedDates);

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col w-fit">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </CardTitle>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/${id}`} className="flex items-center gap-2">
                  <ArrowRight
                    className="w-5 h-5 text-gray-700"
                    strokeWidth={2.5}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>View total data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
      </CardHeader>
      <CardContent>
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          completedDates={completedDates}
          onDateClick={onDateClick}
          compact={true}
        />
      </CardContent>
      <CardFooter className="flex flex-col justify-between items-start pt-4">
        <div className="w-full flex justify-between">
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold text-blue-600">
              {maxStreak}
            </div>
            <div className="text-xs text-gray-400">Max streak</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold text-gray-700">
              {completedDates.length}/{getDaysSinceCreation(createdAt)}
            </div>
            <div className="text-xs text-gray-400">Total days</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Started{" "}
          {createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
