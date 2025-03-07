import PgBoss from "pg-boss";
import { logger } from "../logger";
import { db } from "../db";
import { PROCESS_REPORT_EVENT } from "./process-report";

const QUEUE_NAME = "task:process-scheduled-report";
const taskLogger = logger.child({ task: QUEUE_NAME });
const REPORT_PROCESS_CRON = process.env.REPORT_PROCESS_CRON || "* * * * *"; // default to every minute

export async function registerProcessScheduledReport(instance: PgBoss) {
  await instance.createQueue(QUEUE_NAME);
  await instance.schedule(QUEUE_NAME, REPORT_PROCESS_CRON);
  await instance.work(QUEUE_NAME, async (job) => {
    taskLogger.info(`Looking up scheduled pending reports`);

    const reports = await db("reports")
      .where({
        status: "scheduled",
      })
      .andWhere("scheduled_at", "<=", new Date());

    if (!reports.length) {
      taskLogger.info(`No scheduled reports to process`);
      return;
    }

    taskLogger.info(`Found ${reports.length} scheduled reports to process`);
    await Promise.all(
      reports.map(async (report) =>
        instance.send(PROCESS_REPORT_EVENT, { reportId: report.id })
      )
    );
  });
}
