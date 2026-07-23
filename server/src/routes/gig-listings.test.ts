import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { request } from "../test/request.js";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn()
}));

vi.mock("../prisma.js", () => ({
  prisma: {
    gigListing: {
      findMany
    }
  }
}));

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
};

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
        description:
          "Lead/rhythm guitar for Midwest run. Must know our catalog.",
        status: "open",
        createdAt: new Date("2026-03-15T08:30:00.000Z"),
        updatedAt: new Date("2026-03-15T08:30:00.000Z"),
        instrument: { id: 1, name: "Guitar" },
        tour: {
          id: "cccccccc-cccc-cccc-cccc-cccccccccc01",
          title: "Midwest Summer Tour",
          startDate: new Date("2026-06-01"),
          endDate: new Date("2026-06-30"),
          band: {
            id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            bandName: "The Velvet Pines"
          }
        },
        gig: null
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
        instrument: { id: 6, name: "Saxophone" },
        tour: null,
        gig: {
          id: "dddddddd-dddd-dddd-dddd-dddddddddd03",
          venueName: "Harbourfront Centre",
          city: "Toronto",
          country: "Canada",
          gigDate: new Date("2026-07-12"),
          band: {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            bandName: "Harbour Lights"
          }
        }
      }
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
        instrument: { id: 1, name: "Guitar" },
        band: {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          band_name: "The Velvet Pines"
        },
        tour: {
          id: "cccccccc-cccc-cccc-cccc-cccccccccc01",
          title: "Midwest Summer Tour",
          start_date: "2026-06-01T00:00:00.000Z",
          end_date: "2026-06-30T00:00:00.000Z"
        },
        gig: null
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
        instrument: { id: 6, name: "Saxophone" },
        band: {
          id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          band_name: "Harbour Lights"
        },
        tour: null,
        gig: {
          id: "dddddddd-dddd-dddd-dddd-dddddddddd03",
          venue_name: "Harbourfront Centre",
          city: "Toronto",
          country: "Canada",
          gig_date: "2026-07-12T00:00:00.000Z"
        }
      }
    ]);
    expect(findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { id: "asc" },
      select: listingSelect
    });
  });

  it("filters gig listings by search query", async () => {
    findMany.mockResolvedValueOnce([]);

    const app = createApp();
    const res = await request(app, "GET", "/gig-listings?q=toronto");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { description: { contains: "toronto", mode: "insensitive" } },
          {
            instrument: { name: { contains: "toronto", mode: "insensitive" } }
          },
          { tour: { title: { contains: "toronto", mode: "insensitive" } } },
          {
            tour: {
              description: { contains: "toronto", mode: "insensitive" }
            }
          },
          {
            tour: {
              band: { bandName: { contains: "toronto", mode: "insensitive" } }
            }
          },
          { gig: { venueName: { contains: "toronto", mode: "insensitive" } } },
          { gig: { city: { contains: "toronto", mode: "insensitive" } } },
          { gig: { country: { contains: "toronto", mode: "insensitive" } } },
          {
            gig: {
              band: { bandName: { contains: "toronto", mode: "insensitive" } }
            }
          }
        ]
      },
      orderBy: { id: "asc" },
      select: listingSelect
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
