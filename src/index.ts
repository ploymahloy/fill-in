import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
