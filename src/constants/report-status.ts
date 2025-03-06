type ReportStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export const ReportStatusList: ReportStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
];
