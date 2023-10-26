import {
  AppDataSource,
  DashboardAnalytics
} from "entities";

export const DashboardAnalyticsRepository = AppDataSource.getRepository(DashboardAnalytics).extend({});