import { Hono } from "hono";
import { migrate } from "./db";
import { initializeQueue } from "./queue";
import { serve } from "@hono/node-server";
import { logger } from "./logger";
import open from "open";
import { reportRoute } from "./routes/report";
import { registerDocs } from "./routes/docs";

const app = new Hono();

registerDocs(app);
app.route("/", reportRoute);

// entry point
(async () => {
  await migrate();
  await initializeQueue();

  const PORT = process.env.PORT || 3000;
  logger.info(`Server running on port ${PORT}`);
  serve({
    fetch: app.fetch.bind(app),
    port: Number(PORT),
  });
  open("http://localhost:3000");
})();
