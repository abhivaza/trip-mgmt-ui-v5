import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, MoreVertical, MapPin, Calendar } from "lucide-react";
import { Itinerary } from "@/types/itinerary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";

interface TripCardProps {
  trip: Itinerary;
  onEdit?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const [open, setOpen] = useState(false);

  const handleEdit = (id: string) => {
    onEdit?.(id || "");
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    onDelete?.(id || "");
    setOpen(false);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md relative py-0">
      <Link to={`/app/trip/${trip.id}`} className="block">
        <img
          src={trip.imageURL || ""}
          alt={trip.city || "Trip Image"}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
        />
        <CardHeader className="py-4">
          <CardTitle className="text-xl">
            {trip.city}, {trip.country}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" /> {trip.city}, {trip.country}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {new Date(trip.fromDate || "").toLocaleDateString()} -{" "}
              {new Date(
                new Date(trip.fromDate || "").setDate(
                  new Date(trip.fromDate || "").getDate() +
                    (trip.tripDuration || 0)
                )
              ).toLocaleDateString()}{" "}
              ({trip.tripDuration} days)
            </span>
          </div>
        </CardContent>
      </Link>
      {onEdit && onDelete && (
        <div className="absolute top-2 right-2">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full bg-white/80 hover:bg-white/90 transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleEdit(trip.id || "")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDelete(trip.id || "")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  );
}
