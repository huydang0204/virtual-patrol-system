import { DateOfWeek } from "../data";
import {
  EntityOverallData,
  ExecuteTime
} from "../data";
import { CameraResponse } from "../dto/camera";
import { Site } from "../entities";
import { MiniUserResponse } from "../dto/user";

interface RouteCheckpointResponse {
  id : string;
  setOrder : number;
  layoutRow : number;
  layoutCol : number;
  cameras : CameraResponse[];
}

interface RouteScheduleResponse {
  id : string;
  startOccurrenceDate : Date;
  endOccurrenceDate : Date;
  executingDays : DateOfWeek[];
  executingTime : ExecuteTime[];
}

interface RouteResponse {
  id : string;
  name : string;
  createdAt : string;
  siteId : string;
  allowStartTime : number,
  patrolMode : string,
  site : EntityOverallData<Site>;
  createdUserId : string;
  createdUserName: string;
  createdUserAvatar: string;
  assignedUsers: MiniUserResponse[];
  reminderTime : number;
  deleted : boolean;
}

interface RouteDetailResponse extends RouteResponse {
  routeCheckpoints : RouteCheckpointResponse[];
  routeSchedules : RouteScheduleResponse[];
}

interface RouteDeleteResult {
  checkpointsDeleteCount : number;
  schedulesDeleteCount : number;
  routeDeleteCount : number;
  routeName? : string;
}

enum RouteError {
  InvalidRouteId = "InvalidRouteId",
  DuplicatedName = "DuplicatedName",
  RequestedSchedulesTimeOverlapping = "RequestedSchedulesTimeOverlapping",
  ExistedSchedulesTimeOverlapping = "ExistedSchedulesTimeOverlapping",
  UserNotFound = "UserNotFound",
  CheckpointNotFound = "CheckpointNotFound",
  ScheduleNotFound = "ScheduleNotFound"
}

interface RouteCheckpointRequest {
  id : string;
  setOrder : number;
  layoutRow : number;
  layoutCol : number;
  cameraIds : string[];
}

type NewRouteCheckpointRequest = Omit<RouteCheckpointRequest, "id">;

interface RouteScheduleRequest {
  id : string;
  startOccurrenceDate : string | Date,
  endOccurrenceDate : string | Date,
  executingDays : DateOfWeek[],
  executingTime : ExecuteTime[],
}

type NewRouteScheduleRequest = Omit<RouteScheduleRequest, "id">;

export {
  RouteScheduleResponse,
  RouteCheckpointResponse,
  RouteResponse,
  RouteDetailResponse,
  RouteCheckpointRequest,
  RouteScheduleRequest,
  RouteError,
  NewRouteCheckpointRequest,
  NewRouteScheduleRequest,
  RouteDeleteResult
};
