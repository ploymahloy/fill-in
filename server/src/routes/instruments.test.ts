import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { request } from "../test/request.js";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("../prisma.js", () => ({
  prisma: {
    instrument: {
      findMany,
    },
  },
}));

describe("GET /instruments", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("returns instruments as JSON", async () => {
    const rows = [
      { id: 1, name: "Guitar" },
      { id: 2, name: "Bass" },
    ];
    findMany.mockResolvedValueOnce(rows);

    const app = createApp();
    const res = await request(app, "GET", "/instruments");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
    expect(findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
  });

  it("returns 500 when the database query fails", async () => {
    findMany.mockRejectedValueOnce(new Error("connection refused"));

    const app = createApp();
    const res = await request(app, "GET", "/instruments");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
