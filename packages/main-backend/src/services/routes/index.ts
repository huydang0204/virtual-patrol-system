import {
  In,
  Not
} from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { randomUUID } from "crypto";

import {
  Camera,
  RouteCheckpoint,
  RouteSchedule,
  transaction
} from "entities";
import {
  CameraRepository,
  RouteCheckpointRepository,
  RouteRepository,
  RouteScheduleRepository,
  RouteTaskRepository,
  UserRepository
} from "repositories";

import {
  NewRouteCheckpointRequest,
  NewRouteScheduleRequest,
  RouteCheckpointRequest,
  RouteCheckpointResponse,
  RouteDeleteResult,
  RouteDetailResponse,
  RouteError,
  RouteResponse,
  RouteScheduleRequest,
  RouteScheduleResponse
} from "@vps/utils/lib/dto/routes";
import {
  getRouteCheckpointDto,
  getRouteDto,
  getRouteSchedulesDto
} from "services/routes/mapper";
import {
  CountResponse,
  DeleteResponse,
  FindAndCountResponse,
  PartialEntity,
  ServiceResponse,
  PatrolMode,
  TaskStatus
} from "@vps/utils/lib/data";
import {
  generateTasks,
  deleteTaskOnRouteSchedulesUpdate,
  updateTaskNameOnRouteNameUpdate
} from "services/task";

import {
  checkOverlappingSchedules,
  parseDataForRouteScheduleRequest,
  isRequestScheduleOverlappingTimeWithExistedSchedules
} from "./helper";

const listRoutes = async (
  limit : number,
  offset : number,
  createdDateFrom : string,
  createdDateTo : string,
  searchText : string,
  exactSearch : boolean
) : Promise<FindAndCountResponse<RouteResponse>> => {

  const [
    routes,
    count
  ] = await RouteRepository.findAndCountWithOptions(
    limit,
    offset,
    createdDateFrom,
    createdDateTo,
    searchText,
    exactSearch
  );

  let result : RouteResponse[] = [];
  if (!!routes) {
    result = routes.map(getRouteDto);
  }

  return {
    data : result,
    count,
    limit,
    offset
  };
};

const countRoutes = async (
  createdDateFrom : string,
  createdDateTo : string,
  searchText : string,
  exactSearch : boolean
) : Promise<CountResponse> => {

  const count = await RouteRepository.countWithOptions(
    createdDateFrom,
    createdDateTo,
    searchText,
    exactSearch
  );
  return { count };
};

const getRouteDetail = async (id : string) : Promise<RouteDetailResponse> => {
  if (!id) return null;

  const route = await RouteRepository.findOne({
    where : {
      id,
      deleted : false
    },
    relations : {
      routeCheckpoints : { cameras : { sops : true } },
      routeSchedules : true,
      site : true,
      assignedUsers : true,
      createdUser : true
    }
  });
  return getRouteDto(route);
};

const createRoute = async (
  name : string,
  siteId : string,
  allowStartTime : number,
  patrolMode : PatrolMode,
  assignedUserIds : string[],
  userId : string,
  reminderTime : number
) : Promise<ServiceResponse<RouteDetailResponse, RouteError>> => {
  const users = await UserRepository.findBy({ id : In(assignedUserIds) });
  if (!users) {
    return { error : RouteError.UserNotFound };
  }

  const duplicatedRoute = await RouteRepository.findBy({
    name,
    deleted : false
  });

  if (duplicatedRoute.length > 0) {
    return { error : RouteError.DuplicatedName };
  }

  const route = await RouteRepository.save({
    name,
    siteId,
    allowStartTime,
    patrolMode,
    createdUserId : userId,
    assignedUsers : users,
    reminderTime
  });
  return { data : getRouteDto(route) };
};

