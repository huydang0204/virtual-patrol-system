import {
  TaskStatus, TaskReportRowData
} from "@vps/utils/lib/data";

import {
  startOfMonth,
  addWeeks,
  format
} from "date-fns";
import {
  DashboardAnalytics,
  RouteTask
} from "entities";
import {
  DashboardAnalyticsResponse,
  DashboardAnalyticsType
} from "@vps/utils/lib/dto/dashboard-analytics";

const prepareDashboardData = (
  tasks : RouteTask[],
  siteId : string,
  type : DashboardAnalyticsType
) : DashboardAnalytics => {
  const taskStatuses = getTaskStatusCountDisplay(tasks);
  const [alertCountAnalytics,
    alertCounts] = getAlertInfo(tasks, type);

  return {
    siteId : siteId,
    taskCountAnalytics : taskStatuses,
    alertCountAnalytics : alertCountAnalytics,
    weeklyAlertCountAnalytics : type == DashboardAnalyticsType.Monthly ? alertCounts : undefined,
    dailyAlertCountAnalytics : type == DashboardAnalyticsType.Weekly ? alertCounts : undefined
  } as DashboardAnalytics;

};

const getSiteInfo = (tasks : RouteTask[]) : [Set<string>, Record<string, RouteTask[]>] => {
  const siteIds = new Set<string>();
  const siteMap : Record<string, RouteTask[]> = {};
  tasks.forEach((task : RouteTask) => {
    if (siteIds.has(task.route.siteId)) {
      siteMap[task.route.siteId].push(task);
    } else {
      siteIds.add(task.route.siteId);
      siteMap[task.route.siteId] = new Array<RouteTask>();
    }
  });
  return [siteIds,
    siteMap];
};

const getAlertInfo = (tasks : RouteTask[], type : DashboardAnalyticsType) : [Record<string, number>, number[]] => {
  const handledAlertTypes : Record<string, number> = {};
  //4 separate week alert count (week 1,..., week 4) or alert count within 1 week ( sunday,...., saturday )
  const alertCounts = type == DashboardAnalyticsType.Monthly ?
    new Array(4).fill(0) :
    new Array(7).fill(0);

  if (!!tasks && tasks.length > 0) {
    tasks.forEach((task : RouteTask) => {
      if (!!task.taskReport) {
        const currentReportDataRows = task.taskReport.reportDataRows;

        for (const setOrderKey in currentReportDataRows) {
          const setOrder = parseInt(setOrderKey);
          const arrTaskReportRowData = currentReportDataRows[setOrder];
          arrTaskReportRowData.forEach((currentTaskReportRowData : TaskReportRowData) => {
            if (!!currentTaskReportRowData.alert) {
              const alertType = currentTaskReportRowData.alert.type;
              if (!handledAlertTypes[alertType]) {
                handledAlertTypes[alertType] = 0;
              }
              handledAlertTypes[alertType] += 1;

              //4 week index (0,1,2,3) or Within 1 week index (0,1,2, ... , 6)
              const currentIndex = type == DashboardAnalyticsType.Monthly ?
                getWeekIndex(task.occurrenceDate) :
                task.occurrenceDate.getDay();
              alertCounts[currentIndex] += 1;
            }
          });
        }
      }
    });
  }

  return [handledAlertTypes,
    alertCounts];
};

const getTaskStatusCountDisplay = (tasks : RouteTask[]) : Record<TaskStatus, number> => {
  const handledTaskCount : Record<TaskStatus, number> = {
    [TaskStatus.Pending] : 0,
    [TaskStatus.OnGoing] : 0,
    [TaskStatus.NotStarted] : 0,
    [TaskStatus.Paused] : 0,
    [TaskStatus.Completed] : 0,
    [TaskStatus.Incomplete] : 0,
    [TaskStatus.Missed] : 0
  };
  if (!!tasks) {
    tasks.forEach((task : RouteTask) => {
      handledTaskCount[task.status] += 1;
    });
  }

  return handledTaskCount;
};

const getWeekIndex = (currentDate : Date) : number => {
  const startOfMonthDate = startOfMonth(currentDate);
  const startOfSecondWeek = addWeeks(startOfMonthDate, 1);
  const startOfThirdWeek = addWeeks(startOfMonthDate, 2);
  const startOfFourthWeek = addWeeks(startOfMonthDate, 3);

  if (currentDate >= startOfMonthDate && currentDate < startOfSecondWeek) {
    return 0;
  } else if (currentDate >= startOfSecondWeek && currentDate < startOfThirdWeek) {
    return 1;
  } else if (currentDate >= startOfThirdWeek && currentDate < startOfFourthWeek) {
    return 2;
  } else {
    return 3;
  }
};

const getDashboardAnalyticsDto = (data : DashboardAnalytics) : DashboardAnalyticsResponse => {
  if (!data) return null;

  const {
    id,
    siteId,
    taskCountAnalytics,
    alertCountAnalytics,
    weeklyAlertCountAnalytics,
    dailyAlertCountAnalytics
  } = data;

  return {
    id,
    siteId,
    taskCountAnalytics,
    alertCountAnalytics,
    weeklyAlertCountAnalytics,
    dailyAlertCountAnalytics
  };
};

const isDateSameAsCurrentTime = (date : string, type : DashboardAnalyticsType, now : Date) : boolean => {
  if (!date) return true;
  let targetedDate : Date;

  if (type == DashboardAnalyticsType.Weekly) {
    const dates = date.split(":");
    targetedDate = new Date(dates[0]);
  } else {
    targetedDate = new Date(date);
  }

  // if request date is in the current month (which dashboard data haven't been generated),
  // consider it is null to calculate current month's data. same to current week
  if (targetedDate.getMonth() == now.getMonth() && targetedDate.getFullYear() == now.getFullYear()) {
    if (type == DashboardAnalyticsType.Monthly) return true;
    else {
      const targetedWeeks = format(targetedDate, "ww");
      const currentWeeks = format(now, "ww");
      if (targetedWeeks >= currentWeeks) {
        return true;
      }
    }
  }
  return false;
};

export {
  prepareDashboardData,
  getSiteInfo,
  getAlertInfo,
  getTaskStatusCountDisplay,
  getWeekIndex,
  getDashboardAnalyticsDto,
  isDateSameAsCurrentTime
};
