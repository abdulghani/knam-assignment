import PgBoss from "pg-boss";
import { logger } from "../logger";
import { db } from "../db";

export const PROCESS_REPORT_EVENT = "task:process-report";
const taskLogger = logger.child({ task: PROCESS_REPORT_EVENT });

export async function registerProcessReport(instance: PgBoss) {
  await instance.createQueue(PROCESS_REPORT_EVENT);
  await instance.work(PROCESS_REPORT_EVENT, async (jobs) => {
    await Promise.all(
      jobs.map(async (job: any) => {
        const reportId = job?.data?.reportId;

        if (!reportId) {
          taskLogger.error("Missing reportId in job data");
          return;
        }

        taskLogger.info(`Processing report ${reportId}`);
        const report = await db("reports").where("id", reportId).first();

        if (!report) {
          taskLogger.error(`Report ${reportId} not found`);
          return;
        }

        if (!["pending", "scheduled"].includes(report.status)) {
          taskLogger.error(`Report ${reportId} is not pending`);
          return;
        }

        // process report, do some heavy lifting here presumably
        await db("reports").where("id", reportId).update({
          status: "completed",
        });
        taskLogger.info(`Report ${reportId} processed`);
      })
    );
  });
}
