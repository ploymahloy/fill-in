import express, { type Response } from "express";
import gigListingsRouter from "./routes/gig-listings.js";
import instrumentsRouter from "./routes/instruments.js";
import musiciansRouter from "./routes/musicians.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res: Response) => {
    res.send("Hello World");
  });

  app.use("/instruments", instrumentsRouter);
  app.use("/musicians", musiciansRouter);
  app.use("/gig-listings", gigListingsRouter);

  return app;
}
