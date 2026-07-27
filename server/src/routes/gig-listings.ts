import { Router, type Request, type Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";

const router = Router();
const DEV_MUSICIAN_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01";

const listingSelect = {
  id: true,
  tourId: true,
  gigId: true,
  instrumentNeeded: true,
  payRateUsd: true,
  payType: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  instrument: {
    select: { id: true, name: true }
  },
  tour: {
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      band: {
        select: { id: true, bandName: true }
      }
    }
  },
  gig: {
    select: {
      id: true,
      venueName: true,
      city: true,
      country: true,
      gigDate: true,
      band: {
        select: { id: true, bandName: true }
      }
    }
  }
} satisfies Prisma.GigListingSelect;

function parseSearchQuery(req: Request): string {
  return typeof req.query.q === "string" ? req.query.q.trim() : "";
}

function parseApplicationBody(req: Request): {
  listingId: string | null;
  pitchMessage: string | null;
} {
  const body =
    req.body && typeof req.body === "object" ? req.body : ({} as Record<string, unknown>);
  const listingId =
    typeof body.listing_id === "string" && body.listing_id.trim()
      ? body.listing_id.trim()
      : null;
  const pitchMessage =
    typeof body.pitch_message === "string" && body.pitch_message.trim()
      ? body.pitch_message.trim()
      : null;

  return { listingId, pitchMessage };
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function buildListingWhere(q: string): Prisma.GigListingWhereInput {
  if (!q) {
    return {};
  }

  return {
    OR: [
      { description: { contains: q, mode: "insensitive" } },
      { instrument: { name: { contains: q, mode: "insensitive" } } },
      { tour: { title: { contains: q, mode: "insensitive" } } },
      { tour: { description: { contains: q, mode: "insensitive" } } },
      {
        tour: {
          band: { bandName: { contains: q, mode: "insensitive" } }
        }
      },
      { gig: { venueName: { contains: q, mode: "insensitive" } } },
      { gig: { city: { contains: q, mode: "insensitive" } } },
      { gig: { country: { contains: q, mode: "insensitive" } } },
      {
        gig: {
          band: { bandName: { contains: q, mode: "insensitive" } }
        }
      }
    ]
  };
}

function mapListing(
  listing: Prisma.GigListingGetPayload<{ select: typeof listingSelect }>
) {
  const band = listing.tour?.band ?? listing.gig?.band ?? null;

  return {
    id: listing.id,
    tour_id: listing.tourId,
    gig_id: listing.gigId,
    instrument_needed: listing.instrumentNeeded,
    pay_rate_usd: Number(listing.payRateUsd),
    pay_type: listing.payType,
    description: listing.description,
    status: listing.status,
    created_at: listing.createdAt,
    updated_at: listing.updatedAt,
    instrument: {
      id: listing.instrument.id,
      name: listing.instrument.name
    },
    band: band
      ? {
          id: band.id,
          band_name: band.bandName
        }
      : null,
    tour: listing.tour
      ? {
          id: listing.tour.id,
          title: listing.tour.title,
          start_date: listing.tour.startDate,
          end_date: listing.tour.endDate
        }
      : null,
    gig: listing.gig
      ? {
          id: listing.gig.id,
          venue_name: listing.gig.venueName,
          city: listing.gig.city,
          country: listing.gig.country,
          gig_date: listing.gig.gigDate
        }
      : null
  };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const q = parseSearchQuery(req);

    const listings = await prisma.gigListing.findMany({
      where: buildListingWhere(q),
      orderBy: { id: "asc" },
      select: listingSelect
    });

    res.status(200).json(listings.map(mapListing));
  } catch (err) {
    console.error("GET /gig-listings failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/applications", async (req: Request, res: Response) => {
  try {
    const { listingId, pitchMessage } = parseApplicationBody(req);

    if (!listingId) {
      return res.status(400).json({ error: "listing_id is required" });
    }

    const listing = await prisma.gigListing.findUnique({
      where: { id: listingId },
      select: { id: true }
    });

    if (!listing) {
      return res.status(404).json({ error: "Gig listing not found" });
    }

    const application = await prisma.application.create({
      data: {
        listingId,
        musicianId: DEV_MUSICIAN_ID,
        pitchMessage,
        status: "pending"
      },
      select: {
        id: true,
        listingId: true,
        musicianId: true,
        status: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      id: application.id,
      listing_id: application.listingId,
      musician_id: application.musicianId,
      status: application.status,
      created_at: application.createdAt
    });
  } catch (err) {
    if (isPrismaUniqueConstraintError(err)) {
      return res.status(409).json({
        error: "You have already applied to this listing."
      });
    }

    console.error("POST /gig-listings/applications failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
