import { Context } from "hono";

export async function JSONMiddleware(c: Context, next: () => Promise<void>) {
  const contentType = c.req.header("Content-Type");

  if (contentType === "application/json") {
    try {
      await c.req.json();
    } catch (e) {
      return c.json({ error: "Invalid request JSON body" }, 400);
    }
  }

  return next();
}