const updateRoute = async (
  name : string,
  siteId : string,
  allowStartTime : number,
  patrolMode : PatrolMode,
  assignedUserIds : string[],
  routeId : string,
  reminderTime : number
) : Promise<ServiceResponse<RouteDetailResponse, RouteError>> => {
  const users = await UserRepository.findBy({ id : In(assignedUserIds) });
  if (!users) {
    return { error : RouteError.UserNotFound };
  }
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }
  const diffName = name !== route.name;

  route.name = name;
  route.siteId = siteId;
  route.allowStartTime = allowStartTime;
  route.patrolMode = patrolMode;
  route.assignedUsers = users;
  route.reminderTime = reminderTime;

  const result = await route.save();

  if (diffName) {
    updateTaskNameOnRouteNameUpdate(result);
  }
  return { data : getRouteDto(result) };
};

const getCheckpointDetail = async (id : string) : Promise<RouteCheckpointResponse> => {
  if (!id) return null;

  const checkpoint = await RouteCheckpointRepository.findOne({
    where : { id },
    relations : { cameras : { sops : true } }
  });
  return getRouteCheckpointDto(checkpoint);
};

const createRouteCheckpointList = async (
  routeId : string,
  checkpointsRq : NewRouteCheckpointRequest[]
) : Promise<ServiceResponse<RouteCheckpointResponse[], RouteError>> => {
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }

  const results : RouteCheckpointResponse[] = [];
  for (let i = 0; i < checkpointsRq.length; i++) {
    const {
      setOrder,
      layoutCol,
      layoutRow,
      cameraIds
    } = checkpointsRq[i];

    await transaction(async (em : EntityManager) => {
      const cameraRepository = em.getRepository(Camera);
      const cameras = await cameraRepository.findBy({ id : In(cameraIds) });

      const routeCheckpointRepository = em.getRepository(RouteCheckpoint);
      const checkpoint = new RouteCheckpoint();
      checkpoint.id = randomUUID();
      checkpoint.routeId = routeId;
      checkpoint.setOrder = setOrder;
      checkpoint.layoutCol = layoutCol;
      checkpoint.layoutRow = layoutRow;
      checkpoint.cameras = cameras;

      await routeCheckpointRepository.save(checkpoint);
      results.push(getRouteCheckpointDto(checkpoint));
    });
  }

  return { data : results };
};

const updateRouteCheckpointList = async (
  routeId : string,
  checkpointsRq : RouteCheckpointRequest[]
) : Promise<ServiceResponse<RouteCheckpointResponse[], RouteError>> => {
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }

  const results : RouteCheckpointResponse[] = [];
  for (let index = 0; index < checkpointsRq.length; ++index) {
    const cameras = await CameraRepository.findBy({ id : In(checkpointsRq[index].cameraIds) });
    const retrievedCheckpoint = await RouteCheckpointRepository.findOneBy({ id : checkpointsRq[index].id });

    retrievedCheckpoint.setOrder = checkpointsRq[index].setOrder;
    retrievedCheckpoint.layoutCol = checkpointsRq[index].layoutCol;
    retrievedCheckpoint.layoutRow = checkpointsRq[index].layoutRow;
    retrievedCheckpoint.cameras = cameras;
    await retrievedCheckpoint.save();
    results.push(getRouteCheckpointDto(retrievedCheckpoint));
  }

  return { data : results };
};

/*

Duplication Rule:
  - creating schedule in a same time/date will produce duplication err
  - startTime-endTime at overlapped period -> duplication err
  - startTime-endTime first & then repeatHour -> duplication err
  - repeatHour first & then startTime-endTime  -> duplication err

Schedule creation will make new related tasks at pending state instantly for today
- eg. Notably, if schedule is created with repeatHours 2, 12 tasks would be formed.

*/
const createRouteScheduleList = async (
  routeId : string,
  schedulesRq : NewRouteScheduleRequest[]
) : Promise<ServiceResponse<RouteScheduleResponse[], RouteError>> => {
  const route = await RouteRepository.findOne({
    where : { id : routeId },
    relations : { routeSchedules : true }
  });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }

  // 1. check time overlapping in request schedules
  if (checkOverlappingSchedules(schedulesRq)) {
    return { error : RouteError.RequestedSchedulesTimeOverlapping };
  }

  const routeSchedules : PartialEntity<RouteSchedule>[] = [];
  const siteSchedules = await RouteScheduleRepository.findBy({
    route : {
      siteId : route.siteId,
      patrolMode : PatrolMode.LiveVideoFeed
    }
  });
  for (const scheduleRq of schedulesRq) {
    const parsedScheduleRq = parseDataForRouteScheduleRequest<NewRouteScheduleRequest>(scheduleRq);
    if (isRequestScheduleOverlappingTimeWithExistedSchedules(parsedScheduleRq, route.routeSchedules, siteSchedules)) {
      return { error : RouteError.ExistedSchedulesTimeOverlapping };
    }
    routeSchedules.push({
      ...scheduleRq,
      routeId
    } as PartialEntity<RouteSchedule>);
  }

  const results = await RouteScheduleRepository.save(routeSchedules);
  await generateTasks(results, route);
  return { data : results.map(getRouteSchedulesDto) };
};

