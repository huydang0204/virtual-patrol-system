import {
  RouteTask,
  Site,
  TaskDailyReport,
  TaskMonthlyReport
} from "entities";
import {
  RouteTaskResponse,
  TaskDailyReportDetailResponse,
  TaskSummaryReportResponse,
  TaskMonthlyReportDetailResponse
} from "@vps/utils/lib/dto/task";
import { getRouteDto } from "services/routes/mapper";
import { EntityOverallData } from "@vps/utils/lib/data";

export const getRouteTaskDto = (task : RouteTask, includeReport ?: boolean) : RouteTaskResponse => {
  const {
    id,
    name,
    occurrenceDate,
    startTime,
    endTime,
    status,
    startComment,
    endComment,
    routeId,
    route,
    lastCheckpointId,
    taskReport
  } = task;

  let result : RouteTaskResponse = {
    id,
    name,
    occurrenceDate : occurrenceDate?.toISOString(),
    startTime,
    endTime,
    status,
    startComment,
    endComment,
    routeId,
    route : getRouteDto(route),
    reportCreatedAt : taskReport?.createdAt.toISOString(),
    lastCheckpointId
  };

  if (includeReport) {
    result = {
      ...result,
      reportDataRows : taskReport?.reportDataRows
    };
  }

  return result;
};

export const getTaskSummaryReportDto = (report : TaskDailyReport | TaskMonthlyReport) : TaskSummaryReportResponse => {
  if (!report) return null;
  const {
    id,
    site,
    createdAt
  } = report;

  return {
    id,
    site : new EntityOverallData<Site>(site),
    createdAt : createdAt.toISOString()
  };
};

export const getTaskDailyReportDto = (report : TaskDailyReport) : TaskDailyReportDetailResponse => {
  if (!report) return null;
  const {
    id,
    site,
    createdAt,
    taskReportData
  } = report;

  return {
    id,
    site : new EntityOverallData<Site>(site),
    createdAt : createdAt.toISOString(),
    taskReportData
  };
};

export const getTaskMonthlyReportDto = (report : TaskMonthlyReport) : TaskMonthlyReportDetailResponse => {
  if (!report) return null;
  const {
    id,
    site,
    createdAt,
    taskCounts,
    taskStatusRecords
  } = report;

  return {
    id,
    site : new EntityOverallData<Site>(site),
    createdAt : createdAt.toISOString(),
    taskCounts,
    taskStatusRecords
  };
};
