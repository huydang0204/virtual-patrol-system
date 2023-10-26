import Joi,
{ Schema } from "joi";
import {
  NextFunction,
  Request,
  Response
} from "express";
import Controller from "controllers/controller";

import {
  auth,
  validateRequestBody,
  validateRequestParam,
  validateRequestQuery
} from "services/middleware";
import {

  countRouteTask,
  endTask,
  listRouteTask,
  raiseCheckpointAlert,
  acknowledgeCheckpointTask,
  resumeTask,
  startTask,
  updateOnGoingTask,
  getTaskDetail,
  pauseTask,
  listMonthlyReports,
  listDailyReports,
  commentCheckpoint,
  getMonthlyReport,
  getDailyReport,
  listPostRouteTask
} from "services/task";
import {
  TaskError, AlertRequest
} from "@vps/utils/lib/dto/task";

import {
  API_ERROR_CODE,
  ApiError,
  ActivityType,
  TaskStatus,
  SYSTEM_ROLE_ID,
  TaskShift,
  CameraData
} from "@vps/utils/lib/data";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import { logActivity } from "services/activity";

export default class TaskController extends Controller {
  private readonly pathParamSchema : Schema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });
  private readonly startTaskBodySchema : Schema = Joi.object({
    startComment : Joi.string().max(300)
      .allow(null, "")
      .optional()
  });

  private readonly raiseAlertBodySchema : Schema = Joi.object({
    cameraId : Joi.string().uuid()
      .required(),
    checkpointId : Joi.string().uuid()
      .required(),

    snapshotTimeInEpoch : Joi.number()
      .required(),
    alert : Joi.object({
      type : Joi.string().required(),
      description : Joi.string().required(),
      actionsTaken : Joi.array().items(Joi.string().min(1))
        .min(1)
        .required()
    })
  });

  private readonly commentBodySchema : Schema = Joi.object({
    cameraId : Joi.string().uuid()
      .required(),
    checkpointId : Joi.string().uuid()
      .required(),
    snapshotTimeInEpoch : Joi.number()
      .required(),
    comment : Joi.string().required()
  });

  private readonly acknowledgeBodySchema : Schema = Joi.object({
    checkpointId : Joi.string().uuid()
      .required(),
    cameras : Joi.array().items(Joi.object({
      id : Joi.string().required(),
      snapshotTimeInEpoch : Joi.number().required()
    }))
      .min(1)
      .required()
  });

  private readonly endTaskBodySchema : Schema = Joi.object({
    endStatus : Joi.string().valid(TaskStatus.Completed, TaskStatus.Incomplete, TaskStatus.Missed),
    endComment : Joi.string().max(300)
      .allow(null, "")
      .optional()
  });

  private readonly getMonthlyReportSchema : Schema = Joi.object({
    siteId : Joi.number().allow(null, 0)
      .optional(),
    month : Joi.date().iso()
      .optional(),
    offset : Joi.number()
      .optional(),
    limit : Joi.number()
      .optional()
  });
  private readonly getDailyReportSchema : Schema = Joi.object({
    siteId : Joi.number().allow(null, 0)
      .optional(),
    offset : Joi.number()
      .optional(),
    limit : Joi.number()
      .optional(),
    date : Joi.date().iso()
      .optional()
  });

  private readonly commentSchema : Schema = Joi.object({
    cameraId : Joi.string().uuid()
      .required(),
    checkpointId : Joi.string().uuid()
      .required(),
    snapshotTimeInEpoch : Joi.number()
      .required(),
    comment : Joi.string().required()
  });

  constructor() {
    super();

    this.initRoute();
  }

  handleError(error : TaskError) : ApiError {
    let rpCode = API_ERROR_CODE.SERVER_ERROR,
      rpMessage;
    switch (error) {
      case TaskError.InvalidTaskId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Task not found!";
        break;
      case TaskError.InvalidTaskReportId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Task Report not found!";
        break;
      case TaskError.InvalidCameraId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Camera not found!";
        break;
      case TaskError.InvalidCheckpointId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Checkpoint not found!";
        break;
      case TaskError.TaskStarted:
        rpCode = API_ERROR_CODE.ACCESS_DENIED;
        rpMessage = "Task already started!";
        break;
      case TaskError.TaskNotStarted:
        rpCode = API_ERROR_CODE.ACCESS_DENIED;
        rpMessage = "Task have not started!";
        break;
      case TaskError.TaskEnded:
        rpCode = API_ERROR_CODE.ACCESS_DENIED;
        rpMessage = "Task already ended!";
        break;
      case TaskError.InvalidAssignedUser:
        rpCode = API_ERROR_CODE.ACCESS_DENIED;
        rpMessage = "You have no permission to handle this task due to assignment!";
        break;
      case TaskError.InvalidTaskStartTime:
        rpCode = API_ERROR_CODE.ACCESS_DENIED;
        rpMessage = "Not in time to start task!";
        break;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiListTasks = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        fromDate,
        toDate,
        filterStatuses,
        searchText,
        siteId,
        filterShift
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const reqFilterStatuses : TaskStatus[] = !!filterStatuses ? JSON.parse(filterStatuses as string) : undefined;
      const reqFilterShift : TaskShift = !!filterShift ? TaskShift[filterShift as string] : undefined;

      const data = await listRouteTask(
        reqLimit,
        reqOffset,
        fromDate as string,
        toDate as string,
        reqFilterStatuses,
        searchText as string,
        siteId as string,
        reqFilterShift
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListPostTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        limit,
        offset,
        fromDate,
        toDate,
        searchText,
        siteId

      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;

      const data = await listPostRouteTask(
        reqLimit,
        reqOffset,
        fromDate as string,
        toDate as string,
        searchText as string,
        siteId as string

      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        fromDate,
        toDate,
        filterStatuses
      } = req.query;

      const reqFilterStatuses : TaskStatus[] = !!filterStatuses ? JSON.parse(filterStatuses as string) : undefined;
      const data = await countRouteTask(
        fromDate as string,
        toDate as string,
        reqFilterStatuses
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const { includeReport } = req.query;

      const withReport = includeReport as string === "true";
      const data = await getTaskDetail(id as string, withReport);
      if (!data) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "Task not found!"
        };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiStartTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const { startComment } = req.body;
      const {
        data,
        error
      } = await startTask(id as string, startComment as string, userLogged.user.id);
      if (!data && !!error) {
        throw this.handleError(error);
      }

      logActivity(ActivityType.StartTask, userLogged.user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiEndTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        endStatus,
        endComment
      } = req.body;
      const {
        data,
        error
      } = await endTask(id as string, endStatus as TaskStatus, endComment as string);
      if (!data && !!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiResumeTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const {
        data,
        error
      } = await resumeTask(id as string, userLogged.user.id);
      if (!data && !!error) {
        throw this.handleError(error);
      }
      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiUpdateOnGoingTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const success = await updateOnGoingTask(id as string);
      res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  };

  apiPauseOnGoingTask = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const data = await pauseTask(id as string);
      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiRaiseAlert = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        cameraId,
        checkpointId,
        snapshotTimeInEpoch,
        alert
      } = req.body;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const {
        data,
        error
      } = await raiseCheckpointAlert(id as string, {
        cameraId,
        checkpointId,
        snapshotTimeInEpoch,
        alert
      } as AlertRequest, userLogged);

      if (!!error) {
        throw this.handleError(error);

      }

      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiComment = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        cameraId,
        checkpointId,
        snapshotTimeInEpoch,
        comment
      } = req.body;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const {
        data,
        error
      } = await commentCheckpoint(
        id as string,
        checkpointId as string,
        cameraId as string,
        snapshotTimeInEpoch as number,
        comment as string,
        userLogged
      );
      if (!!error) {
        throw this.handleError(error);
      }

      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiAcknowledge = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        cameras,
        checkpointId
      } = req.body;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const {
        data,
        error
      } = await acknowledgeCheckpointTask(id as string, checkpointId as string, cameras as CameraData[], userLogged);

      if (!!error) {
        throw this.handleError(error);

      }

      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiListMonthlyReports = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        siteId,
        month,
        limit,
        offset
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const reqDate = !!month ? new Date(month as string) : undefined;
      const data = await listMonthlyReports(siteId as string, reqDate, reqOffset, reqLimit);
      if (!data) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "Report not found"
        };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetMonthlyReport = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;

      const data = await getMonthlyReport(id as string);
      if (!data) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "Report not found"
        };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListDailyReports = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        siteId,
        date,
        limit,
        offset
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const reqDate = !!date ? new Date(date as string) : undefined;

      const data = await listDailyReports(siteId as string, reqDate, reqOffset, reqLimit);
      if (!data) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "Report not found"
        };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetDailyReport = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;

      const data = await getDailyReport(id as string);
      if (!data) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "Report not found"
        };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth(), this.apiListTasks);
    this.router.get("/post-day-list", auth(), this.apiListPostTasks);
    this.router.get("/count", auth(), this.apiCountTask);
    this.router.get("/monthly-report/list", auth(), validateRequestQuery(this.getMonthlyReportSchema), this.apiListMonthlyReports);
    this.router.get("/monthly-report/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetMonthlyReport);
    this.router.get("/daily-report/list", auth(), validateRequestQuery(this.getDailyReportSchema), this.apiListDailyReports);
    this.router.get("/daily-report/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetDailyReport);
    this.router.get("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetTask);

    this.router.put("/:id/start", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.startTaskBodySchema), this.apiStartTask);
    this.router.put("/:id/end", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.endTaskBodySchema), this.apiEndTask);
    this.router.put("/:id/resume", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), this.apiResumeTask);
    this.router.put("/:id/ongoing", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), this.apiUpdateOnGoingTask);
    this.router.put("/:id/pause", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), this.apiPauseOnGoingTask);

    this.router.post("/:id/raise-alert", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.raiseAlertBodySchema), this.apiRaiseAlert);
    this.router.post("/:id/acknowledge", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.acknowledgeBodySchema), this.apiAcknowledge);
    this.router.post("/:id/comment", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.commentBodySchema), this.apiComment);

  };
}
