import _ from "lodash";

import {
  apiCreateRoute,
  apiAddCheckpoints,
  apiAddSchedules,
  apiGetPatrolRouteById,
  apiGetRoutes,
  apiDeletePatrolRoute,
  apiUpdateRoute,
  apiDeleteCheckpointsList,
  apiUpdateCheckpointsList,
  apiDeleteSchedulesList,
  apiUpdateSchedulesList,
  apiCountRoutes
} from "apis/route-api";
import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";
import {
  Checkpoints, Schedule
} from "model-type/component-types";
import { CalendarDateRange } from "model-type/component-style";
import { parseCalendarDateObjToISOTime } from "utils/time-format";
import { CheckpointsState } from "data/types";
import { 
  RouteCheckpointResponse, 
  RouteDetailResponse, 
  RouteResponse, 
  RouteScheduleResponse 
} from "@vps/utils/lib/dto";
import { 
  ExecuteTime, 
  FindAndCountResponse 
} from "@vps/utils/lib/data";

export enum RouteError {
  InvalidName = "InvalidName",
  InvalidSiteId = "InvalidSiteId",
  InvalidAssignedUserIds = "InvalidAssignedUserIds",
  InvalidStartAllowTime = "InvalidStartAllowTime",
  Unknown = "Unknown"
}

export enum AddCheckpointError {
  InvalidCameras = "InvalidCameras",
  Unknown = "Unknown"
}

export enum AddScheduleError {
  DuplicatedWithExistedSchedules = "DuplicatedWithExistedSchedules",
  Unknown = "Unknown"
}

export const fetchRoutes = async (limit: number, offset: number, searchText?: string, dateRange?: CalendarDateRange): Promise<FindAndCountResponse<RouteResponse>> => {
  const createdDateRange = {
    from : "",
    to : ""
  };
  if (!!dateRange && dateRange.from && dateRange.to) {
    const _fromDate = dateRange.from;
    const _toDate = dateRange.to;
    createdDateRange.from = parseCalendarDateObjToISOTime({
      day : _fromDate.day,
      month : _fromDate.month + 1,
      year : _fromDate.year
    });
    createdDateRange.to = parseCalendarDateObjToISOTime({
      day : _toDate.day,
      month : _toDate.month + 1,
      year : _toDate.year
    });
  }

  const {
    data, error
  } = await apiGetRoutes(limit, offset, searchText, createdDateRange);

  if (!error) return data;
};

export const countRoutes = async (searchText?: string, dateRange?: CalendarDateRange, exactSearch ?: boolean): Promise<number> => {
  let createdDateRange = null;
  if (!!dateRange && dateRange.from && dateRange.to) {
    const _fromDate = dateRange.from;
    const _toDate = dateRange.to;

    createdDateRange = {
      from : parseCalendarDateObjToISOTime({
        day : _fromDate.day,
        month : _fromDate.month + 1,
        year : _fromDate.year
      }),
      to : parseCalendarDateObjToISOTime({
        day : _toDate.day,
        month : _toDate.month + 1,
        year : _toDate.year
      })
    };
  }
  const {
    data, error
  } = await apiCountRoutes(searchText, createdDateRange, exactSearch);

  if (!error) return data.count;
};

export const fetchPatrolRouteById = async (routeId: string): Promise<RouteDetailResponse> => {
  const {
    data, error
  } = await apiGetPatrolRouteById(routeId);

  let result : RouteDetailResponse = null;
  if (!error) {
    result = {
      ...data,
      routeSchedules : data.routeSchedules.map((aSchedule : RouteScheduleResponse) => {
        const parsedExecutingTime = aSchedule.executingTime.map((aTime : ExecuteTime) => {
          const {
            startTime,
            endTime,
            repeatHours
          } = aTime;

          let end = endTime;
          if (endTime >= 60 * 60 * 24) {
            end -= 60 * 60 * 24; // add 1 day
          }
          return {
            startTime,
            endTime : end,
            repeatHours
          };
        });

        return {
          ...aSchedule,
          executingTime : parsedExecutingTime
        };
      })
    };
  }

  return result;
};

