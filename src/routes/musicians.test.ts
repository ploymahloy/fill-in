import type { QueryResult } from "pg";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { pool } from "../db.js";
import { request } from "../test/request.js";

vi.mock("../db.js", () => ({
    pool: {
        query: vi.fn(),
    },
}));

type MusiciansQuery = (
    queryText: string,
) => Promise<QueryResult<{
    id: number;
    user_id: number;
    stage_name: string;
    bio: string;
    base_city: string;
    base_country: string;
    has_passport: boolean;
    website_url: string;
    video_reel_url: string;
    hourly_rate_usd: number;
    is_available: boolean;
    created_at: string;
}>>;

const mockedQuery = vi.mocked(pool.query as MusiciansQuery);

describe("GET /musicians", () => {
    beforeEach(() => {
        mockedQuery.mockReset();
    });

    it("returns musicians as JSON", async () => {
        const rows = [
            {
                "id": 101,
                "user_id": 4032,
                "stage_name": "Luna Eclipse",
                "bio": "Professional aerialist and fire dancer with 8+ years of international circus and corporate event experience. Specializes in solo silks and duo trapeze.",
                "base_city": "Montreal",
                "base_country": "Canada",
                "has_passport": true,
                "website_url": "https://www.lunaeclipseperforming.com",
                "video_reel_url": "https://vimeo.com/lunaeclipse/reel-2026",
                "hourly_rate_usd": 120.00,
                "is_available": true,
                "created_at": "2026-03-15T08:30:00.000Z"
            },
            {
                "id": 102,
                "user_id": 8819,
                "stage_name": "DJ Kestrel",
                "bio": "Open-format turntablist and sound designer creating immersive soundscapes for high-end fashion shows and private festivals across Europe.",
                "base_city": "Berlin",
                "base_country": "Germany",
                "has_passport": true,
                "website_url": "https://www.djkestrel.de",
                "video_reel_url": "https://youtube.com/watch?v=kestrel-live-berlin",
                "hourly_rate_usd": 175.00,
                "is_available": false,
                "created_at": "2026-05-22T14:15:00.000Z"
            }
        ];

        mockedQuery.mockResolvedValueOnce({
            rows,
            command: "SELECT",
            rowCount: rows.length,
            oid: 0,
            fields: [],
        })

        const app = createApp();
        const res = await request(app, "GET", "/musicians");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(rows);
        expect(mockedQuery).toHaveBeenCalledWith(
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
    });

    it("returns 500 when the database query fails", async () => {
        mockedQuery.mockRejectedValueOnce(new Error("connection refused"));

        const app = createApp();
        const res = await request(app, "GET", "/musicians");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Internal server error" });
    });
});