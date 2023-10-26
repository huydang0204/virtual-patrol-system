import {
  NextFunction,
  Request,
  Response
} from "express";
import Joi,
{ Schema } from "joi";
import Controller from "controllers/controller";

import {
  auth,
  validateRequestBody,
  validateRequestParam
} from "services/middleware";
import {
  countAlertTypes,
  createAlertType,
  deleteAlertType,
  getAlertType,
  listAlertType,
  updateAlertType
} from "services/alert-type";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import { logActivity } from "services/activity";
import {
  SYSTEM_ROLE_ID,
  ActivityType,
  API_ERROR_CODE,
  ApiError
} from "@vps/utils/lib/data";
import { AlertTypeError } from "@vps/utils/lib/dto/alert-type";

export default class AlertTypeController extends Controller {

  private readonly alertTypeSchema : Schema = Joi.object({
    type : Joi.string()
      .required(),
    description : Joi.string()
      .required(),
    actionTaken : Joi.array().items(Joi.string())
      .required(),
    imageUrl : Joi.string().required()
  });

  private readonly pathParamSchema : Schema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });

  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error : AlertTypeError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case AlertTypeError.NotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Alert Type not found!";
        break;
      case AlertTypeError.DuplicatedType:
        rpCode = API_ERROR_CODE.EXISTED_ERROR;
        rpMessage = "Type is duplicated!";
        break;
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiListAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        searchText
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const data = await listAlertType(reqLimit, reqOffset, searchText as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { searchText } = req.query;
      const data = await countAlertTypes(searchText as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        type,
        description,
        actionTaken,
        imageUrl
      } = req.body;
      const {
        data,
        error
      } = await createAlertType(
        type as string,
        description as string,
        actionTaken as string[],
        imageUrl as string
      );
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.CreateAlertType, user, data.type);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        type,
        description,
        actionTaken,
        imageUrl
      } = req.body;
      const {
        data,
        error
      } = await updateAlertType(
        id as string,
        type as string,
        description as string,
        actionTaken as string[],
        imageUrl as string
      );
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.UpdateAlertType, user, data.type);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const data = await getAlertType(id as string);
      if (!data) {
        throw this.handleError(AlertTypeError.NotFound);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteAlertType = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteAlertType(id as string);
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.DeleteAlertType, user, data.type);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth(), this.apiListAlertType);
    this.router.get("/count", auth(), this.apiCountAlertType);
    this.router.get("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetAlertType);

    this.router.post("/", auth([SYSTEM_ROLE_ID.Admin]), validateRequestBody(this.alertTypeSchema), this.apiCreateAlertType);
    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.alertTypeSchema), this.apiUpdateAlertType);
    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), this.apiDeleteAlertType);
  };
}
