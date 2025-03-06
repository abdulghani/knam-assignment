import { registerProcessReport } from "./process-report";
import { registerProcessScheduledReport } from "./process-scheduled-report";

export const TASK_TO_REGISTER = [
  registerProcessReport,
  registerProcessScheduledReport,
];
