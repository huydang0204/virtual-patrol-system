import {
  RouteSchedule,
  RouteTask
} from "entities";
import { RouteScheduleRepository } from "repositories/route-repository";
import {
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual
} from "typeorm";
import { eachDayOfInterval } from "date-fns";
import {
  DateOfWeek,
  TaskStatus,
  ExecuteTime
} from "@vps/utils/lib/data";
import { getTimeOfADayText } from "utils/data";

export const generatePostTasks = async (
  fromDate : string,
  toDate : string,
  searchText : string,
  siteId : string
) : Promise<RouteTask[]> => {
  const whereClauses : FindOptionsWhere<RouteSchedule> = {};

  if (fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(fromDate);
    whereClauses["startOccurrenceDate"] = MoreThanOrEqual(from);
    whereClauses["endOccurrenceDate"] = LessThanOrEqual(to);

  }
  if (siteId) {
    whereClauses["route"] = { siteId : siteId };
  }
  if (searchText) {
    const searchPattern = ILike(`%${ searchText }%`);
    whereClauses["route"] = { name : searchPattern };
  }

  const routeSchedules = await RouteScheduleRepository.find({
    where : whereClauses,
    relations : { route : true }
  });
  console.log(routeSchedules);
  const tasks : RouteTask[] = [];
  if (!!routeSchedules && routeSchedules.length > 0) {

    routeSchedules.forEach((currentSchedule : RouteSchedule) => {
      const {
        id,
        startOccurrenceDate,
        endOccurrenceDate,
        executingDays,
        executingTime,
        routeId,
        route
      } = currentSchedule;

      let dateRange : Date[] = [];

      if (!!endOccurrenceDate && !!startOccurrenceDate && (startOccurrenceDate <= endOccurrenceDate)) {
        dateRange = eachDayOfInterval({
          start : startOccurrenceDate,
          end : endOccurrenceDate
        });
      } else {
        dateRange = eachDayOfInterval({
          start : startOccurrenceDate,
          end : startOccurrenceDate
        });
      }

      dateRange.forEach((currentDate : Date) => {
        const day : DateOfWeek = currentDate.getDay();
        if (executingDays.includes(day)) {
          const newTasks : RouteTask[] = executingTime.map((aTime : ExecuteTime) => {
            return {
              name : `${ getTimeOfADayText(aTime.startTime) } ${ route.name || "Shift" }`,
              currentDate,
              startTime : aTime.startTime,
              endTime : aTime.endTime,
              status : TaskStatus.Pending,
              scheduleId : id,
              routeId,
              route
            } as unknown as RouteTask;
          });
          tasks.push(...newTasks);
        }

      });
    });

  }
  return tasks;
};

export function filterWithOffsetAndLimit<T>(array : T[], offset : number, limit : number) : T[] {
  return array.slice(offset, offset + limit);
}

