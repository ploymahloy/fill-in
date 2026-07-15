import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const { rows } = await pool.query<{ id: number; name: string }>(
            `SELECT 
                id, 
                user_id, 
                stage_name, 
                bio, 
                base_city, 
                base_country, 
                has_passport, 
                website_url, 
                video_reel_url, 
                hourly_rate_usd, 
                is_available, 
                created_at 
            FROM 
                musician_profiles 
            ORDER BY 
                id;`
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error("GET /instruments failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
