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
  SopType,
  SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";
import {
  validateRequestBody,
  validateRequestParam
} from "services/middleware";
import { auth } from "services/middleware/auth";
import {
  countSop,
  createSop,
  deleteSop,
  getSop,
  listSop,
  updateSop
} from "services/sop";
import { logActivity } from "services/activity";
import { UserAuthorization } from "@vps/utils/lib/dto/user";
import { SopError } from "@vps/utils/lib/dto/sop";

export default class SopController extends Controller {

  private readonly sopBodySchemaForCreation : Schema = Joi.object({
    name : Joi.string().max(100)
      .required(),
    type : Joi.string().valid(SopType.General, SopType.Special)
      .required(),
    checklists : Joi.array().min(1)
      .items(Joi.string().max(100))
      .required(),
    startDate : Joi.date().allow(null)
      .optional(),
    endDate : Joi.date().allow(null)
      .optional()
  });
  private readonly sopBodySchemaForUpdate : Schema = Joi.object({
    name : Joi.string().max(100)
      .required(),
    checklists : Joi.array().min(1)
      .items(Joi.string().max(100))
      .required(),
    startDate : Joi.date().allow(null)
      .optional(),
    endDate : Joi.date().allow(null)
      .optional()
  });
  private readonly pathParamSchema : Schema = Joi.object({ id : Joi.number().required() });

  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error : SopError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case SopError.SopNotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "SOP not found!";
        break;
      case SopError.DuplicateSop:
        rpCode = API_ERROR_CODE.EXISTED_ERROR;
        rpMessage = "SOP Duplicated.";
        break;
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiCountSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const data = await countSop();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        searchText,
        type
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const data = await listSop(reqLimit, reqOffset, searchText as string, type as SopType);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        name,
        type,
        checklists,
        startDate,
        endDate
      } = req.body;

      const {
        data,
        error
      } = await createSop(
        name as string,
        type as SopType,
        checklists as string[],
        startDate as string,
        endDate as string
      );
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.CreateSop, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await getSop(parseInt(id as string));
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        name,
        checklists,
        startDate,
        endDate
      } = req.body;

      const {
        data,
        error
      } = await updateSop(
        parseInt(id as string),
        name as string,
        checklists as string[],
        startDate as string,
        endDate as string
      );
      if (!!error) {
        throw this.handleError(error);
      }
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.UpdateSop, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteSop = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteSop(parseInt(id as string));
      if (!!error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.DeleteSop, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/count", auth(), this.apiCountSop);
    this.router.get("/list", auth(), this.apiListSop);
    this.router.get("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetSop);

    this.router.post("/", auth([SYSTEM_ROLE_ID.Admin]), validateRequestBody(this.sopBodySchemaForCreation), this.apiCreateSop);
    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.sopBodySchemaForUpdate), this.apiUpdateSop);
    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), this.apiDeleteSop);
  };
}
