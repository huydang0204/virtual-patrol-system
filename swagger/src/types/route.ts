import { CameraResponse } from "./camera";
import {
  EntityOverallData,
  exampleBoolean,
  exampleDate,
  exampleNumber,
  exampleUUID
} from "./common";

/**
 * response of route apis
 */
export interface RouteResponse {
    id: string;
    name: string;
    createdAt: Date;
    siteId: number;
    allowStartTime: number,
    patrolMode: string,
    site: EntityOverallData;
    createdUserId: string;
    createdUserName: string;
    assignedUsers: EntityOverallData[];
    reminderTime: number;
    deleted: boolean;
}

/**
 * response on route deletion
 */
export interface RouteDeleteResult {
    checkpointsDeleteCount: number;
    schedulesDeleteCount: number;
    routeDeleteCount: number;
    routeName?: string;
}

/**
 * response for route detail including schedules and checkpoints
 */
export interface RouteDetailResponse extends RouteResponse {
    routeCheckpoints?: RouteCheckpointResponse[];
    routeSchedules?: RouteScheduleResponse[];
}

/**
 * response of checkpoint apis
 */
export interface RouteCheckpointResponse {
    id: string;
    setOrder: number;
    layoutRow: number;
    layoutCol: number;
    cameras: CameraResponse[];
}

/**
 * response of schedule apis
 */
export interface RouteScheduleResponse {
    id: string;
    startOccurrenceDate: Date;
    endOccurrenceDate: Date;
    executingDays: DateOfWeek[];
    executingTime: ExecuteTime[];
}

/**
 * Sun, Mon, ..., Sat
 */
export enum DateOfWeek {
    Sun,
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
}

/**
 * start and end times
 */
export type ExecuteTime = {
    startTime: number,
    endTime: number
}

/**
 * request body for update and creation of route
 */
export interface RouteRequestBody {
    name : string;
    siteId: number;
    allowStartTime: number;
    patrolMode: string;
    assignedUserIds : string[];
    reminderTime : number;
}

/**
 * Entity data is produced.
 */
export interface Entity {
    data : unknown
}

/**
 * List of entity data
 */
export interface EntityList {
    entities: Entity[]
}

/**
 * request body for update and creation of checkpoint
 */
export interface RouteCheckpointRequest {
    id?: string;
    setOrder: number;
    layoutRow: number;
    layoutCol: number;
    cameraIds: string[];
}

/**
 * request body for update and creation of schedule
 */
export interface RouteScheduleRequest {
    id?: string;
    startOccurrenceDate: Date,
    endOccurrenceDate: Date,
    executingDays: DateOfWeek[],
    executingTime: ExecuteTime[],
}

export const exampleRouteResponse: RouteResponse = {
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
};