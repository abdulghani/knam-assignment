import PgBoss from "pg-boss";
import { logger } from "../logger";

const QUEUE_NAME = "task:process-scheduled-report";

export async function registerProcessScheduledReport(instance: PgBoss) {
  await instance.createQueue(QUEUE_NAME);
  await instance.schedule(QUEUE_NAME, "* * * * *");
  await instance.work(QUEUE_NAME, async (job) => {
    logger.info(`Processing scheduled report: ${JSON.stringify(job)}`);
  });
}
