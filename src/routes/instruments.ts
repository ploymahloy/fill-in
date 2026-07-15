import { Router, type Request, type Response } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const instruments = await prisma.instrument.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json(instruments);
  } catch (err) {
    console.error("GET /instruments failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
