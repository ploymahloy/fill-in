"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { GigListingCard } from "@/components/search/GigListingCard";
import { MusicianCard } from "@/components/search/MusicianCard";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  searchGigListings,
  searchMusicians,
  type GigListingSearchResult,
  type MusicianSearchResult,
  type SearchType,
} from "@/lib/search";

const SEARCH_DEBOUNCE_MS = 300;

const parseSearchType = (value: string | null): SearchType => {
  return value === "musicians" ? "musicians" : "gigs";
}

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState<SearchType>(() =>
    parseSearchType(searchParams.get("type"))
  );
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [gigResults, setGigResults] = useState<GigListingSearchResult[]>([]);
  const [musicianResults, setMusicianResults] = useState<
    MusicianSearchResult[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("type", searchType);
    const trimmed = debouncedQuery.trim();
    if (trimmed) {
      params.set("q", trimmed);
    }
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(`/search?${next}`, { scroll: false });
    }
  }, [searchType, debouncedQuery, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (searchType === "gigs") {
          const results = await searchGigListings(debouncedQuery);
          if (!cancelled) {
            setGigResults(results);
          }
        } else {
          const results = await searchMusicians(debouncedQuery);
          if (!cancelled) {
            setMusicianResults(results);
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            "Something went wrong while loading results. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [searchType, debouncedQuery]);

  const results =
    searchType === "gigs" ? gigResults.length : musicianResults.length;
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find open gig listings or discover musicians available for fill-in
          work.
        </p>
      </header>

      <section className="space-y-6 rounded-xl border bg-card p-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Search for</legend>
          <RadioGroup
            value={searchType}
            onValueChange={(value) => setSearchType(value as SearchType)}
            className="grid gap-3 sm:grid-cols-2"
          >
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 has-checked:border-primary has-checked:bg-primary/5">
              <RadioGroupItem value="gigs" />
              <span>
                <span className="block font-medium">Gig listings</span>
                <span className="block text-sm text-muted-foreground">
                  Open fill-in opportunities from bands and tours
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 has-checked:border-primary has-checked:bg-primary/5">
              <RadioGroupItem value="musicians" />
              <span>
                <span className="block font-medium">Musicians</span>
                <span className="block text-sm text-muted-foreground">
                  Available players by instrument, city, and bio
                </span>
              </span>
            </label>
          </RadioGroup>
        </fieldset>

        <div className="space-y-2">
          <label htmlFor="search-query" className="text-sm font-medium">
            Keywords
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                searchType === "gigs"
                  ? "Search by instrument, city, band, or description"
                  : "Search by name, instrument, city, or bio"
              }
              className="pl-9"
            />
          </div>
        </div>
      </section>

      <section aria-live="polite" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">
            {searchType === "gigs" ? "Gig listings" : "Musicians"}
          </h2>
          {!isLoading && !error ? (
            <p className="text-sm text-muted-foreground">
              {results} result{results === 1 ? "" : "s"}
              {hasQuery ? ` for “${debouncedQuery.trim()}”` : ""}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : results === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {hasQuery
              ? "No results matched your search. Try a different keyword or switch search type."
              : "No results are available right now."}
          </p>
        ) : searchType === "gigs" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {gigResults.map((listing) => (
              <GigListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {musicianResults.map((musician) => (
              <MusicianCard key={musician.id} musician={musician} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const SearchPageFallback = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Find open gig listings or discover musicians available for fill-in
          work.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export const SearchPage = () => {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
};
