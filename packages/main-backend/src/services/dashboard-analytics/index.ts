import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { Between } from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

import {
  DashboardAnalyticsRepository,
  RouteTaskRepository
} from "repositories";
import { RouteTask } from "entities";

import {
  getDashboardAnalyticsDto,
  isDateSameAsCurrentTime,
  prepareDashboardData
} from "./helper";
import {
  DEFAULT_BIGINT_ID, ServiceResponse
} from "@vps/utils/lib/data";

import {
  DashboardAnalyticsError,
  DashboardAnalyticsResponse,
  DashboardAnalyticsType
} from "@vps/utils/lib/dto/dashboard-analytics";

const getDashboardAnalytics = async (
  date : string,
  siteId: string,
  type: DashboardAnalyticsType
): Promise<ServiceResponse<DashboardAnalyticsResponse, DashboardAnalyticsError>> => {
  const now = new Date();
  if (isDateSameAsCurrentTime(date, type, now)) {
    date = null;
  }

  let result: DashboardAnalyticsResponse;
  if (!!date) {
    const dashboardAnalytics = await DashboardAnalyticsRepository.findOne({
      where : {
        id : date,
        siteId : !!siteId ? siteId : DEFAULT_BIGINT_ID
      }
    });

    result = getDashboardAnalyticsDto(dashboardAnalytics);
  } else {
    const whereClauses: FindOptionsWhere<RouteTask> = type == DashboardAnalyticsType.Monthly ?
      { occurrenceDate : Between(startOfMonth(now), endOfMonth(now)) } :
      { occurrenceDate : Between(startOfWeek(now), endOfWeek(now)) };
    if (!!siteId && siteId != "0") {
      whereClauses["route"] = { siteId };
    }

    const tasks = await RouteTaskRepository.find({
      where : whereClauses,
      relations : {
        taskReport : true,
        route : true
      },
      order : { occurrenceDate : "ASC" } // this order make records order from day 1 to day 30/31
    });
    if (tasks && tasks.length > 0) {
      const dashboardAnalytics = prepareDashboardData(tasks, siteId ? siteId : DEFAULT_BIGINT_ID, type);
      result = getDashboardAnalyticsDto(dashboardAnalytics);
    }
  }

  return !result ? { error : DashboardAnalyticsError.NotFound } : { data : result };
};

export { getDashboardAnalytics };
