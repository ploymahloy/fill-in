import { Router, type Request, type Response } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";

const router = Router();

const musicianSelect = {
  id: true,
  userId: true,
  stageName: true,
  bio: true,
  baseCity: true,
  baseCountry: true,
  hasPassport: true,
  websiteUrl: true,
  videoReelUrl: true,
  hourlyRateUsd: true,
  isAvailable: true,
  createdAt: true,
  instruments: {
    select: {
      isPrimary: true,
      proficiencyLevel: true,
      instrument: {
        select: { id: true, name: true }
      }
    },
    orderBy: [
      { isPrimary: "desc" as const },
      { instrument: { name: "asc" as const } }
    ]
  }
} satisfies Prisma.MusicianProfileSelect;

function parseSearchQuery(req: Request): string {
  return typeof req.query.q === "string" ? req.query.q.trim() : "";
}

function buildMusicianWhere(q: string): Prisma.MusicianProfileWhereInput {
  if (!q) {
    return {};
  }

  return {
    OR: [
      { stageName: { contains: q, mode: "insensitive" } },
      { bio: { contains: q, mode: "insensitive" } },
      { baseCity: { contains: q, mode: "insensitive" } },
      { baseCountry: { contains: q, mode: "insensitive" } },
      {
        instruments: {
          some: {
            instrument: { name: { contains: q, mode: "insensitive" } }
          }
        }
      }
    ]
  };
}

function mapMusician(
  musician: Prisma.MusicianProfileGetPayload<{ select: typeof musicianSelect }>
) {
  return {
    id: musician.id,
    user_id: musician.userId,
    stage_name: musician.stageName,
    bio: musician.bio,
    base_city: musician.baseCity,
    base_country: musician.baseCountry,
    has_passport: musician.hasPassport,
    website_url: musician.websiteUrl,
    video_reel_url: musician.videoReelUrl,
    hourly_rate_usd:
      musician.hourlyRateUsd === null ? null : Number(musician.hourlyRateUsd),
    is_available: musician.isAvailable,
    created_at: musician.createdAt,
    instruments: musician.instruments.map((entry) => ({
      id: entry.instrument.id,
      name: entry.instrument.name,
      proficiency_level: entry.proficiencyLevel,
      is_primary: entry.isPrimary
    }))
  };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const q = parseSearchQuery(req);

    const musicians = await prisma.musicianProfile.findMany({
      where: buildMusicianWhere(q),
      orderBy: { id: "asc" },
      select: musicianSelect
    });

    res.status(200).json(musicians.map(mapMusician));
  } catch (err) {
    console.error("GET /musicians failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const musician = await prisma.musicianProfile.findUnique({
      where: { id: `${req.params.id}` },
      select: musicianSelect
    });

    if (!musician) {
      return res.status(404).json({ error: "Musician not found" });
    }

    res.status(200).json(mapMusician(musician));
  } catch (err) {
    console.error(`GET /musicians/${req.params.id} failed:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
