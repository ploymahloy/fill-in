"use client";

import { useId, useState, type SubmitEvent } from "react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  formatCurrency,
  type MusicianSearchResult
} from "@/lib/search";
import { cn } from "@/lib/utils";

const TEXTAREA_CLASS =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-none";

export const MusicianProfile = ({
  musician
}: {
  musician: MusicianSearchResult;
}) => {
  const displayName = musician.stage_name?.trim() || "Unnamed musician";
  const fieldId = useId();
  const subjectId = `${fieldId}-subject`;
  const bodyId = `${fieldId}-body`;

  const [isComposing, setIsComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submissionState, setSubmissionState] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const handleSend = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setSubmissionState({
        tone: "error",
        message: "Message body is required."
      });
      return;
    }

    setIsSending(true);
    setSubmissionState(null);

    // TODO: Replace with actual API call
    await new Promise((resolve) => {
      window.setTimeout(resolve, 400);
    });

    setSubject("");
    setBody("");
    setSubmissionState({
      tone: "success",
      message: "Message sent."
    });
    setIsSending(false);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-semibold leading-snug">
              {displayName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {musician.base_city}, {musician.base_country}
            </p>
          </div>
          <Badge variant={musician.is_available ? "default" : "secondary"}>
            {musician.is_available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </header>

      {musician.bio ? (
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Bio</h3>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {musician.bio}
          </p>
        </section>
      ) : null}

      {musician.instruments.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Instruments</h3>
          <div className="flex flex-wrap gap-2">
            {musician.instruments.map((instrument) => (
              <Badge
                key={instrument.id}
                variant={instrument.is_primary ? "default" : "outline"}
              >
                {instrument.name}
                {instrument.proficiency_level
                  ? ` · ${instrument.proficiency_level}`
                  : ""}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {musician.hourly_rate_usd !== null ? (
          <div>
            <dt className="text-muted-foreground">Hourly rate</dt>
            <dd className="font-medium">
              {formatCurrency(musician.hourly_rate_usd)}/hr
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-muted-foreground">Passport</dt>
          <dd className="font-medium">
            {musician.has_passport ? "Yes" : "No"}
          </dd>
        </div>
      </dl>

      {musician.website_url || musician.video_reel_url ? (
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Links</h3>
          <ul className="space-y-1 text-sm">
            {musician.website_url ? (
              <li>
                <a
                  href={musician.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Website
                </a>
              </li>
            ) : null}
            {musician.video_reel_url ? (
              <li>
                <a
                  href={musician.video_reel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Video reel
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3 border-t pt-4">
        {!isComposing ? (
          <div className="space-y-2">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setIsComposing(true);
                setSubmissionState(null);
              }}
            >
              Message
            </Button>
            <p className="text-sm text-muted-foreground">
              Messages are demo-only and are not delivered.
            </p>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSend}>
            <div className="space-y-1.5">
              <label htmlFor={subjectId} className="text-sm font-medium">
                Subject
              </label>
              <Input
                id={subjectId}
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                disabled={isSending}
                placeholder="Optional"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={bodyId} className="text-sm font-medium">
                Body
              </label>
              <textarea
                id={bodyId}
                rows={3}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={isSending}
                required
                aria-invalid={
                  submissionState?.tone === "error" && !body.trim()
                    ? true
                    : undefined
                }
                className={cn(TEXTAREA_CLASS)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending
                ? <><Loader2 className="animate-spin" />
                  Sending...</>
                : "Send"
              }
            </Button>
            <p className="text-sm text-muted-foreground">
              Messages are demo-only and are not delivered.
            </p>
          </form>
        )}
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
