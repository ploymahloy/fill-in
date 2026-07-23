import "dotenv/config";
import { createApp } from "./app.js";
import { prisma } from "./prisma.js";

const app = createApp();

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Prevents the server from hanging around after the process is terminated
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown();
});
process.on("SIGTERM", () => {
  void shutdown();
});
