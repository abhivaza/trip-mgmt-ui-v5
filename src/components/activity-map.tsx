import { useEffect, useRef, useState } from "react";
import { ItineraryDayActivity } from "../types/itinerary";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface ActivityMapProps {
  activities: ItineraryDayActivity[];
  onActivityClick?: (activity: ItineraryDayActivity) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function ActivityMap({ activities, onActivityClick }: ActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ItineraryDayActivity | null>(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete window.initMap;
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const initialMap = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 0, lng: 0 },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(initialMap);
  };

  useEffect(() => {
    if (!map || !activities.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Create bounds for auto-zoom
    const bounds = new window.google.maps.LatLngBounds();

    // Geocode each activity location and create markers
    activities.forEach((activity, index) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: `${activity.place}` },
        (results: any, status: string) => {
          if (status === "OK" && results[0]) {
            const position = results[0].geometry.location;
            bounds.extend(position);

            const marker = new window.google.maps.Marker({
              position,
              map,
              title: activity.title,
              label: {
                text: (index + 1).toString(),
                color: "white",
              },
              animation: window.google.maps.Animation.DROP,
            });

            // Create info window content
            const content = `
              <div class="p-2">
                <h3 class="font-semibold">${activity.title}</h3>
                <p class="text-sm text-gray-600">${activity.place}</p>
                <p class="text-sm mt-1">${activity.shortDescription}</p>
              </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
              content,
            });

            // Add click listener to marker
            marker.addListener("click", () => {
              infoWindow.open(map, marker);
              setSelectedActivity(activity);
              if (onActivityClick) {
                onActivityClick(activity);
              }
            });

            newMarkers.push(marker);
            setMarkers(newMarkers);

            // Fit map to bounds
            map.fitBounds(bounds);
          }
        }
      );
    });
  }, [map, activities]);

  return (
    <div className="relative h-[600px] w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
      
      {selectedActivity && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold">{selectedActivity.title}</h3>
              <p className="text-sm text-gray-600">{selectedActivity.place}</p>
              <p className="text-sm mt-2">{selectedActivity.shortDescription}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedActivity(null)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 