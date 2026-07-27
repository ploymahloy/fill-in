import {
  formatDate,
  type GigListingSearchResult
} from "@/lib/search";

export const statusVariant = (
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

export const getGigListingMeta = (listing: GigListingSearchResult) => {
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

  return { listingKind, location, dateLabel };
};