/*

Duplication Rule:
  - creating schedule in a same time/date will produce duplication err
  - startTime-endTime at overlapped period -> duplication err
  - startTime-endTime first & then repeatHour -> duplication err
  - repeatHour first & then startTime-endTime  -> duplication err

Schedule update will remove existing task and make new related tasks at pending state instantly.
- eg. Notably, if schedule is created with repeatHours 2, 12 tasks would be formed.

*/
const updateRouteScheduleList = async (
  routeId : string,
  schedulesRq : RouteScheduleRequest[]
) : Promise<ServiceResponse<RouteScheduleResponse[], RouteError>> => {
  const route = await RouteRepository.findOne({
    where : { id : routeId },
    relations : { routeSchedules : true }
  });

  // 1. check time overlapping in request schedules
  if (checkOverlappingSchedules(schedulesRq)) {
    return { error : RouteError.RequestedSchedulesTimeOverlapping };
  }

  const siteSchedules = await RouteScheduleRepository.findBy({
    id : Not(In(schedulesRq.map((aSchedule : RouteScheduleRequest) => aSchedule.id))),
    route : {
      siteId : route.siteId,
      patrolMode : PatrolMode.LiveVideoFeed
    }
  });
  const updatingScheduleIds : string[] = [];
  for (const scheduleRq of schedulesRq) {
    const parsedScheduleRq = parseDataForRouteScheduleRequest<RouteScheduleRequest>(scheduleRq);
    if (isRequestScheduleOverlappingTimeWithExistedSchedules(parsedScheduleRq, route.routeSchedules, siteSchedules)) {
      return { error : RouteError.ExistedSchedulesTimeOverlapping };
    }
    updatingScheduleIds.push(scheduleRq.id);
  }

  const schedules = await RouteScheduleRepository.findBy({ id : In(updatingScheduleIds) });
  const reloadSchedules : RouteSchedule[] = [];
  for (let i = 0; i < schedulesRq.length; i++) {
    const currentSchedule = schedules.find((s : RouteSchedule) => s.id == schedulesRq[i].id);
    if (!currentSchedule) continue;
    currentSchedule.startOccurrenceDate = schedulesRq[i].startOccurrenceDate as Date;
    currentSchedule.endOccurrenceDate = schedulesRq[i].endOccurrenceDate as Date;
    currentSchedule.executingDays = schedulesRq[i].executingDays;
    currentSchedule.executingTime = schedulesRq[i].executingTime;
    await RouteScheduleRepository.save(currentSchedule);

    reloadSchedules.push(currentSchedule);
  }

  if (reloadSchedules.length > 0) {
    await deleteTaskOnRouteSchedulesUpdate(reloadSchedules.map((s : RouteSchedule) => s.id));
    await generateTasks(reloadSchedules, route);
  }
  return { data : schedules.map(getRouteSchedulesDto) };
};

const listRouteCheckpointsByRouteId = async (routeId : string) : Promise<ServiceResponse<FindAndCountResponse<RouteCheckpoint>, RouteError>> => {
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }
  const result = await RouteCheckpointRepository.findAndCountBy({ routeId : routeId });

  return {
    data : {
      data : result[0],
      count : result[1]
    }
  };
};

