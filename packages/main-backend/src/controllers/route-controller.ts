import {
  NextFunction,
  Request,
  Response
} from "express";
import Joi,
{ Schema } from "joi";
import Controller from "controllers/controller";

import {
  API_ERROR_CODE,
  ApiError,
  ActivityType,
  PatrolMode,
  SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";

import {

  NewRouteCheckpointRequest,
  NewRouteScheduleRequest,
  RouteCheckpointRequest,
  RouteError,
  RouteScheduleRequest

} from "@vps/utils/lib/dto/routes";

import {
  countRoutes,
  createRoute,
  createRouteCheckpointList,
  createRouteScheduleList,
  deleteRouteById,
  deleteRouteCheckpointList,
  deleteRouteScheduleList,
  listRouteCheckpointsByRouteId,
  getRouteDetail,
  listRouteSchedulesByRouteId,
  listRoutes,

  updateRoute,
  updateRouteCheckpointList,
  updateRouteScheduleList,
  getCheckpointDetail
} from "services/routes";
import { auth } from "services/middleware/auth";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import {
  validateRequestBody,
  validateRequestParam
} from "services/middleware";

import { logActivity } from "services/activity";

export default class RouteController extends Controller {
  private readonly routeIdPathParamSchema : Schema = Joi.object({
    routeId : Joi.string().uuid()
      .required()
  });
  private readonly idPathParamSchema : Schema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });

  private readonly idArrayBodySchema : Schema = Joi.object({
    ids : Joi.array().min(1)
      .items(Joi.string().uuid())
      .required()
  });

  private readonly routeBodySchema : Schema = Joi.object({
    name : Joi.string().max(100)
      .required(),
    siteId : Joi.number()
      .required(),
    patrolMode : Joi.string().valid(...Object.values(PatrolMode))
      .required(),
    allowStartTime : Joi.number()
      .required(),
    assignedUserIds : Joi.array().min(1)
      .items(Joi.string().uuid())
      .required(),
    reminderTime : Joi.number().allow(null, 0)
      .optional()
  });

  private readonly checkpointsBodySchemaForCreation : Schema = Joi.object({
    checkpoints : Joi.array().items(Joi.object({
      setOrder : Joi.number().integer()
        .required(),
      layoutRow : Joi.number().integer()
        .required(),
      layoutCol : Joi.number().integer()
        .required(),
      cameraIds : Joi.array().min(1)
        .items(Joi.string().uuid())
        .required()
    }))
  });
  private readonly checkpointsBodySchemaForUpdate : Schema = Joi.object({
    checkpoints : Joi.array().items(Joi.object({
      id : Joi.string().uuid()
        .required(),
      setOrder : Joi.number().integer()
        .required(),
      layoutRow : Joi.number().integer()
        .required(),
      layoutCol : Joi.number().integer()
        .required(),
      cameraIds : Joi.array().min(1)
        .items(Joi.string().uuid())
        .required()
    }))
  });

  private readonly schedulesBodySchemaForCreation : Schema = Joi.object({
    schedules : Joi.array().items(Joi.object({
      startOccurrenceDate : Joi.string().isoDate()
        .required(),
      endOccurrenceDate : Joi.string().isoDate()
        .allow(null)
        .optional(),
      executingDays : Joi.array().min(1)
        .items(Joi.number().integer())
        .required(),
      executingTime : Joi.array().min(1)
        .items(Joi.object({
          startTime : Joi.number().integer(),
          endTime : Joi.number().integer(),
          repeatHours : Joi.number().integer()
        }))
        .required()
    }))
  });

  private readonly schedulesBodySchemaForUpdate : Schema = Joi.object({
    schedules : Joi.array().items(Joi.object({
      id : Joi.string().uuid()
        .allow(null, "")
        .optional(),
      startOccurrenceDate : Joi.string().isoDate()
        .required(),
      endOccurrenceDate : Joi.string().isoDate()
        .allow(null)
        .optional(),
      executingDays : Joi.array().min(1)
        .items(Joi.number().integer())
        .required(),
      executingTime : Joi.array().min(1)
        .items(Joi.object({
          startTime : Joi.number().integer(),
          endTime : Joi.number().integer(),
          repeatHours : Joi.number().integer()
        }))
        .required()
    }))
  });

  constructor() {
    super();
    this.initRoute();
  }

  handleError(error : RouteError) : ApiError {
    let rpCode = API_ERROR_CODE.SERVER_ERROR,
      rpMessage;
    switch (error) {
      case RouteError.InvalidRouteId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Route not found!";
        break;
      case RouteError.DuplicatedName:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Name is duplicated!";
        break;
      case RouteError.ScheduleNotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Schedule not found!";
        break;
      case RouteError.CheckpointNotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Checkpoint not found!";
        break;
      case RouteError.UserNotFound:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Assigned Users are invalid!";
        break;
      case RouteError.RequestedSchedulesTimeOverlapping:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Route Schedules has executing time overlapping!";
        break;
      case RouteError.ExistedSchedulesTimeOverlapping:
        rpCode = API_ERROR_CODE.EXISTED_ERROR;
        rpMessage = "Route Schedules has executing time overlapping with existed route schedules!";
        break;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiListRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        createdDateFrom,
        createdDateTo,
        searchText,
        exactSearch
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const isExactSearch = exactSearch === "true";
      const data = await listRoutes(reqLimit, reqOffset, createdDateFrom as string, createdDateTo as string, searchText as string, isExactSearch);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        searchText,
        exactSearch,
        createdDateFrom,
        createdDateTo
      } = req.query;

      const isExactSearch = exactSearch === "true";
      const data = await countRoutes(createdDateFrom as string, createdDateTo as string, searchText as string, isExactSearch);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const data = await getRouteDetail(id as string);
      if (!data) {
        throw { rpCode : API_ERROR_CODE.NOT_FOUND };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        name,
        siteId,
        allowStartTime,
        patrolMode,
        assignedUserIds,
        reminderTime
      } = req.body;
      const userLogged: UserAuthorization = JSON.parse(req.headers.user as string);

      const {
        data,
        error
      } = await createRoute(name, siteId, parseInt(allowStartTime as string), patrolMode as PatrolMode, assignedUserIds, userLogged.user.id, reminderTime as number);
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.CreateRoute, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        name,
        siteId,
        allowStartTime,
        patrolMode,
        assignedUserIds,
        reminderTime
      } = req.body;
      const { id } = req.params;

      const {
        data,
        error
      } = await updateRoute(name, siteId, parseInt(allowStartTime as string), patrolMode as PatrolMode, assignedUserIds, id, reminderTime as number);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListCheckpoints = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const {
        data,
        error
      } = await listRouteCheckpointsByRouteId(routeId as string);

      if (!!error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetCheckpoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await getCheckpointDetail(id as string);
      if (!data) {
        throw { rpCode : API_ERROR_CODE.NOT_FOUND };
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateCheckpointList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const { checkpoints } = req.body;
      const {
        data,
        error
      } = await createRouteCheckpointList(routeId as string, checkpoints as NewRouteCheckpointRequest[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateCheckpointList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const { checkpoints } = req.body;
      const {
        data,
        error
      } = await updateRouteCheckpointList(routeId as string, checkpoints as RouteCheckpointRequest[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListSchedules = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const {
        data,
        error
      } = await listRouteSchedulesByRouteId(routeId as string);

      if (!!error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateScheduleList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const { schedules } = req.body;
      const {
        data,
        error
      } = await createRouteScheduleList(routeId as string, schedules as NewRouteScheduleRequest[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateScheduleList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { routeId } = req.params;
      const { schedules } = req.body;
      const {
        data,
        error
      } = await updateRouteScheduleList(routeId as string, schedules as RouteScheduleRequest[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteRoute = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteRouteById(id as string);
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.DeleteRoute, user, data.routeName);
      data["routeName"] && delete data["routeName"];

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteCheckpointList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { ids } = req.body;
      const {
        data,
        error
      } = await deleteRouteCheckpointList(ids as string[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);

    } catch (error) {
      next(error);
    }
  };

  apiDeleteScheduleList = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { ids } = req.body;
      const {
        data,
        error
      } = await deleteRouteScheduleList(ids as string[]);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);

    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), this.apiListRoute);
    this.router.get("/count", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), this.apiCountRoute);
    this.router.get("/:id", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.idPathParamSchema), this.apiGetRoute);

    this.router.post("/", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestBody(this.routeBodySchema), this.apiCreateRoute);
    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.idPathParamSchema), validateRequestBody(this.routeBodySchema), this.apiUpdateRoute);

    this.router.get("/:routeId/checkpoint/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), this.apiListCheckpoints);
    this.router.get("/checkpoint/:id", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.idPathParamSchema), this.apiGetCheckpoint);
    this.router.post("/:routeId/checkpoint/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), validateRequestBody(this.checkpointsBodySchemaForCreation), this.apiCreateCheckpointList);
    this.router.put("/:routeId/checkpoint/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), validateRequestBody(this.checkpointsBodySchemaForUpdate), this.apiUpdateCheckpointList);
    this.router.delete("/checkpoint/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestBody(this.idArrayBodySchema), this.apiDeleteCheckpointList);

    this.router.get("/:routeId/schedule/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), this.apiListSchedules);
    this.router.post("/:routeId/schedule/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), validateRequestBody(this.schedulesBodySchemaForCreation), this.apiCreateScheduleList);
    this.router.put("/:routeId/schedule/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.routeIdPathParamSchema), validateRequestBody(this.schedulesBodySchemaForUpdate), this.apiUpdateScheduleList);
    this.router.delete("/schedule/list", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestBody(this.idArrayBodySchema), this.apiDeleteScheduleList);

    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin,
      SYSTEM_ROLE_ID.Officer]), validateRequestParam(this.idPathParamSchema), this.apiDeleteRoute);

  };
}
