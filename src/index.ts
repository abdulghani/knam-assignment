import { Hono } from "hono";
import { migrate } from "./db";
import { initializeQueue } from "./queue";
import { serve } from "@hono/node-server";
import { logger } from "./logger";
import open from "open";
import { reportRoute } from "./routes/report";
import { registerDocs } from "./routes/docs";
import { PORT } from "./constants/port";
import moment from "moment";

moment.suppressDeprecationWarnings = true;
const app = new Hono();

registerDocs(app);
app.route("/", reportRoute);

// entry point
(async () => {
  await migrate();
  await initializeQueue();

  serve({
    fetch: app.fetch.bind(app),
    port: Number(PORT),
  });

  if (process.env.NODE_ENV === "development") {
    logger.info(`Server running on port ${PORT}`);
    open(`http://localhost:${PORT}`);
  }
})();
