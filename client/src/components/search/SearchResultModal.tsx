"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { GigListingSearchResult, MusicianSearchResult } from "@/lib/search";

import { GigListingProfile } from "./GigListingProfile";
import { MusicianProfile } from "./MusicianProfile";

export type SelectedSearchResult =
  | {
    kind: "musician";
    data: MusicianSearchResult;
  }
  | {
    kind: "gig";
    data: GigListingSearchResult;
  };

type SearchResultModalProps = {
  selected: SelectedSearchResult;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

export const SearchResultModal = ({
  selected,
  onClose
}: SearchResultModalProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeout = window.setTimeout(() => {
      const closeButton =
        panelRef.current?.querySelector<HTMLButtonElement>(
          'button[aria-label="Close"]'
        );
      closeButton?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true"
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose]);

  const title =
    selected.kind === "musician"
      ? selected.data.stage_name?.trim() || "Musician profile"
      : `${selected.data.instrument.name} listing`;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 z-0"
        aria-hidden="true"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      />
      <div className="relative z-10 pointer-events-none mx-auto flex min-h-full w-full items-center justify-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
            <h2 id={titleId} className="truncate text-sm font-medium">
              {title}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close"
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
          <div className="min-h-0 max-h-[90vh] overflow-auto p-4 sm:p-6">
            {selected.kind === "musician" ? (
              <MusicianProfile musician={selected.data} />
            ) : (
              <GigListingProfile listing={selected.data} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