export const deletePatrolRoute = async (routeId: string): Promise<RouteResponse> => {
  const {
    data, error
  } = await apiDeletePatrolRoute(routeId);
  if (!error) return data;
};

export const createRoute = async (
  reminderTimeInSeconds: number,
  name: string,
  siteId: string,
  assignedUserIds: string[],
  startAllowTimeInSeconds: number,
  patrolViewMode: string
): Promise<ServiceResponse<RouteResponse, RouteError>> => {
  let errors = {} as Record<RouteError, boolean>;
  const invalidName = !name;
  const invalidSiteId = !siteId;
  const invalidAssignedUserIds = !assignedUserIds || assignedUserIds.length == 0;

  let result: RouteResponse = null;
  if (!invalidName && !invalidSiteId && !invalidAssignedUserIds) {
    const {
      data, error
    } = await apiCreateRoute(reminderTimeInSeconds, name, siteId, assignedUserIds, startAllowTimeInSeconds, patrolViewMode);

    if (!error) {
      result = data;
      errors = null;
    } else {
      errors[RouteError.Unknown] = true;
    }
  } else {
    errors[RouteError.InvalidName] = invalidName;
    errors[RouteError.InvalidSiteId] = invalidSiteId;
    errors[RouteError.InvalidAssignedUserIds] = invalidSiteId;
  }
  return {
    data : result,
    errors
  };
};

export const updateRoute = async (
  routeId: string,
  name: string,
  startAllowTimeInSeconds: number,
  siteId: string,
  assignedUserIds: string[],
  patrolViewMode: string,
  reminderTimeInSeconds: number
): Promise<ServiceResponse<RouteResponse, RouteError>> => {
  let errors = {} as Record<RouteError, boolean>;
  const invalidName = !name;
  const invalidSiteId = !siteId;
  const invalidAssignedUserIds = !assignedUserIds || assignedUserIds.length === 0;

  let result: RouteResponse = null;
  if (!invalidName && !invalidSiteId && !invalidAssignedUserIds) {
    const {
      data, error
    } = await apiUpdateRoute(routeId, name, siteId, assignedUserIds, startAllowTimeInSeconds, patrolViewMode, reminderTimeInSeconds);

    if (!error) {
      result = data;
      errors = null;
    } else {
      errors[RouteError.Unknown] = true;
    }
  } else {
    errors[RouteError.InvalidName] = invalidName;
    errors[RouteError.InvalidSiteId] = invalidSiteId;
    errors[RouteError.InvalidAssignedUserIds] = invalidAssignedUserIds;
  }

  return {
    data : result,
    errors
  };
};

export const addCheckpoints = async (
  routeId: string,
  checkpoints: CheckpointsState[]
): Promise<ServiceResponse<RouteCheckpointResponse[], AddCheckpointError>> => {
  const payload = checkpoints.map((checkpoint : CheckpointsState) => {
    const obj = {
      setOrder : checkpoint.setOrder,
      layoutRow : checkpoint.layoutRow,
      layoutCol : checkpoint.layoutCol,
      cameraIds : []
    };

    if (checkpoint && checkpoint.cameras && Array.isArray(checkpoint.cameras)) {
      obj.cameraIds = _.map(checkpoint.cameras, "id");
    }

    return obj;
  });

  let result: RouteCheckpointResponse[] = [];
  let errors = {} as Record<AddCheckpointError, boolean>;

  const {
    data, error
  } = await apiAddCheckpoints(routeId, { checkpoints : payload });

  if (!error) {
    result = data;
    errors = null;
  } else {
    errors[AddCheckpointError.Unknown] = true;
  }

  return {
    data : result,
    errors
  };
};

export const deleteCheckpointsList = async (ids: string[]): Promise<void> => {
  if (ids.length > 0) {
    await apiDeleteCheckpointsList(ids);
  }
};

