import PgBoss from "pg-boss";
import { TASK_TO_REGISTER } from "./tasks";
import { logger } from "./logger";

export const queue = new PgBoss({
  connectionString: process.env.DATABASE_URL,
  schedule: true,
  schema: "user_pg_boss",
});

async function cleanupQueuesAndSchedules() {
  const [queues, schedules] = await Promise.all([
    queue.getQueues(),
    queue.getSchedules(),
  ]);
  await Promise.all([
    ...queues
      .filter((q) => !q.name.includes("pgboss"))
      .map((q) => queue.deleteQueue(q.name)),
    ...schedules.map((s) => queue.unschedule(s.name)),
  ]);
}

async function logExistingQueueAndSchedules() {
  const [queues, schedules] = await Promise.all([
    queue.getQueues(),
    queue.getSchedules(),
  ]);
  logger.info(
    `Queues registered: ${JSON.stringify(queues.map((q) => q.name))}`
  );
  logger.info(
    `Schedules registered: ${JSON.stringify(schedules.map((s) => s.name))}`
  );
}

export async function initializeQueue() {
  // start pg-boss before registering tasks, ensure queue and schedule are running
  queue.on("error", logger.error);
  await queue.start();

  // register tasks sequentially, avoid deadlocks
  for (const task of TASK_TO_REGISTER) {
    await task(queue);
  }

  await logExistingQueueAndSchedules();
}
