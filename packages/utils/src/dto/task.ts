import {
  TaskStatus,
  TaskStatusRecord
} from "../data";
import {
  AlertData,
  EntityOverallData,
  TaskDailyReportData,
  TaskReportRowData
} from "../data";
import { RouteResponse } from "../dto/routes";
import { Site } from "../entities";

export interface RouteTaskResponse {
  id ?: string;
  name : string;
  occurrenceDate : string;
  startTime : number;
  endTime : number;
  status : TaskStatus;
  startComment ?: string,
  endComment ?: string,
  routeId : string;
  route : RouteResponse;
  lastCheckpointId ?: string;
  reportCreatedAt ?: string;
  reportDataRows ?: Record<number, TaskReportRowData[]>;
}

export enum TaskError {
  InvalidTaskId = "InvalidTaskId",
  InvalidTaskReportId = "InvalidTaskReportId",
  InvalidAssignedUser = "InvalidAssignedUser",
  InvalidCameraId = "InvalidCameraId",
  InvalidCheckpointId = "InvalidCheckpointId",
  TaskStarted = "TaskStarted",
  TaskNotStarted = "TaskNotStarted",
  TaskEnded = "TaskEnded",
  InvalidTaskStartTime = "InvalidTaskStartTime"
}

export interface AlertRequest {
  cameraId?: string;
  checkpointId?: string;
  snapshotTimeInEpoch?: number;
  alert?: AlertData;
}

export interface TaskSummaryReportResponse {
  id : string;
  site : EntityOverallData<Site>;
  createdAt : string;
}

export interface TaskDailyReportDetailResponse extends TaskSummaryReportResponse {
  taskReportData ?: TaskDailyReportData[];
}

export interface TaskMonthlyReportDetailResponse extends TaskSummaryReportResponse {
  taskCounts : Record<TaskStatus, number>;
  taskStatusRecords : Record<string, TaskStatusRecord[]>;
}

/*
 frontend
*/

export interface TaskReport {
  id: string,
  createdAt: Date | string,
  reportDataRows: Record<number, TaskReportRowData[]>,
  task: RouteTaskResponse
}

export interface TaskDailyReport extends TaskSummaryReportResponse {
  taskReportData?: TaskDailyReportData[];
}

export interface TaskMonthlyReport extends TaskSummaryReportResponse {
  taskCounts: Record<TaskStatus, number>;
  taskStatusRecords: Record<string, TaskStatusRecord[]>;
}