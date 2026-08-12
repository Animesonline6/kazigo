import { BadgeCheck, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RatingStars, LocationBadge } from "@/components/marketplace/atoms";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="flex flex-col gap-3 p-5 hover:border-teal-500/60 hover:shadow-elevated">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            {company.name}
            {company.verified && <BadgeCheck className="h-4 w-4 text-teal-500" aria-label="Verificado" />}
          </span>
          <LocationBadge location={company.location} />
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-ink-soft">{company.description}</p>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <Badge tone="navy">{company.category}</Badge>
        <RatingStars rating={company.rating} reviewsCount={company.reviewsCount} />
      </div>
    </Card>
  );
}
