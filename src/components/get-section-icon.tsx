import {
  MountainIcon as Hiking,
  Utensils,
  TrendingUp,
  MapPin,
  Camera,
  Car,
  Sparkles,
  Plane,
  Hotel,
  ShoppingBag,
  Coffee,
  Ticket,
  Sunset,
  Waves,
  Bike,
  Tent,
  Wine,
  Music,
  Landmark,
} from "lucide-react";
import type { ReactNode } from "react";

/**
 * Returns an icon component based on the section title
 * @param title The title of the section
 * @returns A React element with the appropriate icon
 */
export function getSectionIcon(title: string): ReactNode {
  // Convert title to lowercase for case-insensitive matching
  const normalizedTitle = title.toLowerCase();

  // Map of keywords to icons
  const iconMap: Record<string, ReactNode> = {
    // Exact matches for common section titles
    "hiking plan": <Hiking className="h-5 w-5" />,
    "dining plan": <Utensils className="h-5 w-5" />,
    "trending reels": <TrendingUp className="h-5 w-5" />,
    "must-see landmarks": <MapPin className="h-5 w-5" />,
    "photography spots": <Camera className="h-5 w-5" />,
    transportation: <Car className="h-5 w-5" />,

    // Partial keyword matches
    hik: <Hiking className="h-5 w-5" />,
    trek: <Hiking className="h-5 w-5" />,
    trail: <Hiking className="h-5 w-5" />,
    mountain: <Hiking className="h-5 w-5" />,

    din: <Utensils className="h-5 w-5" />,
    food: <Utensils className="h-5 w-5" />,
    eat: <Utensils className="h-5 w-5" />,
    restaurant: <Utensils className="h-5 w-5" />,
    cuisine: <Utensils className="h-5 w-5" />,

    trend: <TrendingUp className="h-5 w-5" />,
    popular: <TrendingUp className="h-5 w-5" />,
    viral: <TrendingUp className="h-5 w-5" />,

    landmark: <Landmark className="h-5 w-5" />,
    monument: <Landmark className="h-5 w-5" />,
    attraction: <MapPin className="h-5 w-5" />,
    sight: <MapPin className="h-5 w-5" />,
    visit: <MapPin className="h-5 w-5" />,
    "must-see": <MapPin className="h-5 w-5" />,

    photo: <Camera className="h-5 w-5" />,
    camera: <Camera className="h-5 w-5" />,
    picture: <Camera className="h-5 w-5" />,
    image: <Camera className="h-5 w-5" />,

    transport: <Car className="h-5 w-5" />,
    car: <Car className="h-5 w-5" />,
    drive: <Car className="h-5 w-5" />,
    taxi: <Car className="h-5 w-5" />,
    uber: <Car className="h-5 w-5" />,

    // Additional categories
    flight: <Plane className="h-5 w-5" />,
    air: <Plane className="h-5 w-5" />,
    airport: <Plane className="h-5 w-5" />,

    hotel: <Hotel className="h-5 w-5" />,
    stay: <Hotel className="h-5 w-5" />,
    accommodation: <Hotel className="h-5 w-5" />,
    lodging: <Hotel className="h-5 w-5" />,

    shop: <ShoppingBag className="h-5 w-5" />,
    market: <ShoppingBag className="h-5 w-5" />,
    buy: <ShoppingBag className="h-5 w-5" />,
    souvenir: <ShoppingBag className="h-5 w-5" />,

    cafe: <Coffee className="h-5 w-5" />,
    coffee: <Coffee className="h-5 w-5" />,

    event: <Ticket className="h-5 w-5" />,
    ticket: <Ticket className="h-5 w-5" />,
    show: <Ticket className="h-5 w-5" />,

    sunset: <Sunset className="h-5 w-5" />,
    sunrise: <Sunset className="h-5 w-5" />,
    view: <Sunset className="h-5 w-5" />,

    beach: <Waves className="h-5 w-5" />,
    ocean: <Waves className="h-5 w-5" />,
    sea: <Waves className="h-5 w-5" />,
    water: <Waves className="h-5 w-5" />,

    bike: <Bike className="h-5 w-5" />,
    cycling: <Bike className="h-5 w-5" />,

    camp: <Tent className="h-5 w-5" />,
    tent: <Tent className="h-5 w-5" />,

    wine: <Wine className="h-5 w-5" />,
    drink: <Wine className="h-5 w-5" />,
    bar: <Wine className="h-5 w-5" />,

    music: <Music className="h-5 w-5" />,
    concert: <Music className="h-5 w-5" />,
    festival: <Music className="h-5 w-5" />,
  };

  // Check for exact match first
  if (iconMap[normalizedTitle]) {
    return iconMap[normalizedTitle];
  }

  // Check for partial matches
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (normalizedTitle.includes(keyword)) {
      return icon;
    }
  }

  // Default icon if no match is found
  return <Sparkles className="h-5 w-5" />;
}
