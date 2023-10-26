import {
  NextFunction,
  Request,
  Response
} from "express";

import Controller from "controllers/controller";

import {
  auth,
  validateRequestParam
} from "services/middleware";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import { NotificationError } from "@vps/utils/lib/dto/app-notification";
import {
  countNotification,
  deleteAllNotifications,
  deleteNotificationById,
  listNotifications,
  readNotification,
  readNotificationById
} from "services/app-notification";
import Joi,
{ Schema } from "joi";
import {
  API_ERROR_CODE,
  ApiError
} from "@vps/utils/lib/data";

export default class NotificationController extends Controller {

  private readonly pathParamSchema : Schema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });

  private handleError(error : NotificationError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case NotificationError.InvalidId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Invalid ID!";
        break;
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  constructor() {
    super();
    this.initRoute();
  }

  apiListNotification = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {

      const {
        limit,
        offset
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;

      const userLogged: UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;

      const data = await listNotifications(userId as string, reqLimit, reqOffset);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const userLogged: UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;

      const data = await countNotification(userId as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiReadNotification = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;
      const success = await readNotification(userId as string);
      res.status(200).send({ data : success });
    } catch (error) {
      next(error);
    }
  };

  apiReadNotificationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const userLogged: UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;
      const {
        data, error
      } = await readNotificationById(id, userId as string);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteNotificationById = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;
      const {
        data,
        error
      } = await deleteNotificationById(id as string, userId as string);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteNotifications = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const userLogged : UserAuthorization = JSON.parse(req.headers.user as string);
      const userId = userLogged.user.id;
      const data = await deleteAllNotifications(userId as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth(), this.apiListNotification);
    this.router.get("/count", auth(), this.apiCountNotification);
    this.router.put("/read", auth(), this.apiReadNotification);
    this.router.delete("/list", auth(), this.apiDeleteNotifications);
    this.router.delete("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiDeleteNotificationById);
    this.router.put("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiReadNotificationById);
  };
}
