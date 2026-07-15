import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_: Request, res: Response) => {
  try {
    // TODO: Add query filters
    const where = {}; // extend from req.query later

    const listings = await prisma.gigListing.findMany({
      where,
      orderBy: { id: "asc" },
      select: {
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
      },
    });

    res.status(200).json(
      listings.map((listing) => ({
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
      })),
    );
  } catch (err) {
    console.error("GET /gig-listings failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
