import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import {
  FindManyOptions,
  FindOptionsRelations,
  In,
  Between
} from "typeorm";
import {
  CameraRepository,
  RouteCheckpointRepository,
  RouteTaskRepository,
  TaskDailyReportRepository,
  TaskMonthlyReportRepository,
  TaskReportRepository
} from "repositories";
import {
  Camera,
  Route,
  RouteSchedule,
  RouteTask,
  TaskDailyReport,
  TaskMonthlyReport,
  TaskReport,
  transaction,
  User
} from "entities";

import {
  CameraData,
  CountResponse,
  ExecuteTime,
  FindAndCountResponse,
  PartialEntity,
  ServiceResponse,
  TaskReportRowData,
  DateOfWeek,
  TaskStatus,
  TaskShift
} from "@vps/utils/lib/data";

import {
  AlertRequest,
  RouteTaskResponse,
  TaskDailyReportDetailResponse,
  TaskSummaryReportResponse,
  TaskError,
  TaskMonthlyReportDetailResponse
} from "@vps/utils/lib/dto/task";
import {
  getRouteTaskDto,
  getTaskDailyReportDto,
  getTaskMonthlyReportDto,
  getTaskSummaryReportDto
} from "services/task/mapper";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import {
  addSeconds,
  endOfToday,
  startOfToday
} from "date-fns";
import {
  getFromToOfDate,
  getFromToOfMonth,
  getTimeOfADayText
} from "utils/data";
import TaskProgressHandler from "services/task/task-progress-handler";
import { UserAuthorization } from "@vps/utils/lib/dto/user";

import {
  filterWithOffsetAndLimit,
  generatePostTasks
} from "./helper";

const listRouteTask = async (
  limit : number,
  offset : number,
  fromDate : string,
  toDate : string,
  filterStatuses : TaskStatus[],
  searchText : string,
  siteId : string,
  filterShift : TaskShift
) : Promise<FindAndCountResponse<RouteTaskResponse>> => {

  const [
    tasks,
    count
  ] = await RouteTaskRepository.findAndCountWithOptions(
    limit,
    offset,
    fromDate,
    toDate,
    filterStatuses,
    searchText,
    siteId,
    filterShift
  );

  let results : RouteTaskResponse[] = [];
  if (!!tasks) {
    results = tasks.map((aTask : RouteTask) => getRouteTaskDto(aTask, false));
  }

  return {
    data : results,
    count,
    limit,
    offset
  };
};
const listPostRouteTask = async (
  limit: number,
  offset: number,
  fromDate: string,
  toDate: string,
  searchText: string,
  siteId: string
): Promise<FindAndCountResponse<RouteTaskResponse>> => {

  let tasks = await generatePostTasks(fromDate, toDate, searchText, siteId);

  if (limit != undefined && offset != undefined) {
    tasks = filterWithOffsetAndLimit(tasks, offset, limit);
  }

  let results: RouteTaskResponse[] = [];
  if (!!tasks) {
    results = tasks.map((aTask: RouteTask) => getRouteTaskDto(aTask, false));
  }

  return {
    data : results,
    count : results.length,
    limit,
    offset
  };
};

const countRouteTask = async (
  fromDate : string,
  toDate : string,
  filterStatuses : TaskStatus[]
) : Promise<CountResponse> => {

  const count = await RouteTaskRepository.countWithOptions(
    fromDate,
    toDate,
    filterStatuses
  );

  return { count };
};

const getTaskDetail = async (id : string, includeReport : boolean) : Promise<RouteTaskResponse> => {
  if (!id) return null;

  const relationsOpt : FindOptionsRelations<RouteTask> = {
    route : {
      site : true,
      assignedUsers : true,
      routeCheckpoints : { cameras : true }
    }
  };
  if (!!includeReport) {
    relationsOpt["taskReport"] = true;
  }
  const task = await RouteTaskRepository.findOne({
    where : { id },
    relations : relationsOpt
  });

  return getRouteTaskDto(task, includeReport);
};

