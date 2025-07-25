"use client"

import { useParams } from "next/navigation"
import { HabitDetail } from "@/components/HabitDetail"

export default function HabitDetailPage() {
  const params = useParams()
  const habitId = params.habitId as string

  return <HabitDetail habitId={habitId} />
}