import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query<{ id: number; name: string }>(
      "SELECT id, name FROM instruments ORDER BY id",
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("GET /instruments failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
