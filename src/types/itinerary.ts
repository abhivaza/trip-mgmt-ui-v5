export interface Itinerary {
  id?: string;
  message?: string;
  city?: string;
  country?: string;
  popularityRank?: number;
  tags?: string[];
  itinerary?: ItineraryDayActivity[];
  createdBy?: string;
  fromDate?: string;
  tripDuration?: number;
  imageURL?: string;
  sharedWith?: string[];
}

export interface ItineraryDayActivity {
  dayNumber: number;
  place: string;
  title: string;
  shortDescription: string;
  description: string;
  thingsToDo?: ThingsToDo[];
}

export interface ThingsToDo {
  id: string;
  title: string;
  activities: Activity[];
}

export interface Activity {
  title: string;
  description: string;
}
