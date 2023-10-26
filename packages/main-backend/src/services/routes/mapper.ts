import {
  Route,
  RouteSchedule,
  RouteCheckpoint,
  Site
} from "entities";
import {
  RouteCheckpointResponse,
  RouteDetailResponse,
  RouteScheduleResponse
} from "@vps/utils/lib/dto/routes";
import { EntityOverallData } from "@vps/utils/lib/data";
import { getCameraDto } from "services/camera/mapper";

import { getMiniUserDto } from "services/user/mapper";

const getRouteDto = (route : Route) : RouteDetailResponse => {
  if (!route) return null;
  const {
    id,
    name,
    siteId,
    allowStartTime,
    patrolMode,
    site,
    createdAt,
    createdUserId,
    createdUser,
    routeSchedules,
    routeCheckpoints,
    assignedUsers,
    reminderTime,
    deleted
  } = route;

  return {
    id,
    name,
    siteId,
    allowStartTime,
    patrolMode,
    site : new EntityOverallData<Site>(site),
    createdAt : createdAt.toISOString(),
    createdUserId,
    createdUserName : createdUser?.name,
    createdUserAvatar : createdUser?.avatar,
    routeSchedules : routeSchedules ? routeSchedules.map(getRouteSchedulesDto) : undefined,
    routeCheckpoints : routeCheckpoints ? routeCheckpoints.map(getRouteCheckpointDto) : undefined,
    assignedUsers : assignedUsers ? assignedUsers.map(getMiniUserDto) : undefined,
    reminderTime,
    deleted
  };
};

const getRouteSchedulesDto = (schedule : RouteSchedule) : RouteScheduleResponse => {
  if (!schedule) return null;
  const {
    id,
    startOccurrenceDate,
    endOccurrenceDate,
    executingDays,
    executingTime
  } = schedule;

  return {
    id,
    startOccurrenceDate,
    endOccurrenceDate,
    executingDays,
    executingTime
  };
};

const getRouteCheckpointDto = (checkpoint : RouteCheckpoint) : RouteCheckpointResponse => {
  if (!checkpoint) return null;
  const {
    id,
    setOrder,
    layoutRow,
    layoutCol,
    cameras
  } = checkpoint;

  return {
    id,
    setOrder,
    layoutRow,
    layoutCol,
    cameras : cameras ? cameras.map(getCameraDto) : null
  };
};

export {
  getRouteCheckpointDto,
  getRouteDto,
  getRouteSchedulesDto
};
