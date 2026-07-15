import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { request } from "../test/request.js";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("../prisma.js", () => ({
  prisma: {
    gigListing: {
      findMany,
    },
  },
}));

describe("GET /gig-listings", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("returns gig listings as JSON", async () => {
    const rows = [
      {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01",
        tourId: "cccccccc-cccc-cccc-cccc-cccccccccc01",
        gigId: null,
        instrumentNeeded: 1,
        payRateUsd: 350.0,
        payType: "per_show",
        description: "Lead/rhythm guitar for Midwest run. Must know our catalog.",
        status: "open",
        createdAt: new Date("2026-03-15T08:30:00.000Z"),
        updatedAt: new Date("2026-03-15T08:30:00.000Z"),
      },
      {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02",
        tourId: null,
        gigId: "dddddddd-dddd-dddd-dddd-dddddddddd03",
        instrumentNeeded: 6,
        payRateUsd: 500.0,
        payType: "flat_fee",
        description: "Sax fill-in for Harbourfront festival set.",
        status: "open",
        createdAt: new Date("2026-05-22T14:15:00.000Z"),
        updatedAt: new Date("2026-05-22T14:15:00.000Z"),
      },
    ];

    findMany.mockResolvedValueOnce(rows);

    const app = createApp();
    const res = await request(app, "GET", "/gig-listings");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01",
        tour_id: "cccccccc-cccc-cccc-cccc-cccccccccc01",
        gig_id: null,
        instrument_needed: 1,
        pay_rate_usd: 350.0,
        pay_type: "per_show",
        description:
          "Lead/rhythm guitar for Midwest run. Must know our catalog.",
        status: "open",
        created_at: "2026-03-15T08:30:00.000Z",
        updated_at: "2026-03-15T08:30:00.000Z",
      },
      {
        id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02",
        tour_id: null,
        gig_id: "dddddddd-dddd-dddd-dddd-dddddddddd03",
        instrument_needed: 6,
        pay_rate_usd: 500.0,
        pay_type: "flat_fee",
        description: "Sax fill-in for Harbourfront festival set.",
        status: "open",
        created_at: "2026-05-22T14:15:00.000Z",
        updated_at: "2026-05-22T14:15:00.000Z",
      },
    ]);
    expect(findMany).toHaveBeenCalledWith({
      where: {},
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
  });

  it("returns 500 when the database query fails", async () => {
    findMany.mockRejectedValueOnce(new Error("connection refused"));

    const app = createApp();
    const res = await request(app, "GET", "/gig-listings");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
