import { AppDataSource } from "./entities";
import { DashboardAnalyticsType } from "@vps/utils/lib/data";
import { generateDashboardAnalytics } from "./services/dashboard-analytics";
import {
  subDays,
  subMonths
} from "date-fns";

const test = async () : Promise<void> => {
  await AppDataSource.initialize();
  const generatedDate = new Date();

  await generateDashboardAnalytics(generatedDate, DashboardAnalyticsType.Weekly);
  await generateDashboardAnalytics(subDays(generatedDate, 7), DashboardAnalyticsType.Weekly);

  await generateDashboardAnalytics(generatedDate, DashboardAnalyticsType.Monthly);
  await generateDashboardAnalytics(subMonths(generatedDate, 1), DashboardAnalyticsType.Monthly);
};

test();
