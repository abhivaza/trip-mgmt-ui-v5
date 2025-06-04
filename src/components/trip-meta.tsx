import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface TripMetaProps {
  tags?: string[];
  popularityRank?: number;
}

export const TripMeta = ({ tags = [], popularityRank }: TripMetaProps) => {
  return (
    <div className="text-center">
      {popularityRank === 1 && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            #1 Most Popular Destination
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags?.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
