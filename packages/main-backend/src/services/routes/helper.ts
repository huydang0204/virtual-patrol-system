import {
  DateOfWeek, ExecuteTime
} from "@vps/utils/lib/data";

import { RouteSchedule } from "entities";
import {
  NewRouteScheduleRequest,
  RouteScheduleRequest
} from "@vps/utils/lib/dto/routes";
import {
  endOfDay,
  startOfDay
} from "date-fns";

function areExecuteTimeOverlapping(interval1 : ExecuteTime, interval2 : ExecuteTime) : boolean {
  return interval1.startTime < interval2.endTime && interval1.endTime > interval2.startTime;
}

const checkOverlappingExecuteTime = (intervals : ExecuteTime[]) : boolean => {
  const n = intervals.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const aTime = intervals[i];
      const bTime = intervals[j];

      if (!!aTime.repeatHours || !!bTime.repeatHours) {
        // if one of them having repeatHours, it will run all day => return true
        return true;
      }

      if (areExecuteTimeOverlapping(aTime, bTime)) {
        return true;
      }
    }
  }
  return false;
};

interface DateInterval {
  start : Date;
  end : Date;
}

function areDatesOverlapping(interval1 : DateInterval, interval2 : DateInterval) : boolean {
  return interval1.start <= interval2.end && interval1.end >= interval2.start;
}

function doWeeklyDaysMatch(group1 : DateOfWeek[], group2 : DateOfWeek[]) : boolean {
  for (const element of group2) {
    if (group1.includes(element)) return true;
  }
  return false;
}

export const checkOverlappingSchedules = (schedules : (RouteSchedule | NewRouteScheduleRequest)[]) : boolean => {
  for (let i = 0; i < schedules.length - 1; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (schedules[i]["id"] === schedules[j]["id"]) continue;

      const occurredDate1 : DateInterval = {
        start : schedules[j].startOccurrenceDate as Date,
        end : schedules[j].endOccurrenceDate as Date
      };
      const occurredDate2 : DateInterval = {
        start : schedules[i].startOccurrenceDate as Date,
        end : schedules[i].endOccurrenceDate as Date
      };
      if (!areDatesOverlapping(occurredDate1, occurredDate2)) continue;

      const innerWeeklyDays : DateOfWeek[] = schedules[j].executingDays;
      const outerWeeklyDays : DateOfWeek[] = schedules[i].executingDays;
      if (!doWeeklyDaysMatch(innerWeeklyDays, outerWeeklyDays)) continue;

      const innerExecuteTimePool : ExecuteTime[] = schedules[j].executingTime;
      const outerExecuteTimePool : ExecuteTime[] = schedules[i].executingTime;
      if (checkOverlappingExecuteTime([
        ...innerExecuteTimePool,
        ...outerExecuteTimePool
      ])) return true;
    }
  }
  return false;
};

export const parseDataForRouteScheduleRequest = <T extends RouteScheduleRequest | NewRouteScheduleRequest>(schedule : T) : T => {
  schedule.startOccurrenceDate = startOfDay(new Date(schedule.startOccurrenceDate));
  schedule.endOccurrenceDate = schedule.endOccurrenceDate ? endOfDay(new Date(schedule.endOccurrenceDate)) : null;
  schedule.executingTime = schedule.executingTime.sort((aTime : ExecuteTime, bTime : ExecuteTime) => aTime.startTime -
    bTime.startTime);

  return schedule;
};

export const isRequestScheduleOverlappingTimeWithExistedSchedules = (
  parsedScheduleRq : RouteScheduleRequest | NewRouteScheduleRequest,
  routeSchedules : RouteSchedule[],
  siteSchedules : RouteSchedule[]
) : boolean => {
  // 2. check time overlapping in current route schedules
  for (const routeSchedule of routeSchedules) {
    const checkingSchedules = [
      parsedScheduleRq,
      routeSchedule
    ];
    if (checkOverlappingSchedules(checkingSchedules)) {
      return true;
    }
  }

  // 3. check time overlapping in request schedules and same-site live video schedules
  for (const siteSchedule of siteSchedules) {
    const checkingSchedules = [
      parsedScheduleRq,
      siteSchedule
    ];
    if (checkOverlappingSchedules(checkingSchedules)) {
      return true;
    }
  }
  return false;
};
