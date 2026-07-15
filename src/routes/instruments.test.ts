import type { QueryResult } from "pg";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { request } from "../test/request.js";

vi.mock("../db.js", () => ({
  pool: {
    query: vi.fn(),
  },
}));

import { pool } from "../db.js";

type InstrumentsQuery = (
  queryText: string,
) => Promise<QueryResult<{ id: number; name: string }>>;

const mockedQuery = vi.mocked(pool.query as InstrumentsQuery);

describe("GET /instruments", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("returns instruments as JSON", async () => {
    const rows = [
      { id: 1, name: "Guitar" },
      { id: 2, name: "Bass" },
    ];
    mockedQuery.mockResolvedValueOnce({
      rows,
      command: "SELECT",
      rowCount: rows.length,
      oid: 0,
      fields: [],
    });

    const app = createApp();
    const res = await request(app, "GET", "/instruments");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
    expect(mockedQuery).toHaveBeenCalledWith(
      "SELECT id, name FROM instruments ORDER BY id",
    );
  });

  it("returns 500 when the database query fails", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("connection refused"));

    const app = createApp();
    const res = await request(app, "GET", "/instruments");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
