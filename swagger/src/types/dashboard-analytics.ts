import { TaskStatus } from "./task";

/**
 * response of dashboard-analytics api
 */
export interface DashboardAnalyticsResponse {
    id: string,
    siteId: number,
    taskCountAnalytics: Record<TaskStatus, number>,
    alertCountAnalytics: Record<string, number>,
    weeklyAlertCountAnalytics: number[]
}

export const exampleTaskCountAnalytics: Record<TaskStatus, number> = {
  [TaskStatus.Completed] : 1,
  [TaskStatus.Incomplete] : 1,
  [TaskStatus.Missed] : 1,
  [TaskStatus.NotStarted] : 1,
  [TaskStatus.OnGoing] : 1,
  [TaskStatus.Paused] : 1,
  [TaskStatus.Pending] : 1
};

export const exampleAlertCountAnalytics: Record<string, number> = { "abc" : 1 };