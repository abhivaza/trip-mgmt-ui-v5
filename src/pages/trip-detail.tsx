"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../context/api-provider";
import { useToast } from "../hooks/use-toast";
import { TripImage } from "../components/trip-image";
import { TripMeta } from "../components/trip-meta";
import { DayCard } from "../components/day-card";
import { ChatbotSection } from "../components/chatbot";
import { useResponsive } from "../hooks/use-responsive";
import { TRY_AGAIN_TEXT } from "../lib/app-utils";
import type { Itinerary } from "../types/itinerary";
import LoadingSpinner from "../components/loading-spinner";
import { Calendar, RefreshCw, Edit2, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function TripDetailPage() {
  const [itinerary, setItinerary] = useState<Itinerary>();
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useResponsive();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newStartDate, setNewStartDate] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { trip_id } = useParams<{ trip_id: string }>();

  const api = useApi();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!trip_id) return;

      try {
        setIsLoading(true);

        const itineraryData = await api.get<Itinerary>(`/app/trip/${trip_id}`);
        if (itineraryData?.itinerary?.length === 0) {
          toast({
            title: "Error",
            description: "Invalid destination." + " " + TRY_AGAIN_TEXT,
            variant: "destructive",
          });
          return;
        }

        setItinerary(itineraryData);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch itinerary." + " " + TRY_AGAIN_TEXT,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [api, trip_id, toast]);

  const handleEditStartDate = () => {
    if (itinerary?.fromDate) {
      setNewStartDate(new Date(itinerary.fromDate).toISOString().split("T")[0]);
    }
    setIsEditingDate(true);
  };

  const handleSaveStartDate = async () => {
    if (!trip_id || !newStartDate) return;

    try {
      const updatedItinerary = {
        ...itinerary,
        fromDate: newStartDate,
      };

      await api.put(`/app/trip/${trip_id}`, updatedItinerary);
      setItinerary(updatedItinerary);
      setIsEditingDate(false);

      toast({
        title: "Success",
        description: "Start date updated successfully!",
      });
    } catch (error) {
      console.error("Error updating start date:", error);
      toast({
        title: "Error",
        description: "Failed to update start date. " + TRY_AGAIN_TEXT,
        variant: "destructive",
      });
    }
  };

  const handleRegenerateTrip = async () => {
    if (!trip_id) return;

    try {
      setIsRegenerating(true);

      const regeneratedItinerary = await api.post<{}, Itinerary>(
        `/app/trip/${trip_id}/regenerate`,
        {}
      );

      if (regeneratedItinerary?.itinerary?.length === 0) {
        toast({
          title: "Error",
          description: "Failed to regenerate trip. " + TRY_AGAIN_TEXT,
          variant: "destructive",
        });
        return;
      }

      setItinerary(regeneratedItinerary);
      toast({
        title: "Success",
        description: "Trip regenerated successfully!",
      });
    } catch (error) {
      console.error("Error regenerating trip:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate trip. " + TRY_AGAIN_TEXT,
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <LoadingSpinner />
      </div>
    );
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

      {itinerary && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Start Date:</span>
                  {isEditingDate ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="w-auto h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSaveStartDate}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingDate(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {itinerary.fromDate
                          ? new Date(
                              itinerary.fromDate.substring(0, 10)
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEditStartDate}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <TripMeta
                tags={itinerary?.tags}
                popularityRank={itinerary?.popularityRank}
              />
            </div>

            <div className="flex-1 flex justify-end">
              <Button
                onClick={handleRegenerateTrip}
                size="sm"
                disabled={isRegenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
                />
                {isRegenerating ? "Regenerating..." : "Regenerate Trip"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
  );
}
