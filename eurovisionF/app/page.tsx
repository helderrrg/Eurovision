"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal } from "lucide-react"

interface Odd {
  country: string
  odd: string
}

export default function Home() {
  const [odds, setOdds] = useState<Odd[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/odds`)
        if (!response.ok) {
          throw new Error("Error searching for API information")
        }
        const data = await response.json()
        setOdds(data)
      } catch (err) {
        setError("Not able to load the odds. Try again later." + err)
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Eurovision 2025 Odds
            <Trophy className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? <LoadingState /> : error ? <ErrorState error={error} /> : <OddsTable odds={odds} />}
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="p-6 text-center">
      <div className="text-red-500 font-semibold p-5">{error}</div>
    </div>
  )
}

function OddsTable({ odds }: { odds: Odd[] }) {
  // Find the highest odd to calculate relative percentages for visual bars
  const highestOdd = Math.max(...odds.map((item) => Number.parseFloat(item.odd)))

  return (
    <div className="overflow-hidden rounded-b-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Position</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Country</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600 dark:text-gray-300">Chance</th>
              <th className="py-3 px-4 text-right font-medium text-gray-600 dark:text-gray-300">Probability</th>
            </tr>
          </thead>
          <tbody>
            {odds.map((item, index) => {
              const percentage = Number.parseFloat(item.odd)
              const relativePercentage = (percentage / highestOdd) * 100

              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">
                    {index === 0 ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
                        <Trophy className="h-4 w-4" />
                      </div>
                    ) : index === 1 ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : index === 2 ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500">
                        {index + 1}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{item.country}</td>
                  <td className="py-3 px-4 w-full max-w-xs">
                    <Progress
                      value={relativePercentage}
                      className={`h-2 ${index === 0 ? "bg-yellow-100" : index === 1 ? "bg-gray-100" : index === 2 ? "bg-amber-100" : "bg-gray-100"}`}
                      indicatorClassName={`${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-500" : index === 2 ? "bg-amber-500" : "bg-blue-500"}`}
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-bold">
                    <span
                      className={`
                      ${
                        index === 0
                          ? "text-yellow-600"
                          : index === 1
                            ? "text-gray-600"
                            : index === 2
                              ? "text-amber-600"
                              : "text-gray-700"
                      }
                    `}
                    >
                      {item.odd}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

