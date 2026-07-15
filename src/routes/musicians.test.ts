import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { request } from "../test/request.js";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("../prisma.js", () => ({
  prisma: {
    musicianProfile: {
      findMany,
    },
  },
}));

describe("GET /musicians", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("returns musicians as JSON", async () => {
    const rows = [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        userId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        stageName: "Luna Eclipse",
        bio: "Professional aerialist and fire dancer with 8+ years of international circus and corporate event experience. Specializes in solo silks and duo trapeze.",
        baseCity: "Montreal",
        baseCountry: "Canada",
        hasPassport: true,
        websiteUrl: "https://www.lunaeclipseperforming.com",
        videoReelUrl: "https://vimeo.com/lunaeclipse/reel-2026",
        hourlyRateUsd: 120.0,
        isAvailable: true,
        createdAt: new Date("2026-03-15T08:30:00.000Z"),
      },
      {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        userId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        stageName: "DJ Kestrel",
        bio: "Open-format turntablist and sound designer creating immersive soundscapes for high-end fashion shows and private festivals across Europe.",
        baseCity: "Berlin",
        baseCountry: "Germany",
        hasPassport: true,
        websiteUrl: "https://www.djkestrel.de",
        videoReelUrl: "https://youtube.com/watch?v=kestrel-live-berlin",
        hourlyRateUsd: 175.0,
        isAvailable: false,
        createdAt: new Date("2026-05-22T14:15:00.000Z"),
      },
    ];

    findMany.mockResolvedValueOnce(rows);

    const app = createApp();
    const res = await request(app, "GET", "/musicians");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        user_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        stage_name: "Luna Eclipse",
        bio: "Professional aerialist and fire dancer with 8+ years of international circus and corporate event experience. Specializes in solo silks and duo trapeze.",
        base_city: "Montreal",
        base_country: "Canada",
        has_passport: true,
        website_url: "https://www.lunaeclipseperforming.com",
        video_reel_url: "https://vimeo.com/lunaeclipse/reel-2026",
        hourly_rate_usd: 120.0,
        is_available: true,
        created_at: "2026-03-15T08:30:00.000Z",
      },
      {
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        user_id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        stage_name: "DJ Kestrel",
        bio: "Open-format turntablist and sound designer creating immersive soundscapes for high-end fashion shows and private festivals across Europe.",
        base_city: "Berlin",
        base_country: "Germany",
        has_passport: true,
        website_url: "https://www.djkestrel.de",
        video_reel_url: "https://youtube.com/watch?v=kestrel-live-berlin",
        hourly_rate_usd: 175.0,
        is_available: false,
        created_at: "2026-05-22T14:15:00.000Z",
      },
    ]);
    expect(findMany).toHaveBeenCalledWith({
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
  });

  it("returns 500 when the database query fails", async () => {
    findMany.mockRejectedValueOnce(new Error("connection refused"));

    const app = createApp();
    const res = await request(app, "GET", "/musicians");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
