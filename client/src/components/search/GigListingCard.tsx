"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import {
  formatCurrency,
  formatPayType,
  type GigListingSearchResult
} from "@/lib/search";
import { cn } from "@/lib/utils";

import { getGigListingMeta, statusVariant } from "./gigListingMeta";

type GigListingCardProps = {
  listing: GigListingSearchResult;
  isActive?: boolean;
  onSelect?: (listing: GigListingSearchResult) => void;
};

export const GigListingCard = ({
  listing,
  isActive = false,
  onSelect
}: GigListingCardProps) => {
  const { location, dateLabel } = getGigListingMeta(listing);
  const bandName = listing.band?.band_name ?? "Unknown band";

  const handleSelect = () => {
    onSelect?.(listing);
  };

  return (
    <Card
      role="button"
      tabIndex={isActive ? -1 : 0}
      aria-label={`View listing for ${listing.instrument.name} with ${bandName}`}
      aria-hidden={isActive}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
      className={cn(
        "cursor-pointer transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive && "hidden"
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>{listing.instrument.name}</CardTitle>
            <CardDescription>{bandName}</CardDescription>
          </div>
          <Badge variant={statusVariant(listing.status)}>
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {listing.description}
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{location}</dd>
          </div>
          {dateLabel ? (
            <div>
              <dt className="text-muted-foreground">Date</dt>
              <dd>{dateLabel}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground">Pay</dt>
            <dd>
              {formatCurrency(listing.pay_rate_usd)} ·{" "}
              {formatPayType(listing.pay_type)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
