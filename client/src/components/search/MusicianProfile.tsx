import { Badge } from "@/components/ui/Badge";
import {
  formatCurrency,
  type MusicianSearchResult
} from "@/lib/search";

export const MusicianProfile = ({
  musician
}: {
  musician: MusicianSearchResult;
}) => {
  const displayName = musician.stage_name?.trim() || "Unnamed musician";

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
    </div>
  );
};
