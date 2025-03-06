import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ulid } from "ulid";
import { db } from "../db";
import { PROCESS_REPORT_EVENT } from "../tasks/process-report";
import { queue } from "../queue";
import moment from "moment";

export const reportRoute = new Hono().basePath("/report");
const REPORT_FIELD_SELECTION = [
  "id",
  "status",
  "scheduled_at",
  "processed_at",
  "created_at",
  "updated_at",
];

reportRoute.get(
  "/",
  describeRoute({
    description: "Get all reports",
    parameters: [
      {
        name: "status",
        in: "query",
        description: "Filter reports by status",
        schema: {
          type: "string",
          enum: [
            "pending",
            "scheduled",
            "processing",
            "completed",
            "cancelled",
          ],
        },
      },
      {
        name: "limit",
        in: "query",
        description: "Limit number of reports",
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
        },
      },
      {
        name: "page",
        in: "query",
        description: "Page number",
        schema: {
          type: "integer",
          minimum: 1,
        },
      },
    ],
  }),
  async (c) => {
    const { status, limit, page } = c.req.query();
    const query = db("reports")
      .select(REPORT_FIELD_SELECTION)
      .orderBy("created_at", "desc");

    if (status) {
      query.where({ status });
    }

    if (Number(limit) > 0) {
      query.limit(Number(limit) + 1);
    } else {
      query.limit(21);
    }

    if (Number(page) > 0) {
      query.offset((Number(page) - 1) * Number(limit));
    }

    const list = await query;

    return c.json({
      reports: list.slice(0, Number(limit) || 20),
      perPage: Number(limit) || 20,
      nextPage: list.length > (Number(limit) || 20),
    });
  }
);

reportRoute.post(
  "/",
  describeRoute({
    description: "Create a report request",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              schedule: {
                type: "string",
                format: "ISO timestamp",
                description: "Timestamp to schedule the report processing",
              },
            },
            example: {
              schedule: "2021-09-30T10:00:00Z",
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const { schedule }: { schedule?: string } = await c.req.json();
    const reportId: string = ulid();

    if (schedule) {
      if (!moment(schedule).isValid()) {
        return c.json({ error: "Invalid schedule format" }, 400);
      }

      await db("reports").insert({
        id: reportId,
        status: "scheduled",
        scheduled_at: new Date(schedule),
      });
      return c.json({ message: "Scheduled report created", reportId });
    }

    await queue.send(PROCESS_REPORT_EVENT, { reportId });
    await db("reports").insert({
      id: reportId,
      status: "pending",
    });
    return c.json({ message: "Report request added to queue", reportId });
  }
);

reportRoute.get(
  "/:id",
  describeRoute({
    description: "Get report status",
    parameters: [
      {
        name: "id",
        description: "Report ID",
        in: "path",
        required: true,
      },
    ],
  }),
  async (c) => {
    const reportId = c.req.param("id");
    const result = await db("reports")
      .select(REPORT_FIELD_SELECTION)
      .where({ id: reportId })
      .first();
    if (!result) return c.json({ error: "Report not found" }, 404);
    return c.json(result);
  }
);

reportRoute.delete(
  "/:id",
  describeRoute({
    description: "Cancel a pending report",
    parameters: [
      {
        name: "id",
        description: "Report ID",
        in: "path",
        required: true,
      },
    ],
  }),
  async (c) => {
    const reportId = c.req.param("id");
    const report = await db("reports")
      .select("status")
      .where({ id: reportId })
      .first();

    if (!report) {
      return c.json({ error: "Report not found" }, 404);
    }

    if (["pending", "scheduled", "processing"].includes(report?.status)) {
      await db("reports")
        .where({ id: reportId })
        .update({ status: "cancelled" });
      return c.json({ message: "Report cancelled" });
    }

    return c.json({ error: `Report is already ${report.status}` }, 400);
  }
);
