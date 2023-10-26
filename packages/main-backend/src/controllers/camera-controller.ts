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
  SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";

import {
  countCameras,
  deleteCameraById,
  getCamera,
  listCameras,
  updateCamera
} from "services/camera";
import {
  CameraError,
  CameraRequest
} from "@vps/utils/lib/dto/camera";
import {
  auth,
  validateRequestBody,
  validateRequestParam
} from "services/middleware";

export default class CameraController extends Controller {

  private readonly pathParamSchema : Schema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });

  private readonly cameraBodySchemaForUpdate : Schema = Joi.object({
    name : Joi.string().max(100)
      .optional(),
    address : Joi.string().max(100)
      .optional(),
    lat : Joi.string().max(100)
      .optional(),
    lng : Joi.string().max(100)
      .optional(),
    bearing : Joi.string().max(100)
      .optional(),
    region : Joi.string().max(100)
      .optional(),
    tags : Joi.array()
      .items(Joi.string().max(100))
      .optional()
      .allow(null),
    sopIds : Joi.array()
      .items(Joi.number())
      .optional()
      .allow(null),
    siteId : Joi.number().optional()

  });

  constructor() {
    super();

    this.initRoute();
  }

  private handleError(error : CameraError) : ApiError {
    let rpCode,
      rpMessage;
    switch (error) {
      case CameraError.NotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Camera not found!";
        break;
      case CameraError.BadRequest:
        rpCode = API_ERROR_CODE.BAD_REQUEST;
        break;
      case CameraError.SiteNotFound:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Site not found!";
        break;
      case CameraError.ServerError:
      case CameraError.CSVError:
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
        break;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiListCameras = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        searchText,
        siteId,
        limit,
        offset
      } = req.query;

      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;

      const data = await listCameras(
        searchText as string,
        siteId as string,
        reqLimit,
        reqOffset
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountCameras = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const data = await countCameras();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiUpdateCameras = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const cameraRq = req.body as CameraRequest;
      const {
        data,
        error
      } = await updateCamera(id, cameraRq);
      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiGetCamera = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const data = await getCamera(id as string);
      if (!data) {
        throw this.handleError(CameraError.NotFound);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteCameraById = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteCameraById(id as string);

      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get("/list", auth(), this.apiListCameras);
    this.router.get("/count", auth(), this.apiCountCameras);
    this.router.get("/:id", auth(), validateRequestParam(this.pathParamSchema), this.apiGetCamera);

    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), validateRequestBody(this.cameraBodySchemaForUpdate), this.apiUpdateCameras);
    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.pathParamSchema), this.apiDeleteCameraById);
  };
}
