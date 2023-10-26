import {
  NextFunction,
  Request,
  Response
} from "express";
import Joi from "joi";

import Controller from "controllers/controller";

import {
  ActivityType, SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";

import { auth } from "services/middleware/auth";
import {
  listActivity,
  logActivity
} from "services/activity";
import {
  validateRequestBody,
  validateRequestQuery
} from "services/middleware";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import { joiStringToArrayValidation } from "utils/validation";

export default class ActivityController extends Controller {

  private readonly filterSchema = Joi.object({
    userId : Joi.string().uuid(),
    types : joiStringToArrayValidation(Object.values(ActivityType)),
    offset : Joi.number(),
    limit : Joi.number(),
    from : Joi.string().isoDate(),
    to : Joi.string().isoDate()
  });

  private readonly newActivitySchema = Joi.object({
    type : Joi.string().valid(...Object.values(ActivityType)),
    targetName : Joi.string().allow(null, "")
      .optional()
  });

  constructor() {
    super();
    this.initRoute();
  }

  apiListActivity = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        userId,
        types,
        from,
        to
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const reqFrom = !!from ? new Date(from as string) : undefined;
      const reqTo = !!to ? new Date(to as string) : undefined;
      const reqTypes : ActivityType[] = !!types ? JSON.parse(types as string) : undefined;

      const data = await listActivity(reqLimit, reqOffset, userId as string, reqTypes, reqFrom, reqTo);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiNewActivity = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      const {
        type,
        targetName
      } = req.body;

      const data = await logActivity(type, user, targetName);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth([SYSTEM_ROLE_ID.Admin]), validateRequestQuery(this.filterSchema), this.apiListActivity);
    this.router.post("/", auth(), validateRequestBody(this.newActivitySchema), this.apiNewActivity);
  };
}
