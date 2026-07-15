import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const musicians = await prisma.musicianProfile.findMany({
            orderBy: { id: "asc" },
            select: {
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
            },
        });

        res.status(200).json(
            musicians.map((musician) => ({
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
                    musician.hourlyRateUsd === null
                        ? null
                        : Number(musician.hourlyRateUsd),
                is_available: musician.isAvailable,
                created_at: musician.createdAt,
            })),
        );
    } catch (err) {
        console.error("GET /musicians failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