const listRouteSchedulesByRouteId = async (routeId : string) : Promise<ServiceResponse<FindAndCountResponse<RouteSchedule>, RouteError>> => {
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }
  const result = await RouteScheduleRepository.findAndCountBy({ routeId : routeId });

  return {
    data : {
      data : result[0],
      count : result[1]
    }
  };
};

/*

Instead of deleting physically, we virtually delete the route by change these following things not to break foreign key dependency.

At Route Table:
- create new delete date at `deletedAt`
- change deleted field to true
- change route name to `x (deleted)`

At Schedule & Checkpoint Table:
- remove depending schedules & checkpoints

At Task Table
- Change all related tasks ( Pending, OnGoing, NotStart, Pause ) into Incomplete state

*/
const deleteRouteById = async (routeId : string) : Promise<ServiceResponse<RouteDeleteResult, RouteError>> => {
  const route = await RouteRepository.findOneBy({ id : routeId });
  if (!route || route.deleted) {
    return { error : RouteError.InvalidRouteId };
  }

  //TODO: Check later
  const checkpoints = await RouteCheckpointRepository.findBy({ routeId });
  for (let index = 0; index < checkpoints.length; index++) {
    checkpoints[index].cameras = null;
    await checkpoints[index].save();
  }

  const checkpointsDeleteResult = await RouteCheckpointRepository.delete({ routeId });
  const schedulesDeleteResult = await RouteScheduleRepository.delete({ routeId });
  route.deletedAt = new Date();
  route.deleted = true;
  route.name = route.name + " (deleted)";
  await RouteRepository.save(route);

  await RouteTaskRepository.delete({
    routeId,
    status : Not(In([
      TaskStatus.Completed,
      TaskStatus.Missed,
      TaskStatus.Incomplete
    ]))
  });
  return {
    data : {
      routeDeleteCount : 1,
      routeName : route.name,
      checkpointsDeleteCount : checkpointsDeleteResult.affected,
      schedulesDeleteCount : schedulesDeleteResult.affected
    }
  };
};

const deleteRouteCheckpointList = async (ids : string[]) : Promise<ServiceResponse<DeleteResponse, RouteError>> => {
  const deleteResult = await RouteCheckpointRepository.delete({ id : In(ids) });
  const result : DeleteResponse = { deletedCount : deleteResult.affected };
  return { data : result };
};

const deleteRouteScheduleList = async (ids : string[]) : Promise<ServiceResponse<DeleteResponse, RouteError>> => {
  await deleteTaskOnRouteSchedulesUpdate(ids);
  const deleteResult = await RouteScheduleRepository.delete({ id : In(ids) });
  const result : DeleteResponse = { deletedCount : deleteResult.affected };

  return { data : result };
};

const deleteRouteBySiteId = async (siteId : string) : Promise<void> => {
  const routes = await RouteRepository.findBy({ siteId });
  for (const route of routes) {
    const routeId = route.id;
    const checkpoints = await RouteCheckpointRepository.findBy({ routeId });

    for (let index = 0; index < checkpoints.length; index++) {
      checkpoints[index].cameras = null;
      await checkpoints[index].save();
    }

    await RouteCheckpointRepository.delete({ routeId });
    await RouteScheduleRepository.delete({ routeId });
    route.deletedAt = new Date();
    route.deleted = true;
    route.name = route.name + " (deleted)";
    await RouteRepository.save(route);

    await RouteTaskRepository.delete({
      routeId,
      status : Not(In([
        TaskStatus.Completed,
        TaskStatus.Missed,
        TaskStatus.Incomplete
      ]))
    });
  }
};

export {
  listRoutes,
  countRoutes,
  getRouteDetail,
  createRoute,
  updateRoute,
  getCheckpointDetail,
  createRouteCheckpointList,
  updateRouteCheckpointList,
  createRouteScheduleList,
  updateRouteScheduleList,
  deleteRouteById,
  listRouteCheckpointsByRouteId,
  listRouteSchedulesByRouteId,
  deleteRouteCheckpointList,
  deleteRouteScheduleList,
  deleteRouteBySiteId
};
