
import {
  EntityOverallData,
  exampleBoolean,
  exampleDate,
  exampleNumber,
  exampleUUID
} from "./common";
import { RouteResponse } from "./route";

/**
 * Task Status. Pending, OnGoing, NotStarted, Paused, Completed, Incomplete, Missed
 */
export enum TaskStatus {
  //don't change this order. It can break code at somewhere else.
    Pending = "Pending",
    OnGoing = "OnGoing",
    NotStarted = "NotStarted",
    Paused = "Paused",
    Completed = "Completed",
    Incomplete = "Incomplete",
    Missed = "Missed"
}

/**
 * task response
 */
export interface RouteTaskResponse {
    id: string;
    name: string;
    occurrenceDate: Date;
    startTime: number;
    endTime: number;
    status: TaskStatus;
    startComment: string,
    endComment: string,
    routeId: string;
    route: RouteResponse;
    lastCheckpointId: string;
    reportCreatedAt: Date;
    reportDataRows?: Record<number, TaskReportRowData[]>;
}

/**
 * Task Report Raw Data from Route Task Response
 */
export interface TaskReportRowData {
    camera: CameraData,
    timeCompleted: string, // as Date
    completedUserId: string,
    completedUserName: string,
    faultDetected: boolean, // false for acknowledge/comment only, true for having alert
    alert?: AlertData // define when there is fault detected, otherwise leave it null,
    comment?: string
}

/**
 * Alert Data Schema
 */
export interface AlertData {
    type: string,
    description: string,
    actionsTaken: string
}

/**
 * Task Summary Report Response
 */
export interface TaskSummaryReportResponse {
    id: string;
    site: EntityOverallData;
    createdAt: Date;
}

/**
 * Task Report Response for daily
 */
export interface TaskDailyReportDetailResponse extends TaskSummaryReportResponse {
    taskReportData?: TaskDailyReportData[];
}

/**
 * Task Report Response for monthly
 */
export interface TaskMonthlyReportDetailResponse extends TaskSummaryReportResponse {
    taskCounts: Record<TaskStatus, number>;
    taskStatusRecords: Record<string, TaskStatusRecord[]>;
}

/**
 * Task Daily Report Data used in Daily Response
 */
export interface TaskDailyReportData {
    id: string;
    name: string;
    status: string;
    endComment: string;
    reportDataRows: Record<number, TaskReportRowData[]>;
}

/**
 * Task Status Report.
 * Not Generated = 0
 * Completed = 1
 * Missed = 2,
 * Incomplete = 3
 */
export enum TaskStatusRecord {
    NotGenerated = 0,
    Completed = 1,
    Missed = 2,
    Incomplete = 3
}

/**
 * Request Body for raising alert
 */
export interface RaiseAlertRequestBody {
  cameraId?: string;
  checkpointId?: string;
  snapshotTimeInEpoch?: number;
  alert?: AlertData;
}

/**
 * Request Body for acknowledge
 */
export interface AcknowledgeRequestBody {
  cameraId?: string;
  checkpointId?: string;
  snapshotTimeInEpoch?: number;
  comment?:string
}

/**
 * Request Body for comment
 */
export interface CommentRequestBody {
  cameras : CameraData[],
  checkpointId: string
}

/**
 * Camera Data used in comment request and task report raw data
 */
export interface CameraData {
  id: string,
  name?: string,
  snapshotTimeInEpoch: number, // must have
}

export const exampleRouteTask: RouteTaskResponse = {
  id : exampleUUID,
  name : "string",
  occurrenceDate : exampleDate,
  startTime : exampleNumber,
  endTime : exampleNumber,
  status : TaskStatus.Pending,
  startComment : "string",
  endComment : "string",
  routeId : exampleUUID,
  route : {
    id : exampleUUID,
    name : "string",
    createdAt : exampleDate,
    siteId : exampleNumber,
    allowStartTime : exampleNumber,
    patrolMode : "string",
    site : {
      id : "string",
      name : "string"
    },
    createdUserId : exampleUUID,
    createdUserName : "string",
    assignedUsers : [
      {
        id : exampleUUID,
        name : "string"
      }
    ],
    reminderTime : exampleNumber,
    deleted : exampleBoolean
  },
  lastCheckpointId : exampleUUID,
  reportCreatedAt : exampleDate
};

export const exampleTaskDailyReport: TaskDailyReportDetailResponse = {
  id : exampleUUID,
  site : {
    id : "string",
    name : "string"
  },
  createdAt : exampleDate,
  taskReportData : []
};

export const exampleTaskMonthlyReport: TaskMonthlyReportDetailResponse = {
  taskCounts : {
    [TaskStatus.Pending] : exampleNumber,
    [TaskStatus.OnGoing] : exampleNumber,
    [TaskStatus.NotStarted] : exampleNumber,
    [TaskStatus.Paused] : exampleNumber,
    [TaskStatus.Completed] : exampleNumber,
    [TaskStatus.Incomplete] : exampleNumber,
    [TaskStatus.Missed] : exampleNumber
  },
  taskStatusRecords : {},
  id : exampleUUID,
  site : {
    id : "string",
    name : "string"
  },
  createdAt : exampleDate
};

export const exampleTaskSummaryReportResponse: TaskSummaryReportResponse = {
  id : exampleUUID,
  site : {
    id : "string",
    name : "string"
  },
  createdAt : exampleDate
};