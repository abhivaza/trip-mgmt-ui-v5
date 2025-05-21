"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useApi } from "../context/api-provider"
import { useToast } from "../hooks/use-toast"
import { TripImage } from "../components/trip-image"
import { TripMeta } from "../components/trip-meta"
import { DayCard } from "../components/day-card"
import { ChatbotSection } from "../components/chatbot"
import { useResponsive } from "../hooks/use-responsive"
import { TRY_AGAIN_TEXT } from "../lib/app-utils"
import type { Itinerary } from "../types/itinerary"
import LoadingSpinner from "../components/loading-spinner"

export default function TripDetailPage() {
  const [itinerary, setItinerary] = useState<Itinerary>()
  const [isLoading, setIsLoading] = useState(true)
  const { isMobile } = useResponsive()

  const { trip_id } = useParams<{ trip_id: string }>()

  const api = useApi()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      if (!trip_id) return

      try {
        setIsLoading(true)

        const itineraryData = await api.get<Itinerary>(`/app/trip/${trip_id}`)
        if (itineraryData?.itinerary?.length === 0) {
          toast({
            title: "Error",
            description: "Invalid destination." + " " + TRY_AGAIN_TEXT,
            variant: "destructive",
          })
          return
        }

        setItinerary(itineraryData)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to fetch itinerary." + " " + TRY_AGAIN_TEXT,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [api, trip_id, toast])

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      {itinerary && (
        <TripImage
          imageURL={itinerary.imageURL || ""}
          highlight={`Your Trip to ${itinerary?.city}, ${itinerary?.country}`}
          trip={itinerary}
        />
      )}

      <TripMeta tags={itinerary?.tags} popularityRank={itinerary?.popularityRank} />

      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-6`}>
        <div className={`w-full`}>
          <div className="flex flex-col gap-6">
            {itinerary?.itinerary?.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                tripId={trip_id || ""}
                itinerary={itinerary}
                setItinerary={setItinerary}
              />
            ))}
          </div>
        </div>

        <div className={`${isMobile ? "w-full" : "w-2/5 min-w-[300px]"}`}>
          <ChatbotSection chatInitType="trip-specific" />
        </div>
      </div>
    </div>
  )
}
