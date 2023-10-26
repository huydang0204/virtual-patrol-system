
import {
  TaskStatus, TaskShift
} from "@vps/utils/lib/data";
import {
  endOfDay,
  startOfDay
} from "date-fns";
import {
  AppDataSource,
  RouteTask,
  TaskReport,
  TaskMonthlyReport,
  TaskDailyReport
} from "entities";
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  In,
  Not
} from "typeorm";

export const RouteTaskRepository = AppDataSource.getRepository(RouteTask).extend({

  async findAndCountWithOptions(
    limit: number,
    offset: number,
    fromDate: string,
    toDate: string,
    filterStatuses: TaskStatus[],
    searchText: string,
    siteId: string,
    filterShift: TaskShift
  ): Promise<[RouteTask[], number]> {

    const whereClauses: FindOptionsWhere<RouteTask> = {};
    if (!!fromDate) {
      const from = new Date(fromDate);
      const to = !!toDate ? new Date(toDate) : new Date();
      whereClauses["occurrenceDate"] = Between(startOfDay(from), endOfDay(to));
    }
    if (!!filterStatuses && filterStatuses.length > 0) {
      whereClauses["status"] = In(filterStatuses);
    }
    if (!!searchText) {
      const searchPattern = ILike(`%${searchText}%`);
      whereClauses["name"] = searchPattern;
    }
    if (!!filterShift) {
      const dayShiftStartTimeClauses = Between(3600 * 5, 3600 * 21 - 1);
      switch (filterShift) {
        case TaskShift.Day:
          whereClauses["startTime"] = dayShiftStartTimeClauses;
          break;
        case TaskShift.Night:
          whereClauses["startTime"] = Not(dayShiftStartTimeClauses);
          break;
      }
    }

    if (!!siteId) {
      whereClauses["route"] = { siteId : siteId };
    }
    const options: FindManyOptions<RouteTask> = {
      where : whereClauses,
      relations : {
        route : {
          site : true,
          assignedUsers : true
        },
        taskReport : true
      },
      order : {
        occurrenceDate : "DESC",
        startTime : "ASC"
      }
    };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    return await RouteTaskRepository.findAndCount(options);

  },
  async countWithOptions(
    fromDate: string,
    toDate: string,
    filterStatuses: TaskStatus[]
  ): Promise<number> {

    const whereClauses: FindOptionsWhere<RouteTask> = {};
    if (!!fromDate) {
      const from = new Date(fromDate);
      const to = !!toDate ? new Date(toDate) : new Date();
      whereClauses["occurrenceDate"] = Between(startOfDay(from), endOfDay(to));
    }
    if (!!filterStatuses && filterStatuses.length > 0) {
      whereClauses["status"] = In(filterStatuses);
    }
    const options: FindManyOptions<RouteTask> = { where : whereClauses };
    return await RouteTaskRepository.count(options);

  }
});
export const TaskReportRepository = AppDataSource.getRepository(TaskReport).extend({});
export const TaskMonthlyReportRepository = AppDataSource.getRepository(TaskMonthlyReport).extend({});
export const TaskDailyReportRepository = AppDataSource.getRepository(TaskDailyReport).extend({});
