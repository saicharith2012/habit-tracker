"use client"

import { HabitDetail } from "@/components/HabitDetail"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function HabitDetailPage() {
  const params = useParams()
  const habitId = params.habitId as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for demonstration
    setTimeout(() => {
      setLoading(false)
    }, 500) // Adjust as needed
  }, [])

  return <HabitDetail habitId={habitId} loading={loading} />
}