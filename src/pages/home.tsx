import { GenerateItinerary } from "../components/generate-itinerary";
import FeatureSection from "../components/feature-section";

export default function HomePage() {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-4 text-center">
        Plan travel with AI
      </h2>
      <p className="text-xl mb-8 text-center">
        Making memories, without the planning headaches.
      </p>

      <GenerateItinerary />
      <FeatureSection />
    </div>
  );
}
