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
  formatDate,
  formatPayType,
  type GigListingSearchResult
} from "@/lib/search";

const statusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "open":
      return "default";
    case "filled":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export const GigListingCard = ({
  listing
}: {
  listing: GigListingSearchResult;
}) => {
  const listingKind = listing.gig ? "gig" : listing.tour ? "tour" : "none";

  let location: string;
  switch (listingKind) {
    case "gig":
      location = `${listing.gig!.venue_name} · ${listing.gig!.city}, ${listing.gig!.country}`;
      break;
    case "tour":
      location = listing.tour!.title;
      break;
    default:
      location = "Location TBD";
  }

  let dateLabel: string | null;
  switch (listingKind) {
    case "gig":
      dateLabel = formatDate(listing.gig!.gig_date);
      break;
    case "tour":
      dateLabel = `${formatDate(listing.tour!.start_date)} - ${formatDate(listing.tour!.end_date)}`;
      break;
    default:
      dateLabel = null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>{listing.instrument.name}</CardTitle>
            <CardDescription>
              {listing.band?.band_name ?? "Unknown band"}
            </CardDescription>
          </div>
          <Badge variant={statusVariant(listing.status)}>
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{listing.description}</p>
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
