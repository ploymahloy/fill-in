import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatCurrency, type MusicianSearchResult } from "@/lib/search";

export function MusicianCard({ musician }: { musician: MusicianSearchResult }) {
  const displayName = musician.stage_name?.trim() || "Unnamed musician";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>
              {musician.base_city}, {musician.base_country}
            </CardDescription>
          </div>
          <Badge variant={musician.is_available ? "default" : "secondary"}>
            {musician.is_available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {musician.bio ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {musician.bio}
          </p>
        ) : null}
        {musician.instruments.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {musician.instruments.map((instrument) => (
              <Badge
                key={instrument.id}
                variant={instrument.is_primary ? "default" : "outline"}
              >
                {instrument.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {musician.hourly_rate_usd !== null ? (
            <div>
              <dt className="text-muted-foreground">Hourly rate</dt>
              <dd>{formatCurrency(musician.hourly_rate_usd)}/hr</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground">Passport</dt>
            <dd>{musician.has_passport ? "Yes" : "No"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
