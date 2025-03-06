import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";

export function registerDocs(app: Hono) {
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Knam Assignment",
          version: "0.0.0",
          description: "API for generating reports",
        },
        servers: [
          {
            url: `http://localhost:${process.env.PORT}`,
            description: "Local server",
          },
        ],
      },
    })
  );

  app.get(
    "/",
    apiReference({
      theme: "default",
      spec: {
        url: "/openapi",
      },
    })
  );
}
