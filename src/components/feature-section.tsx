import { Zap, Map, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

export default function FeatureSection() {
  const planYourTripItems = [
    "Tell us your travel preferences and dates",
    "Get a personalized itinerary in seconds with AI help",
    "Easily customize Tripminder trips for your interests and activities",
  ];

  const aiRecommendationsItems = [
    "More outdoor activities",
    "I've updated your itinerary with hiking at Sunset Peak and kayaking at Crystal Bay.",
    "Perfect! Now add restaurant recommendations",
  ];

  const travelWithConfidenceItems = [
    "Replace your planning excels with Tripminder",
    "Use Tripminder as your travel journal and track trip on the go",
    "Share with your friends and family to keep everyone organized",
  ];

  return (
    <section className="py-8">
      <div>
        <h3 className="text-3xl font-bold text-center mb-4">
          Get an itinerary, instantly.
        </h3>
        <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
          Must-visit destinations and dream experiences, all based on your own
          preferences and interests.
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-8 relative">
              <FeatureCard
                icon={Map}
                title="Travel with Confidence"
                items={travelWithConfidenceItems}
                variant="list"
              />
              <FeatureCard
                icon={Sparkles}
                title="Recommendations with AI"
                items={aiRecommendationsItems}
                variant="chat"
              />
              <FeatureCard
                icon={Zap}
                title="Plan Your Trip"
                items={planYourTripItems}
                variant="list"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
