import express, { type Response } from "express";
import instrumentsRouter from "./routes/instruments.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/", (_req, res: Response) => {
    res.send("Hello World");
  });

  app.use("/instruments", instrumentsRouter);

  return app;
}
