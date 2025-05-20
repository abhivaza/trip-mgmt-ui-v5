import { TripToolbar } from "./trip-toolbar"
import type { Itinerary } from "../types/itinerary"

interface TripImageProps {
  imageURL: string
  highlight: string
  trip: Itinerary
}

export const TripImage = ({ imageURL, highlight, trip }: TripImageProps) => {
  return (
    <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
      <img
        src={imageURL || "/placeholder.svg"}
        alt={`${highlight}`}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
        <h2 className="text-white text-3xl font-bold drop-shadow-lg">{highlight}</h2>
      </div>
      <div className="absolute top-4 right-4">
        <TripToolbar trip={trip} />
      </div>
    </div>
  )
}
