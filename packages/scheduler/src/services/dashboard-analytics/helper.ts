import {
  DashboardAnalyticsType,
  TaskStatus,
  TaskReportRowData
} from "@vps/utils/lib/data";
import {
  startOfMonth,
  addWeeks
} from "date-fns";
import {
  DashboardAnalytics,
  RouteTask
} from "entities";

const prepareDashboardData = (tasks: RouteTask[], siteId: string, formattedDate: string, type: DashboardAnalyticsType): DashboardAnalytics => {
  const taskStatuses = getTaskStatusCountDisplay(tasks);
  const [alertCountAnalytics,
    alertCounts] = getAlertInfo(tasks, type);

  return {
    id : formattedDate,
    siteId : siteId,
    taskCountAnalytics : taskStatuses,
    alertCountAnalytics : alertCountAnalytics,
    weeklyAlertCountAnalytics : type == DashboardAnalyticsType.Monthly? alertCounts: undefined,
    dailyAlertCountAnalytics : type == DashboardAnalyticsType.Weekly ? alertCounts : undefined
  } as DashboardAnalytics;

};

const getSiteInfo = (tasks: RouteTask[]): [Set<string>, Record<string, RouteTask[]>] => {
  const siteIds = new Set<string>();
  const siteMap: Record<string, RouteTask[]> = {};
  tasks.forEach((task: RouteTask) => {
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

const getAlertInfo = (tasks: RouteTask[], type: DashboardAnalyticsType): [Record<string, number>, number[]] => {
  const handledAlertTypes: Record<string, number> = {};

  //4 separate week alert count (week 1,..., week 4) or alert count within 1 week ( sunday,...., saturday )
  const alertCounts = type == DashboardAnalyticsType.Monthly ? new Array(4).fill(0) : new Array(7).fill(0);

  if (!!tasks && tasks.length > 0) {
    tasks.forEach((task: RouteTask) => {
      if (!!task.taskReport) {
        const currentReportDataRows = task.taskReport.reportDataRows;

        for (const setOrderKey in currentReportDataRows) {
          const setOrder = parseInt(setOrderKey);
          const arrTaskReportRowData = currentReportDataRows[setOrder];
          arrTaskReportRowData.forEach((currentTaskReportRowData: TaskReportRowData) => {
            if (!!currentTaskReportRowData.alert) {
              const alertType = currentTaskReportRowData.alert.type;
              if (!handledAlertTypes[alertType]) {
                handledAlertTypes[alertType] = 0;
              }
              handledAlertTypes[alertType] += 1;

              //4 week index (0,1,2,3) or Within 1 week index (0,1,2, ... , 6)
              const currentIndex = type == DashboardAnalyticsType.Monthly ? getWeekIndex(task.occurrenceDate) : task.occurrenceDate.getDay();
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

const getTaskStatusCountDisplay = (tasks: RouteTask[]): Record<TaskStatus, number> => {
  const handledTaskCount: Record<TaskStatus, number> = {
    [TaskStatus.Pending] : 0,
    [TaskStatus.OnGoing] : 0,
    [TaskStatus.NotStarted] : 0,
    [TaskStatus.Paused] : 0,
    [TaskStatus.Completed] : 0,
    [TaskStatus.Incomplete] : 0,
    [TaskStatus.Missed] : 0
  };
  if (!!tasks) {
    tasks.forEach((task: RouteTask) => {
      handledTaskCount[task.status] += 1;
    });
  }

  return handledTaskCount;
};

const getWeekIndex = (currentDate: Date): number => {
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

export {
  prepareDashboardData, getSiteInfo, getAlertInfo, getTaskStatusCountDisplay, getWeekIndex
};