const listMonthlyReports = async (
  siteId : string,
  month : Date,
  offset : number,
  limit : number
) : Promise<FindAndCountResponse<TaskSummaryReportResponse>> => {
  const whereClauses : FindOptionsWhere<TaskMonthlyReport> = {};
  if (!!siteId) {
    whereClauses["siteId"] = siteId;
  }
  if (!!month) {
    const [
      from,
      to
    ] = getFromToOfMonth(month);
    whereClauses["createdAt"] = Between(from, to);
  }

  const options : FindManyOptions<TaskMonthlyReport> = {
    where : whereClauses,
    order : { createdAt : "DESC" },
    relations : { site : true }
  };

  if (limit != undefined && offset != undefined) {
    options["skip"] = offset;
    options["take"] = limit;
  }

  const reports = await TaskMonthlyReportRepository.findAndCount(options);

  let results : TaskSummaryReportResponse[] = [];
  if (!!reports && reports.length > 0) {
    results = reports[0].map(getTaskSummaryReportDto);
  }
  return {
    data : results,
    count : reports[1]
  };
};

const getMonthlyReport = async (id : string) : Promise<TaskMonthlyReportDetailResponse> => {
  const report = await TaskMonthlyReportRepository.findOne({
    where : { id },
    relations : { site : true }
  });
  return getTaskMonthlyReportDto(report);
};

const listDailyReports = async (
  siteId : string,
  date : Date,
  offset : number,
  limit : number
) : Promise<FindAndCountResponse<TaskSummaryReportResponse>> => {
  const whereClauses : FindOptionsWhere<TaskDailyReport> = {};
  if (!!siteId) {
    whereClauses["siteId"] = siteId;
  }
  if (!!date) {
    const [
      from,
      to
    ] = getFromToOfDate(date);
    whereClauses["createdAt"] = Between(from, to);
  }
  const options : FindManyOptions<TaskDailyReport> = {
    where : whereClauses,
    order : { createdAt : "DESC" },
    relations : { site : true }
  };
  if (limit != undefined && offset != undefined) {
    options["skip"] = offset;
    options["take"] = limit;
  }

  const reports = await TaskDailyReportRepository.findAndCount(options);

  let results : TaskSummaryReportResponse[] = [];
  if (!!reports && reports.length > 0) {
    results = reports[0].map(getTaskSummaryReportDto);
  }
  return {
    data : results,
    count : reports[1]
  };
};

const getDailyReport = async (id : string) : Promise<TaskDailyReportDetailResponse> => {
  const report = await TaskDailyReportRepository.findOne({
    where : { id },
    relations : { site : true }
  });
  return getTaskDailyReportDto(report);
};

const startTask = async (
  id : string,
  startComment : string,
  userId : string
) : Promise<ServiceResponse<RouteTaskResponse, TaskError>> => {
  const task = !id ? null : await RouteTaskRepository.findOne({
    where : { id },
    relations : { route : { assignedUsers : true } }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }

  if (invalidTaskAssignedUser(task, userId)) {
    return { error : TaskError.InvalidAssignedUser };
  }

  const nowSec = new Date().valueOf() / 1000;
  const startTaskTime = task.startTime - task.route.allowStartTime;
  if (nowSec < startTaskTime) {
    return { error : TaskError.InvalidTaskStartTime };
  }

  if (task.status !== TaskStatus.Pending && task.status !== TaskStatus.NotStarted) {
    return { error : TaskError.TaskStarted };
  }

  task.status = TaskStatus.OnGoing;
  task.startComment = startComment;
  await RouteTaskRepository.save(task);

  // init task report
  const newTaskReport : PartialEntity<TaskReport> = {
    id,
    reportDataRows : {}
  };
  await TaskReportRepository.save(newTaskReport);

  TaskProgressHandler.upsertOnGoingTask(id);

  return { data : getRouteTaskDto(task) };
};

const endTask = async (
  id : string,
  endStatus : TaskStatus,
  endComment : string
) : Promise<ServiceResponse<RouteTaskResponse, TaskError>> => {
  const task = !id ? null : await RouteTaskRepository.findOneBy({ id });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }

  const taskStatus = task.status;
  if (taskStatus === TaskStatus.Pending || taskStatus === TaskStatus.NotStarted) {
    return { error : TaskError.TaskNotStarted };
  }

  task.status = endStatus;
  task.endComment = endComment;
  await RouteTaskRepository.save(task);
  TaskProgressHandler.deleteOnGoingTask(id);
  return { data : getRouteTaskDto(task) };
};

