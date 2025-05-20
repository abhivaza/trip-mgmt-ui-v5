"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useApi } from "../context/api-provider"
import { useToast } from "../hooks/use-toast"
import { ChatbotSection } from "../components/chatbot"
import type { Itinerary } from "../types/itinerary"
import LoadingSpinner from "../components/loading-spinner"
import { TripCard } from "../components/trip-card"
import { TRY_AGAIN_TEXT } from "../lib/app-utils"
import { DeleteConfirmDialog } from "../components/delete-confirmation-dialog"
import { useResponsive } from "../hooks/use-responsive"

export default function TripsPage() {
  const [trips, setTrips] = useState<Itinerary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isMobile } = useResponsive()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tripToDelete, setTripToDelete] = useState<Itinerary | null>(null)
  const navigate = useNavigate()
  const api = useApi()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTrips() {
      try {
        setIsLoading(true)
        const tripsData = await api.get<Itinerary[]>("/app/trips")
        setTrips(tripsData)
      } catch (error) {
        console.error("Error fetching trips:", error)
        toast({
          title: "Error",
          description: "Failed to fetch trips." + " " + TRY_AGAIN_TEXT,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [api, toast])

  const handleEditTrip = (tripId: string) => {
    navigate(`/app/trip/${tripId}`)
  }

  const handleDeleteTrip = (tripId: string) => {
    setTripToDelete(trips.find((trip) => trip.id === tripId) || null)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!tripToDelete) return

    try {
      setIsLoading(true)
      setIsDeleteDialogOpen(false)
      await api.delete(`/app/trip/${tripToDelete.id}`)
      // Update the trips state by filtering out the deleted trip
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripToDelete.id))
      toast({
        title: "Success",
        description: "Trip deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast({
        title: "Error",
        description: "Failed to delete trip. " + TRY_AGAIN_TEXT,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Trips</h1>
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-6`}>
        <div className={`w-full`}>
          {trips.length === 0 ? (
            <div className="text-center">
              <p className="mb-4">You haven&apos;t created any trips yet.</p>
              <Button onClick={() => navigate("/")}>Plan a New Trip</Button>
            </div>
          ) : (
            <div className={isMobile ? "flex flex-col gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          )}
        </div>
        <div className={`${isMobile ? "w-full" : "w-2/5 min-w-[300px]"}`}>
          <ChatbotSection chatInitType="general" />
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Trip"
        description={`Are you sure you want to delete trip to ${tripToDelete?.city}, ${tripToDelete?.country}? This action cannot be undone.`}
      />
    </div>
  )
}
