import { Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
}

export function ReviewsList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-faint">Ainda sem avaliações.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <Card key={r.id} className="flex gap-3 p-4">
          <Avatar name={r.author_name} src={r.author_avatar ?? undefined} size="sm" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">{r.author_name}</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn("h-3.5 w-3.5", n <= r.rating ? "fill-orange-500 text-orange-500" : "text-border")}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs text-ink-faint">{formatDate(r.created_at)}</span>
            </div>
            {r.comment && <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>}
          </div>
        </Card>
      ))}
    </div>
  );
}
