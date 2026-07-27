import { Badge } from "@/components/ui/Badge";
import {
  formatCurrency,
  formatPayType,
  type GigListingSearchResult
} from "@/lib/search";

import { getGigListingMeta, statusVariant } from "./gigListingMeta";

export const GigListingProfile = ({
  listing
}: {
  listing: GigListingSearchResult;
}) => {
  const { listingKind, location, dateLabel } = getGigListingMeta(listing);
  const bandName = listing.band?.band_name ?? "Unknown band";

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-semibold leading-snug">
              {listing.instrument.name}
            </h2>
            <p className="text-sm text-muted-foreground">{bandName}</p>
          </div>
          <Badge variant={statusVariant(listing.status)}>
            {listing.status}
          </Badge>
        </div>
      </header>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {listing.description}
        </p>
      </section>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">
            {listingKind === "tour" ? "Tour" : "Location"}
          </dt>
          <dd className="font-medium">{location}</dd>
        </div>
        {dateLabel ? (
          <div>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium">{dateLabel}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-muted-foreground">Pay</dt>
          <dd className="font-medium">
            {formatCurrency(listing.pay_rate_usd)} ·{" "}
            {formatPayType(listing.pay_type)}
          </dd>
        </div>
        {listingKind === "gig" && listing.gig ? (
          <div>
            <dt className="text-muted-foreground">Venue</dt>
            <dd className="font-medium">{listing.gig.venue_name}</dd>
          </div>
        ) : null}
        {listingKind === "tour" && listing.tour ? (
          <div>
            <dt className="text-muted-foreground">Tour title</dt>
            <dd className="font-medium">{listing.tour.title}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
};
