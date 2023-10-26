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
  ActivityType, SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";

import {
  auth,
  validateRequestBody,
  validateRequestParam
} from "services/middleware";
import {
  countSites,
  createSite,
  deleteSite,
  listSites,
  updateSite,
  getSite
} from "services/site";
import { SiteError } from "@vps/utils/lib/dto/site";
import { logActivity } from "services/activity";

import { UserAuthorization } from "@vps/utils/lib/dto/user";

export default class SiteController extends Controller {
  private readonly bodySchema : Schema = Joi.object({
    name : Joi.string().max(100)
      .required(),
    description : Joi.string().max(100)
      .required(),
    cameraIds : Joi.array().items(Joi.string().guid())
      .min(0)
      .optional()
  });
  private readonly pathParamSchema : Schema = Joi.object({ id : Joi.number().required() });

  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error : SiteError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case SiteError.NotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Site not found!";
        break;
      case SiteError.InvalidId:
        rpCode = API_ERROR_CODE.BAD_REQUEST;
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

  apiListSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        limit,
        offset,
        searchText
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const data = await listSites(reqLimit, reqOffset, searchText as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { searchText } = req.query;
      const data = await countSites(searchText as string);
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const data = await getSite(id as string);
      if (!data) {
        this.handleError(SiteError.NotFound);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        name,
        description,
        cameraIds
      } = req.body;
      const data = await createSite(
        name as string,
        description as string,
        cameraIds as string[]
      );

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.CreateSite, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        cameraIds
      } = req.body;

      const {
        data,
        error
      } = await updateSite(
        id as string,
        name as string,
        description as string,
        cameraIds as string[]
      );
      if (!!error) {
        this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.UpdateSite, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteSite = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteSite(id as string);
      if (!!error) {
        this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      logActivity(ActivityType.DeleteSite, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth(), this.apiListSite);
    this.router.get("/count", auth(), this.apiCountSite);
    this.router.get("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetSite);

    this.router.post("/", auth([SYSTEM_ROLE_ID.Admin]), validateRequestBody(this.bodySchema), this.apiCreateSite);
    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.bodySchema), this.apiUpdateSite);
    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), this.apiDeleteSite);
  };
}