const resumeTask = async (id : string, userId : string) : Promise<ServiceResponse<RouteTaskResponse, TaskError>> => {
  const task = !id ? null : await RouteTaskRepository.findOne({
    where : { id },
    relations : { route : { assignedUsers : true } }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }

  if (invalidTaskAssignedUser(task, userId)) {
    return { error : TaskError.InvalidAssignedUser };
  }

  const taskStatus = task.status;
  if (taskStatus !== TaskStatus.Paused) {
    return { error : TaskError.TaskNotStarted };
  }

  task.status = TaskStatus.OnGoing;
  await RouteTaskRepository.save(task);

  TaskProgressHandler.upsertOnGoingTask(id);

  return { data : getRouteTaskDto(task) };
};

const updateOnGoingTask = async (id : string) : Promise<boolean> => {
  if (!id) return false;
  TaskProgressHandler.upsertOnGoingTask(id);
  return true;
};

const pauseTask = async (id : string) : Promise<ServiceResponse<RouteTaskResponse, TaskError>> => {
  const task = !id ? null : await RouteTaskRepository.findOne({
    where : { id },
    relations : { route : { assignedUsers : true } }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }

  if (task.status === TaskStatus.OnGoing) {
    task.status = TaskStatus.Paused;
    await RouteTaskRepository.save(task);
    TaskProgressHandler.deleteOnGoingTask(id);
  }

  return { data : getRouteTaskDto(task) };
};

const raiseCheckpointAlert = async (
  id : string,
  reqAlert : AlertRequest,
  userLogged : UserAuthorization
) : Promise<ServiceResponse<TaskReport, TaskError>> => {
  const task = await RouteTaskRepository.findOne({
    where : { id : id },
    relations : { route : true }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }
  const taskReport = await TaskReportRepository.findOne({ where : { id } });

  if (!taskReport) {
    return { error : TaskError.InvalidTaskReportId };
  }

  const checkpoint = await RouteCheckpointRepository.findOneBy({ id : reqAlert.checkpointId });
  if (!checkpoint) {
    return { error : TaskError.InvalidCheckpointId };
  }
  const camera = await CameraRepository.findOneBy({ id : reqAlert.cameraId });
  if (!camera) {
    return { error : TaskError.InvalidCameraId };
  }
  const setOrder = checkpoint.setOrder;

  let prevReportDataRow : TaskReportRowData[] = taskReport.reportDataRows[setOrder];
  if (!prevReportDataRow) {
    prevReportDataRow = [];
  }

  prevReportDataRow.push({
    camera : {
      id : camera.id,
      name : camera.name,
      snapshotTimeInEpoch : reqAlert.snapshotTimeInEpoch
    },
    timeCompleted : new Date().toISOString(),
    completedUserId : userLogged.user.id,
    completedUserName : userLogged.user.name,
    faultDetected : true,
    alert : reqAlert.alert
  });

  taskReport.reportDataRows[setOrder] = prevReportDataRow;
  await TaskReportRepository.save(taskReport);

  // update alerted cameras
  const prevAlertedCameraIds : Record<string, string[]> = task.alertedCameraIds;
  let prevAlertedCameraIdOfCheckpoint = prevAlertedCameraIds[reqAlert.checkpointId];
  if (!prevAlertedCameraIdOfCheckpoint) {
    prevAlertedCameraIdOfCheckpoint = [];
  }
  prevAlertedCameraIdOfCheckpoint.push(reqAlert.cameraId);
  task.alertedCameraIds = {
    ...prevAlertedCameraIds,
    [reqAlert.checkpointId] : prevAlertedCameraIdOfCheckpoint
  };
  await RouteTaskRepository.save(task);

  return { data : taskReport };
};

const commentCheckpoint = async (
  id : string,
  checkpointId : string,
  cameraId : string,
  snapshotTimeInEpoch : number,
  comment : string,
  userLogged : UserAuthorization
) : Promise<ServiceResponse<TaskReport, TaskError>> => {
  const task = await RouteTaskRepository.findOne({
    where : { id : id },
    relations : { route : true }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }
  const taskReport = await TaskReportRepository.findOne({ where : { id } });

  if (!taskReport) {
    return { error : TaskError.InvalidTaskReportId };
  }

  const checkpoint = await RouteCheckpointRepository.findOneBy({ id : checkpointId });
  if (!checkpoint) {
    return { error : TaskError.InvalidCheckpointId };
  }

  const camera = await CameraRepository.findOneBy({ id : cameraId });
  if (!camera) {
    return { error : TaskError.InvalidCameraId };
  }
  const setOrder = checkpoint.setOrder;

  let prevReportDataRow : TaskReportRowData[] = taskReport.reportDataRows[setOrder];
  if (!prevReportDataRow) {
    prevReportDataRow = [];
  }

  prevReportDataRow.push({
    camera : {
      id : camera.id,
      name : camera.name,
      snapshotTimeInEpoch : snapshotTimeInEpoch
    },
    timeCompleted : new Date().toISOString(),
    completedUserId : userLogged.user.id,
    completedUserName : userLogged.user.name,
    faultDetected : false,
    comment
  });

  taskReport.reportDataRows[setOrder] = prevReportDataRow;
  await TaskReportRepository.save(taskReport);

  return { data : taskReport };
};

const acknowledgeCheckpointTask = async (
  id : string,
  checkpointId : string,
  cameras : CameraData[],
  userLogged : UserAuthorization
) : Promise<ServiceResponse<TaskReport, TaskError>> => {
  const task = await RouteTaskRepository.findOne({
    where : { id },
    relations : { route : true }
  });
  if (!task) {
    return { error : TaskError.InvalidTaskId };
  }
  const taskReport = await TaskReportRepository.findOne({ where : { id } });

  if (!taskReport) {
    return { error : TaskError.InvalidTaskReportId };
  }

  const checkpoint = await RouteCheckpointRepository.findOneBy({ id : checkpointId });
  if (!checkpoint) {
    return { error : TaskError.InvalidCheckpointId };
  }
  const setOrder = checkpoint.setOrder;

  const acknowledgeCameras : CameraData[] = [];
  const acknowledgeCameraIds = [];
  const alertedCameraIds = task.alertedCameraIds[checkpointId];
  if (!!alertedCameraIds) {
    cameras.forEach((aCamera : CameraData) => {
      if (alertedCameraIds.indexOf(aCamera.id) < 0) {
        acknowledgeCameraIds.push(aCamera.id);
        acknowledgeCameras.push(aCamera);
      }
    });
  } else {
    acknowledgeCameraIds.push(...cameras.map((aCamera : CameraData) => aCamera.id));
    acknowledgeCameras.push(...cameras);
  }

  if (acknowledgeCameraIds.length > 0) {
    const checkedCameras = await CameraRepository.findBy({ id : In(acknowledgeCameraIds) });
    if (acknowledgeCameraIds.length !== checkedCameras.length) {
      return { error : TaskError.InvalidCameraId };
    }

    const timeCompleted = new Date().toISOString();
    const {
      id : completedUserId,
      name : completedUserName
    } = userLogged.user;
    const dataRow : TaskReportRowData[] = checkedCameras.map((camera : Camera) => {
      const {
        id,
        name
      } = camera;
      return {
        camera : {
          id,
          name,
          snapshotTimeInEpoch : acknowledgeCameras.find((aCamera : CameraData) => aCamera.id === id).snapshotTimeInEpoch
        },
        timeCompleted,
        completedUserId,
        completedUserName,
        faultDetected : false
      };
    });

    let prevReportDataRow : TaskReportRowData[] = taskReport.reportDataRows[setOrder];
    if (!prevReportDataRow) {
      prevReportDataRow = [];
    }

    prevReportDataRow.push(...dataRow);
    taskReport.reportDataRows[setOrder] = prevReportDataRow;
    await TaskReportRepository.save(taskReport);
  }

  task.lastCheckpointId = checkpointId;
  await RouteTaskRepository.save(task);

  return { data : taskReport };
};

/*
 Generate tasks for today by using schedule's execution time and days.
 - First, check today is targeted day (eg. whether today is monday and whether monday is part of the schedule to be done )
 - Second, check whether schedule is repeatHours or startTime-endTime.
 - In case of repeatHours, multiple tasks might be necessary to be generated.
    (eg. if repeatHours is 2 hours, 12 tasks would be generate by this flow : 0->2, 2->4, 4->6, ..., 22->24)
 - In case of startTime-endTime, simply generate the task by evaluating start time and end time
 - Start time means seconds counted from 0. eg. If startTime is 3600, it's 1 am ( 12 am + 3600 sec). Same goes to end time

*/
const generateTasks = async (routeSchedules : RouteSchedule[], route : Route) : Promise<void> => {
  if (!routeSchedules || routeSchedules.length == 0) return;

  const occurrenceDate = startOfToday();
  const day : DateOfWeek = occurrenceDate.getDay();
  const tasks : Partial<RouteTask>[] = [];
  for (const schedule of routeSchedules) {
    const {
      id : scheduleId,
      executingDays,
      executingTime
    } = schedule;
    if (executingDays.includes(day)) {// add repeated executing time
      const parsedExecutingTime : ExecuteTime[] = [];
      executingTime.forEach((aTime: ExecuteTime) => {
        const { repeatHours } = aTime;

        if (!repeatHours) {
          parsedExecutingTime.push(aTime);
        } else {
          const startOfDay = startOfToday();
          const endOfDayMilli = endOfToday().valueOf();
          const repeatHourInSec = repeatHours * 3600;

          let i = 0;
          while (addSeconds(startOfDay, repeatHourInSec * i).valueOf() <= endOfDayMilli) {
            parsedExecutingTime.push({
              startTime : repeatHourInSec * i,
              endTime : repeatHourInSec * (i + 1)
            });
            i++;
          }
        }
      });

      // generate task from parsed executing time
      const newTasks : Partial<RouteTask>[] = parsedExecutingTime.map((aTime : ExecuteTime) => {
        return {
          name : `${ getTimeOfADayText(aTime.startTime) } ${ route.name || "Shift" }`,
          occurrenceDate,
          startTime : aTime.startTime,
          endTime : aTime.endTime,
          status : TaskStatus.Pending,
          scheduleId,
          routeId : route.id,
          route : route
        };
      });
      tasks.push(...newTasks);
    }
  }

  if (tasks.length > 0) {
    await transaction(async (em : EntityManager) => {
      const taskRepo = em.getRepository(RouteTask);
      for (const task of tasks) {
        await taskRepo.save(task);
      }
    });
  }
};

/*
 Delete today's tasks concerning input schedules
*/
const deleteTaskOnRouteSchedulesUpdate = async (scheduleIds : string[]) : Promise<void> => {
  await RouteTaskRepository.delete({
    scheduleId : In(scheduleIds),
    // status : In([TaskStatus.Pending,
    //   TaskStatus.NotStarted]),
    occurrenceDate : startOfToday()
  });
};

/*

 Change Task name based on 6 times of a day (midnight, morning,..., evening)
 Possible names: `Midnight myTask, Evening hisTask, Morning Shift and so on

*/
const updateTaskNameOnRouteNameUpdate = async (route : Route) : Promise<void> => {
  const updatingTasks = await RouteTaskRepository.findBy({ routeId : route.id });
  for (const task of updatingTasks) {
    task.name = `${ getTimeOfADayText(task.startTime) } ${ route.name || "Shift" }`;
    await RouteTaskRepository.save(task);
  }
};

const invalidTaskAssignedUser = (task : RouteTask, userId : string) : boolean => {
  return task?.route?.assignedUsers.findIndex((anUser : User) => userId === anUser.id) < 0;
};

export {
  listRouteTask,
  listPostRouteTask,
  countRouteTask,
  startTask,
  endTask,
  resumeTask,
  updateOnGoingTask,
  pauseTask,
  raiseCheckpointAlert,
  acknowledgeCheckpointTask,
  commentCheckpoint,
  generateTasks,
  getTaskDetail,
  listMonthlyReports,
  listDailyReports,
  getMonthlyReport,
  getDailyReport,
  deleteTaskOnRouteSchedulesUpdate,
  updateTaskNameOnRouteNameUpdate
};
