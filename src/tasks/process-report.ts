import PgBoss from "pg-boss";
import { logger } from "../logger";

export const PROCESS_REPORT_EVENT = "task:process-report";

export async function registerProcessReport(instance: PgBoss) {
  await instance.createQueue(PROCESS_REPORT_EVENT);
  await instance.work(PROCESS_REPORT_EVENT, async (job) => {
    logger.info(`Processing report: ${JSON.stringify(job)}`);
  });
}
