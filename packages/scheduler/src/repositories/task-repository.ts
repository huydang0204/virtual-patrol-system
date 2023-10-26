import {
  AppDataSource,
  RouteTask,
  TaskReport,
  TaskMonthlyReport,
  TaskDailyReport
} from "entities";

export const RouteTaskRepository = AppDataSource.getRepository(RouteTask).extend({});
export const TaskReportRepository = AppDataSource.getRepository(TaskReport).extend({});
export const TaskMonthlyReportRepository = AppDataSource.getRepository(TaskMonthlyReport).extend({});
export const TaskDailyReportRepository = AppDataSource.getRepository(TaskDailyReport).extend({});