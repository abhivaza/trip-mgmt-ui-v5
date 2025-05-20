import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  variant?: "list" | "chat" | "checks";
}

export function FeatureCard({
  icon: Icon,
  title,
  items,
  variant = "list",
}: FeatureCardProps) {
  const IconComponent = Icon;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-primary-foreground rounded-full p-4 mb-6 shadow-lg shadow-primary/20">
        <IconComponent className="h-8 w-8" />
      </div>
      <h4 className="text-xl font-semibold mb-3 text-center">{title}</h4>
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full flex-1 flex flex-col min-h-[200px]">
        {variant === "list" && (
          <ul className="space-y-3 flex-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {variant === "chat" && (
          <div className="space-y-3 flex-1">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">{items[0]}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 max-w-[80%] ml-auto">
              <p className="text-sm">{items[1]}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">{items[2]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
