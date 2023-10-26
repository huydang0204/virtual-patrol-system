import _ from "lodash";
import { CameraResponse } from "@vps/utils/lib/dto";
import {
  ExecuteTime, DateOfWeek
} from "@vps/utils/lib/data";

import { Schedule } from "model-type/component-types";
import { convertCalendarDateToDate } from "./date-time";

function areExecuteTimeOverlapping(interval1: ExecuteTime, interval2: ExecuteTime): boolean {
  return interval1.startTime < interval2.endTime && interval1.endTime > interval2.startTime;
}

const checkOverlappingExecuteTime = (intervals : ExecuteTime[]) : boolean => {
  const n = intervals.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (areExecuteTimeOverlapping(intervals[i], intervals[j])) {
        return true;
      }
    }
  }
};

interface DateInterval {
  start : Date;
  end : Date;
}

function areDatesOverlapping(interval1: DateInterval, interval2: DateInterval): boolean {
  return interval1.start <= interval2.end && interval1.end >= interval2.start;
}

function doWeeklyDaysMatch(group1 : DateOfWeek[], group2 : DateOfWeek[]) : boolean {
  for (const element of group2) {
    if (group1.includes(element)) {
      return true;
    }
  }
  return false;
}

export const checkOverlappingTimeWithinSchedule = (schedules : Schedule[]) : boolean => {
  for (const schedule of schedules) {
    if (checkOverlappingExecuteTime(schedule.executingTime))
      return true;
  }
  return false;
};

export const checkOverlappingSchedules = (schedules : Schedule[]) : boolean => {
  for (let i = 0; i < schedules.length - 1; i++) {
    for (let j = i + 1; j < schedules.length; j++) {

      const occurredDate1 : DateInterval = {
        start : convertCalendarDateToDate(schedules[j].startOccurrenceDate),
        end : convertCalendarDateToDate(schedules[j].endOccurrenceDate, true)
      };
      const occurredDate2 : DateInterval = {
        start : convertCalendarDateToDate(schedules[i].startOccurrenceDate),
        end : convertCalendarDateToDate(schedules[i].endOccurrenceDate, true)
      };
      if (!areDatesOverlapping(occurredDate1, occurredDate2)) continue;

      const innerWeeklyDays : DateOfWeek[] = schedules[j].executingDays;
      const outerWeeklyDays : DateOfWeek[] = schedules[i].executingDays;
      if (!doWeeklyDaysMatch(innerWeeklyDays, outerWeeklyDays)) continue;

      const innerExecuteTimePool : ExecuteTime[] = schedules[j].executingTime;
      const outerExecuteTimePool : ExecuteTime[] = schedules[i].executingTime;
      if (checkOverlappingExecuteTime([...innerExecuteTimePool,
        ...outerExecuteTimePool])) return true;
    }

  }
  return false;
};

export const checkAllSchedulesValidity = (schedules : Schedule[]) : boolean => {
  const seenCombinations = new Set();

  for (const schedule of schedules) {
    const combinationKey = JSON.stringify({
      start : schedule.startOccurrenceDate,
      end : schedule.endOccurrenceDate,
      days : schedule.executingDays,
      time : schedule.executingTime
    });

    if (seenCombinations.has(combinationKey)) return false;

    seenCombinations.add(combinationKey);
  }

  return true;
};

export function getDuplicatedCameraNamesArr(inputArr : CameraResponse[]) : string[] {
  const grouped = _.groupBy(inputArr, "name");
  const duplicates = _.filter(grouped, group => group.length > 1);
  const duplicatedNames = _.map(duplicates, group => group[0].name);
  return duplicatedNames;
}