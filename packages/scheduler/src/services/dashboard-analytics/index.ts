import {
  startOfMonth,
  format,
  endOfMonth,
  startOfWeek,
  endOfWeek
} from "date-fns";
import { DashboardAnalytics } from "entities";

import {
  RouteTaskRepository,
  DashboardAnalyticsRepository
} from "repositories";
import { Between } from "typeorm";
import {
  getSiteInfo,
  prepareDashboardData
} from "./helper";

import {
  DashboardAnalyticsType, DEFAULT_BIGINT_ID
} from "@vps/utils/lib/data";

const generateDashboardAnalytics = async (executedDate : Date, type : DashboardAnalyticsType) : Promise<void> => {
  const tasks = await RouteTaskRepository.find({
    where : type == DashboardAnalyticsType.Monthly ? { occurrenceDate : Between(startOfMonth(executedDate), endOfMonth(executedDate)) } : { occurrenceDate : Between(startOfWeek(executedDate), endOfWeek(executedDate)) },
    relations : {
      taskReport : true,
      route : true
    },
    order : { occurrenceDate : "ASC" } // this order make records order from day 1 to day 30/31
  });

  const dashboardAnalyticsGroup : DashboardAnalytics[] = [];
  const [siteIds,
    siteMap] = getSiteInfo(tasks);

  const formattedDate = type == DashboardAnalyticsType.Monthly ?
    format(executedDate, "MMM-yyyy") :
    getDailyFormatDate(executedDate);

  for (const currentSetId of siteIds) {
    const currentTaskGroup = siteMap[currentSetId];
    const currentDashboardAnalytics = prepareDashboardData(currentTaskGroup, currentSetId, formattedDate, type);
    dashboardAnalyticsGroup.push(currentDashboardAnalytics);
  }

  const dashboardAnalyticsForAll = prepareDashboardData(tasks, DEFAULT_BIGINT_ID, formattedDate, type);
  dashboardAnalyticsGroup.push(dashboardAnalyticsForAll);

  await DashboardAnalyticsRepository.save(dashboardAnalyticsGroup);
};

const getDailyFormatDate = (executedDate: Date) : string => {
  const firstDayOfWeek = startOfWeek(executedDate);
  const lastDayOfWeek = endOfWeek(executedDate);
  const formattedFirstDay = format(firstDayOfWeek, "dd-MMM-yyyy");
  const formattedLastDay = format(lastDayOfWeek, "dd-MMM-yyyy");
  return `${formattedFirstDay}:${formattedLastDay}`;
};

export { generateDashboardAnalytics };