export const updateCheckpointsList = async (
  routeId: string,
  checkpoints: Checkpoints[]
): Promise<RouteResponse> => {
  const payload = checkpoints.map((checkpoint : Checkpoints) => {
    const obj = {
      id : "",
      setOrder : 0,
      layoutRow : 0,
      layoutCol : 0,
      cameraIds : []
    };

    obj.id = checkpoint.id;
    obj.setOrder = checkpoint.order;
    obj.layoutRow = checkpoint.layoutRow;
    obj.layoutCol = checkpoint.layoutCol;
    obj.cameraIds = _.map(checkpoint.cameras, "id");

    return obj;
  });
  const {
    data, error
  } = await apiUpdateCheckpointsList(routeId, { checkpoints : payload });

  if (!error) return data;
};

export const addSchedules = async (
  routeId: string,
  schedules: Schedule[]
): Promise<ServiceResponse<RouteScheduleResponse[], AddScheduleError>> => {
  const payload = schedules.map((schedule : Schedule) => {
    const obj = {
      startOccurrenceDate : null,
      endOccurrenceDate : null,
      executingDays : [],
      executingTime : []
    };

    obj.startOccurrenceDate = parseCalendarDateObjToISOTime(schedule.startOccurrenceDate);

    if (schedule.isRecurForever) obj.endOccurrenceDate = null;
    else obj.endOccurrenceDate = parseCalendarDateObjToISOTime(schedule.endOccurrenceDate);

    obj.executingDays = schedule.executingDays;
    obj.executingTime = schedule.executingTime.map((aTime : ExecuteTime) => {
      const {
        startTime,
        endTime,
        repeatHours
      } = aTime;

      let end = endTime;
      if (endTime <= startTime) {
        end += 60 * 60 * 24; // add 1 day
      }

      if (!!repeatHours) return { ...(repeatHours ? { repeatHours } : {}) };
      return {
        startTime,
        endTime : end
      };
    });

    return obj;
  });

  let result: RouteScheduleResponse[] = null;
  let errors = {} as Record<AddScheduleError, boolean>;

  const {
    data, error
  } = await apiAddSchedules(routeId, { schedules : payload });

  if (!error) {
    result = data;
    errors = null;
  } else {
    switch (error) {
      case API_ERROR.EXISTED_ERROR:
        errors[AddScheduleError.DuplicatedWithExistedSchedules] = true;
        break;
      default :
        errors[AddScheduleError.Unknown] = true;
    }
  }

  return {
    data : result,
    errors
  };
};

export const deleteSchedulesList = async (ids: string[]): Promise<boolean> => {
  if (ids.length > 0) {
    await apiDeleteSchedulesList(ids);
    return true;
  }
};

export const updateSchedulesList = async (
  routeId: string,
  updatingSchedules: Schedule[]
): Promise<ServiceResponse<RouteScheduleResponse[], AddScheduleError>> => {
  const payload = updatingSchedules.map((schedule : Schedule) => {
    const obj = {
      id : schedule.id,
      startOccurrenceDate : null,
      endOccurrenceDate : null,
      executingDays : [],
      executingTime : []
    };

    obj.startOccurrenceDate = parseCalendarDateObjToISOTime(schedule.startOccurrenceDate);

    if (schedule.isRecurForever) obj.endOccurrenceDate = null;
    else obj.endOccurrenceDate = parseCalendarDateObjToISOTime(schedule.endOccurrenceDate);

    obj.executingDays = schedule.executingDays;
    obj.executingTime = schedule.executingTime.map((aTime : ExecuteTime) => {
      const {
        startTime,
        endTime,
        repeatHours
      } = aTime;

      let end = endTime;
      if (endTime <= startTime) {
        end += 60 * 60 * 24; // add 1 day
      }
      return {
        startTime,
        endTime : end,
        ...(repeatHours ? { repeatHours } : {})
      };
    });

    return obj;
  });

  let result : RouteScheduleResponse[] = null;
  let errors = {} as Record<AddScheduleError, boolean>;

  const {
    data, error
  } = await apiUpdateSchedulesList(routeId, { schedules : payload });

  if (!error) {
    result = data;
    errors = null;
  } else {
    switch (error) {
      case API_ERROR.EXISTED_ERROR:
        errors[AddScheduleError.DuplicatedWithExistedSchedules] = true;
        break;
      default :
        errors[AddScheduleError.Unknown] = true;
    }
  }

  return {
    data : result,
    errors
  };
};
