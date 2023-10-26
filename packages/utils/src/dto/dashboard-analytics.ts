import { TaskStatus } from "../data";

enum DashboardAnalyticsError {
  NotFound = "NotFound"
}

interface DashboardAnalyticsResponse {
  id : string,
  siteId : string,
  taskCountAnalytics : Record<TaskStatus, number>,
  alertCountAnalytics : Record<string, number>,
  weeklyAlertCountAnalytics: number[],
  dailyAlertCountAnalytics: number[]
}
enum DashboardAnalyticsType {
  Monthly = "Monthly",
  Weekly = "Weekly"
}
export {
  DashboardAnalyticsError,
  DashboardAnalyticsResponse,
  DashboardAnalyticsType
};

