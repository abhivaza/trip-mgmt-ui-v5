import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../context/api-provider";
import { useToast } from "../hooks/use-toast";
import { ActivityMap } from "../components/activity-map";
import { Itinerary, ItineraryDayActivity } from "../types/itinerary";
import { Button } from "../components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/loading-spinner";

export default function TripMapPage() {
  const [itinerary, setItinerary] = useState<Itinerary>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const { trip_id } = useParams<{ trip_id: string }>();
  const navigate = useNavigate();

  const api = useApi();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!trip_id) return;

      try {
        setIsLoading(true);
        const itineraryData = await api.get<Itinerary>(`/app/trip/${trip_id}`);
        setItinerary(itineraryData);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch itinerary. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [api, trip_id, toast]);

  const handleActivityClick = (activity: ItineraryDayActivity) => {
    // Handle activity click - could be used to show more details or navigate
    console.log("Activity clicked:", activity);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">No itinerary found.</p>
      </div>
    );
  }

  const currentDayActivities = itinerary.itinerary?.find(
    (day) => day.dayNumber === selectedDay
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/app/trip/${trip_id}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Itinerary
          </Button>
          <h1 className="text-3xl font-bold">
            {itinerary.city}, {itinerary.country}
          </h1>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {itinerary.itinerary?.map((day) => (
            <Button
              key={day.dayNumber}
              variant={selectedDay === day.dayNumber ? "default" : "outline"}
              onClick={() => setSelectedDay(day.dayNumber)}
              className="whitespace-nowrap"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Day {day.dayNumber}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ActivityMap
          activities={currentDayActivities?.thingsToDo?.flatMap((section) =>
            section.activities.map((activity) => ({
              ...activity,
              place: currentDayActivities.place,
              dayNumber: currentDayActivities.dayNumber,
              shortDescription: activity.description.slice(0, 100) + "...",
            }))
          ) || []}
          onActivityClick={handleActivityClick}
        />
      </div>
    </div>
  );
} 