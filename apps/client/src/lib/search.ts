export type SearchType = "gigs" | "musicians";

export type MusicianInstrument = {
  id: number;
  name: string;
  proficiency_level: string;
  is_primary: boolean;
};

export type MusicianSearchResult = {
  id: string;
  user_id: string;
  stage_name: string | null;
  bio: string | null;
  base_city: string;
  base_country: string;
  has_passport: boolean;
  website_url: string | null;
  video_reel_url: string | null;
  hourly_rate_usd: number | null;
  is_available: boolean;
  created_at: string;
  instruments: MusicianInstrument[];
};

export type GigListingSearchResult = {
  id: string;
  tour_id: string | null;
  gig_id: string | null;
  instrument_needed: number;
  pay_rate_usd: number;
  pay_type: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  instrument: {
    id: number;
    name: string;
  };
  band: {
    id: string;
    band_name: string;
  } | null;
  tour: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
  } | null;
  gig: {
    id: string;
    venue_name: string;
    city: string;
    country: string;
    gig_date: string;
  } | null;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function searchMusicians(
  query: string
): Promise<MusicianSearchResult[]> {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  return fetchJson<MusicianSearchResult[]>(`/api/musicians${suffix}`);
}

export function searchGigListings(
  query: string
): Promise<GigListingSearchResult[]> {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  return fetchJson<GigListingSearchResult[]>(`/api/gig-listings${suffix}`);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatPayType(payType: string): string {
  return payType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
