import {
  addSeconds,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  endOfDay,
  startOfMonth,
  startOfToday,
  endOfToday
} from "date-fns";
import {
  Between,
  In,
  Not
} from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import {
  RouteScheduleRepository,
  RouteTaskRepository,
  TaskDailyReportRepository,
  UserRepository,
  TaskMonthlyReportRepository
} from "repositories";

import {
  RouteTask,
  TaskDailyReport,
  TaskMonthlyReport,
  User,
  transaction
} from "entities";

import {
  SYSTEM_ROLE_ID,
  RECEIVING_REPORT_EMAIL_ROLES,
  ExecuteTime,
  PartialEntity,
  TaskDailyReportData,
  DateOfWeek,
  NotificationRelatedDataType,
  NotificationType,
  TaskStatus,
  TaskStatusRecord,
  UserStatus
} from "@vps/utils/lib/data";

import { getTimeOfADayText } from "utils/data";
import {
  generateAndPublishNewNotification,
  getRouteTaskNotificationData,
  getSiteNotificationData

} from "services/notification";
import { SiteNotificationData } from "@vps/utils/lib/dto/app-notification";
import {
  send,
  Email
} from "services/mails";
import { validateEmail } from "utils/validation";
import { configuration } from "config";

const generateTask = async (occurrenceDate : Date) : Promise<void> => {
  const routeSchedules = await RouteScheduleRepository.getSchedulesOfDate(occurrenceDate);
  if (!!routeSchedules && routeSchedules.length > 0) {
    const day : DateOfWeek = occurrenceDate.getDay();
    const tasks : Partial<RouteTask>[] = [];

    // generate task by schedule
    // if today is execution day, add to tasks
    for (const schedule of routeSchedules) {
      const {
        id : scheduleId,
        executingDays,
        executingTime,
        routeId,
        route
      } = schedule;
      if (executingDays.includes(day)) {
        // add repeated executing time
        const parsedExecutingTime : ExecuteTime[] = [];
        executingTime.forEach((aTime : ExecuteTime) => {
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
            routeId,
            route
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
  }
};

const updateTaskStatus = async (executeTime : Date) : Promise<void> => {
  const tasks = await RouteTaskRepository.findBy({
    status : Not(In([
      TaskStatus.Completed,
      TaskStatus.Missed,
      TaskStatus.Incomplete
    ]))
  });
  if (!!tasks) {
    const taskIdStatusMap : Record<string, string[]> = {
      [TaskStatus.Missed] : [],
      [TaskStatus.NotStarted] : [],
      [TaskStatus.Incomplete] : []
    };
    for (const task of tasks) {
      const {
        id,
        status,
        startTime,
        endTime
      } = task;
      switch (status) {
        case TaskStatus.Pending: {
          if (isAfterTime(executeTime, startTime)) {
            if (isAfterTime(executeTime, endTime)) {
              taskIdStatusMap[TaskStatus.Missed].push(id);
            } else {
              taskIdStatusMap[TaskStatus.NotStarted].push(id);
            }
          }
          break;
        }
        case TaskStatus.NotStarted: {
          if (isAfterTime(executeTime, endTime)) {
            taskIdStatusMap[TaskStatus.Missed].push(id);
          }
          break;
        }
        case TaskStatus.Paused:
        case TaskStatus.OnGoing: {
          if (isAfterTime(executeTime, endTime)) {
            taskIdStatusMap[TaskStatus.Incomplete].push(id);
          }
          break;
        }
      }
    }

    const updateStatuses : string[] = Object.keys(taskIdStatusMap);
    for (const updateStatus of updateStatuses) {
      const updateIds = taskIdStatusMap[updateStatus];
      if (updateIds.length > 0) {
        const newStatus = TaskStatus[updateStatus];
        await RouteTaskRepository.update({ id : In(updateIds) }, { status : newStatus });
      }
    }
  }
};

const isAfterTime = (time : Date, noHourInSeconds : number) : boolean => {
  const comparedTime = addSeconds(startOfToday(), noHourInSeconds);
  return isAfter(time, comparedTime);
};

const generateTaskDailyReport = async (executedDate : Date) : Promise<void> => {
  // retrieve all tasks that are (in)completed/missed that occur from date to date
  const tasks = await RouteTaskRepository.find({
    where : {
      occurrenceDate : Between(startOfDay(executedDate), endOfDay(executedDate)),
      status : In([
        TaskStatus.Completed,
        TaskStatus.Incomplete,
        TaskStatus.Missed
      ])
    },
    relations : {
      route : {
        assignedUsers : true,
        site : true
      },
      taskReport : true
    },
    order : { occurrenceDate : "ASC" }
  });

  const siteTasksMap : Record<number, RouteTask[]> = {};
  const siteMap : Record<string, SiteNotificationData> = {};
  tasks.forEach((aTask : RouteTask) => {
    const siteId = aTask.route.siteId;
    let prevSiteTasks : RouteTask[] = siteTasksMap[siteId];
    if (!prevSiteTasks) {
      prevSiteTasks = [];
    }
    prevSiteTasks.push(aTask);
    siteTasksMap[siteId] = prevSiteTasks;
    if (!siteMap[siteId]) {
      siteMap[siteId] = getSiteNotificationData(aTask.route.site);
    }
  });

  const siteIds = Object.keys(siteTasksMap);
  for (const siteId of siteIds) {
    const siteTasks = siteTasksMap[siteId];

    const siteTaskReports : TaskDailyReportData[] = [];
    siteTasks.forEach((currentTask : RouteTask) => {
      const tempTaskDailyReportData : TaskDailyReportData = {
        id : currentTask.id,
        name : currentTask.name,
        status : currentTask.status,
        endComment : currentTask.endComment,
        reportDataRows : currentTask.taskReport?.reportDataRows || {}
      };
      siteTaskReports.push(tempTaskDailyReportData);
    });

    const report = await TaskDailyReportRepository.save({
      siteId,
      taskReportData : siteTaskReports,
      createdAt : executedDate
    } as PartialEntity<TaskDailyReport>);

    siteMap[siteId] = {
      ...siteMap[siteId],
      reportId : report.id
    };
  }

  generateNotificationAndEmailForNewReport("daily", siteMap, executedDate);
};

const generateTaskMonthlyReport = async (executedDate : Date) : Promise<void> => {
  const tasks = await RouteTaskRepository.find({
    where : { occurrenceDate : Between(startOfMonth(executedDate), endOfMonth(executedDate)) },
    relations : {
      route : {
        assignedUsers : true,
        site : true
      }
    },
    order : { occurrenceDate : "ASC" } // this order make records order from day 1 to day 30/31
  });

  if (!tasks || tasks.length == 0) return null;

  // init task map by site
  const siteTasksMap : Record<string, RouteTask[]> = {};
  const siteMap : Record<string, SiteNotificationData> = {};
  tasks.forEach((aTask : RouteTask) => {
    const siteId = aTask.route.siteId;
    let prevSiteTasks : RouteTask[] = siteTasksMap[siteId];
    if (!prevSiteTasks) {
      prevSiteTasks = [];
    }
    prevSiteTasks.push(aTask);
    siteTasksMap[siteId] = prevSiteTasks;
    if (!siteMap[siteId]) {
      siteMap[siteId] = getSiteNotificationData(aTask.route.site);
    }
  });

  const siteIds = Object.keys(siteTasksMap);
  for (const siteId of siteIds) {
    const siteTasks = siteTasksMap[siteId];
    const siteTaskNames : Set<string> = new Set(siteTasks.map((task : RouteTask) => task.name));

    const handledTaskStatusRecord : Record<string, TaskStatusRecord[]> = {};
    const handledTaskCount : Record<string, number> = {
      [TaskStatus.Completed] : 0,
      [TaskStatus.Incomplete] : 0,
      [TaskStatus.Missed] : 0
    };

    for (const taskName of siteTaskNames) {
      const filteredTasks = siteTasks.filter((task : RouteTask) => task.name == taskName);
      if (!filteredTasks || filteredTasks.length == 0) continue;

      const taskStatuses = new Array(31).fill(TaskStatusRecord.NotGenerated);
      for (const currentTask of filteredTasks) {
        const taskStatus = currentTask.status;

        const currentOccurrenceDate : number = currentTask.occurrenceDate.getDate() - 1; // -1 to align with array room index
        switch (taskStatus) {
          case TaskStatus.Completed:
          case TaskStatus.Incomplete:
          case TaskStatus.Missed:
            taskStatuses[currentOccurrenceDate] = TaskStatusRecord[taskStatus];
            handledTaskCount[taskStatus] += 1;
            break;
        }
      }
      handledTaskStatusRecord[taskName] = taskStatuses;
    }

    const report = await TaskMonthlyReportRepository.save({
      siteId,
      taskCounts : handledTaskCount,
      taskStatusRecords : handledTaskStatusRecord,
      createdAt : executedDate
    } as PartialEntity<TaskMonthlyReport>);
    siteMap[siteId] = {
      ...siteMap[siteId],
      reportId : report.id
    };
  }

  generateNotificationAndEmailForNewReport("monthly", siteMap, executedDate);
};

const generateInComingTaskNotification = async (executedTime : Date) : Promise<void> => {
  const adminUsers = await UserRepository.findBy({
    roleId : SYSTEM_ROLE_ID.Admin,
    status : Not(UserStatus.blocked)
  });
  const partialAdmins : Record<string, string> = {};
  adminUsers.forEach((anUser : User) => {
    partialAdmins[anUser.id] = anUser.email;
  });

  // retrieve all pending tasks that occur from date to date, and are not notified
  const tasks = await RouteTaskRepository.find({
    where : {
      occurrenceDate : Between(startOfDay(executedTime), endOfDay(executedTime)),
      status : TaskStatus.Pending,
      isNotified : false
    },
    relations : { route : { assignedUsers : true } }
  });

  const startToday = startOfToday();
  const executedMilli = executedTime.valueOf();
  const notifiedTaskIds : string[] = [];
  const userEmailMap : Record<string, string[]> = {};
  for (let index = 0; index < tasks.length; index++) {
    const currentTask = tasks[index];
    const {
      id : taskId,
      startTime,
      route
    } = currentTask;
    const remindingTimeInSec = startTime - (route.reminderTime);
    const remindingTimeDate = addSeconds(startToday, remindingTimeInSec);

    // compare with milliseconds
    if (executedMilli >= remindingTimeDate.valueOf()) {
      const description = `${ Math.trunc(route.reminderTime / 60) } minutes left to start`;
      const assignedUsers = route.assignedUsers.filter((anUser : User) => anUser.status !== UserStatus.blocked);

      const alertedPartialUsers : Record<string, string> = { ...partialAdmins };
      for (const user of assignedUsers) {
        if (!alertedPartialUsers[user.id]) {
          alertedPartialUsers[user.id] = user.email;
        }
      }

      const detailData = { [NotificationRelatedDataType.RouteTask] : getRouteTaskNotificationData(currentTask) } as Record<NotificationRelatedDataType, unknown>;
      for (const currentId in alertedPartialUsers) {
        const currentEmail = alertedPartialUsers[currentId];

        await generateAndPublishNewNotification(
          NotificationType.InComingTask,
          description,
          detailData,
          currentId
        );

        // send email
        if (validateEmail(currentEmail)) {
          let prevDescriptions = userEmailMap[currentEmail];
          if (!prevDescriptions) {
            prevDescriptions = [];
          }
          prevDescriptions.push(`${ currentTask.name }: ${ description }`);
          userEmailMap[currentEmail] = prevDescriptions;
        }
      }
      // push to update isNotified later, so as not to generate duplicated notification
      notifiedTaskIds.push(taskId);
    }
  }

  const emails : Email[] = [];
  for (const recipient in userEmailMap) {
    const currentDescriptions = userEmailMap[recipient];
    let tempTemplate = `<p>Hello ${ recipient },</p><br/>
    <p>This is automatically generated email from VPS service to notify you of incoming patrol tasks:</p>`;
    currentDescriptions.forEach((description : string) => {
      tempTemplate += ` - ${ description } <br/>`;
    });
    tempTemplate += "<br/><br/>Thanks, <br/> VPS Platform";

    emails.push({
      sendTo : recipient,
      subject : "VPS Incoming Patrol Task",
      template : tempTemplate
    });
  }
  emails.forEach((email : Email) => send(email));

  if (notifiedTaskIds.length > 0) {
    await RouteTaskRepository.update({ id : In(notifiedTaskIds) }, { isNotified : true });
  }
};

const generateNotificationAndEmailForNewReport = async (
  type : "daily" | "monthly",
  siteMap : Record<string, SiteNotificationData>,
  executedDate : Date
) : Promise<void> => {
  const notifiedSiteIds = Object.keys(siteMap);
  if (notifiedSiteIds.length == 0) return;

  const notifiedUsers = await UserRepository.findBy({
    roleId : In(RECEIVING_REPORT_EMAIL_ROLES),
    status : Not(UserStatus.blocked)
  });
  const generatedDate = format(executedDate, "dd/MM/yyyy");
  const description = `New ${ type } report has been created at ${ generatedDate }`;

  const emails : Email[] = [];
  for (const notifiedUser of notifiedUsers) {
    let tempTemplate = `<p>Hello ${ notifiedUser.name },<p/>
    <p>This is automatically generated email from VPS service to notify you of sites that just have newly generated ${ type } reports:<p/>`;
    for (const notifiedSiteId of notifiedSiteIds) {
      const notificationType = type === "daily" ? NotificationType.DailyReportReady : NotificationType.MonthlyReportReady;
      const reportId = siteMap[notifiedSiteId]?.reportId;

      await generateAndPublishNewNotification(
        notificationType,
        description,
        {
          [NotificationRelatedDataType.Site] : siteMap[notifiedSiteId],
          [NotificationRelatedDataType.Report] : {
            id : reportId,
            createdAt : generatedDate
          }
        } as Record<NotificationRelatedDataType, unknown>,
        notifiedUser.id
      );

      const link = `${ configuration.feUrl }/vps/app/reports/${ type }-report/${ reportId }`;
      tempTemplate += `- <a href="${ link }">${ siteMap[notifiedSiteId].name }</a><br/>`;
    }

    tempTemplate += "<br/><br/>Thanks, <br/> VPS Platform";
    emails.push({
      sendTo : notifiedUser.email,
      subject : `VPS New ${ type } reports`,
      template : tempTemplate
    });
  }
  emails.forEach((email : Email) => send(email));
};

export {
  generateTask,
  updateTaskStatus,
  generateTaskDailyReport,
  generateTaskMonthlyReport,
  generateInComingTaskNotification,
  generateNotificationAndEmailForNewReport
};
