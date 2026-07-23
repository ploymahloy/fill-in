"use client";

import { useState, type SubmitEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { SearchType } from "@/lib/search";

const TABS: { value: SearchType; label: string }[] = [
  { value: "gigs", label: "Gigs" },
  { value: "musicians", label: "Musicians" },
];

export const HomeSearchHero = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState<SearchType>("gigs");
  const [query, setQuery] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("type", searchType);
    const trimmed = query.trim();
    if (trimmed) {
      params.set("q", trimmed);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16">
      <Image
        src="/hero-venue.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 text-center">
        <div className="space-y-3">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            Fill-In
          </h1>
          <p className="mx-auto max-w-md text-base text-white/85 sm:text-lg">
            Keep your tour on track with support from locals in the industry.
          </p>
        </div>

        <div className="w-full rounded-2xl bg-white/20 p-5 shadow-lg backdrop-blur-md sm:p-6">
          <div
            role="tablist"
            aria-label="Search type"
            className="mb-5 flex items-center justify-center gap-8"
          >
            {TABS.map((tab) => {
              const isActive = searchType === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  id={`home-search-tab-${tab.value}`}
                  onClick={() => setSearchType(tab.value)}
                  className={cn(
                    "relative pb-2 text-sm font-medium tracking-wide transition-colors sm:text-base",
                    isActive ? "text-white" : "text-white/65 hover:text-white/90"
                  )}
                >
                  {tab.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-1 rounded-full bg-[#000099] transition-opacity",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <label htmlFor="home-search-query" className="sr-only">
              {searchType === "gigs"
                ? "Search gig listings"
                : "Search musicians"}
            </label>
            <div className="relative flex items-center">
              <Input
                id="home-search-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  searchType === "gigs"
                    ? "Search by instrument, city, or band"
                    : "Search by name, instrument, or city"
                }
                className="h-14 rounded-full border-0 bg-white pr-14 pl-5 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#000099]/40 md:text-base"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-[#000099] transition-colors hover:bg-[#000099]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000099]/40"
              >
                <Search className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
