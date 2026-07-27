import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  formatCurrency,
  formatPayType,
  isApiError,
  submitGigApplication,
  type GigListingSearchResult
} from "@/lib/search";

import { getGigListingMeta, statusVariant } from "./gigListingMeta";

export const GigListingProfile = ({
  listing,
  onApplicationSuccess
}: {
  listing: GigListingSearchResult;
  onApplicationSuccess?: () => void;
}) => {
  const { listingKind, location, dateLabel } = getGigListingMeta(listing);
  const bandName = listing.band?.band_name ?? "Unknown band";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [submissionState, setSubmissionState] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleApply = async () => {
    if (isSubmitting || hasApplied) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(null);

    try {
      await submitGigApplication(listing.id);
      setHasApplied(true);
      setSubmissionState({
        tone: "success",
        message: "Application submitted successfully."
      });
      closeTimeoutRef.current = window.setTimeout(() => {
        onApplicationSuccess?.();
      }, 900);
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        setHasApplied(true);
        return;
      }

      const message = isApiError(error)
        ? error.message
        : "We couldn't submit your application. Please try again.";

      setSubmissionState({
        tone: "error",
        message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <section className="space-y-3 border-t pt-4">
        <div className="space-y-2">
          <Button
            type="button"
            className="w-full"
            onClick={handleApply}
            disabled={isSubmitting || hasApplied}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting...
              </>
            ) : hasApplied ? (
              "Application submitted"
            ) : (
              "Submit application"
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Applications are submitted with the current demo musician profile.
          </p>
        </div>
        <div aria-live="polite">
          {submissionState ? (
            <p
              className={
                submissionState.tone === "success"
                  ? "rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
                  : "rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              }
            >
              {submissionState.message}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
};
