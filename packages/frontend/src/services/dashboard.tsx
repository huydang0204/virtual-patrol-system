import { apiGetDashboardData } from "apis/dashboard-api";
import { DashboardAnalyticsResponse } from "@vps/utils/lib/dto/dashboard-analytics";

export const fetchDashboardData = async (monthYear: string, type: "Weekly" | "Monthly", siteId?: number): Promise<DashboardAnalyticsResponse> => {
  const {
    data,
    error
  } = await apiGetDashboardData(monthYear, type, siteId);

  if (!error && data) return data;
};