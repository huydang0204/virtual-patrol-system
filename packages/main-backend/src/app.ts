import express, {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded
} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "reflect-metadata";

import { configuration } from "config";
import { AppDataSource } from "entities";
import { logger } from "services/logger";

import mqttService from "services/mqtt";
import TaskProgressHandler from "services/task/task-progress-handler";
import {
  createDefaultAdminAccount,
  retrieveNxToken
} from "services/user";
import {
  initFakeCameras,
  syncCameras
} from "services/camera";

import {
  API_ERROR_CODE,
  API_ERROR_TYPE,
  ApiError
} from "@vps/utils/lib/data";

import UserController from "controllers/user-controller";
import TestController from "controllers/test-controller";
import CameraController from "controllers/camera-controller";
import RouteController from "controllers/route-controller";
import SiteController from "controllers/site-controller";
import TaskController from "controllers/task-controller";
import SopController from "controllers/sop-controller";
import NotificationController from "controllers/notification-controller";
import AlertTypeController from "controllers/alert-type-controller";
import FileController from "controllers/file-controller";
import DashboardAnalyticsController from "controllers/dashboard-analytics-controller";
import ActivityController from "controllers/activity-controller";
import { initFakeSite } from "services/site";

export class MainApplication {
  public app : Application;
  private port = configuration.port || 9000;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoute();
    this.addErrorHandler();
  }

  private initializeMiddlewares() : void {
    this.app.use(json());
    this.app.use(urlencoded({ extended : true }));
    this.app.use(morgan("combined"));
    this.app.use(helmet());
    this.app.use(cors());

    // set trust proxy if your service run behind proxy
    this.app.set("trust proxy", configuration.userTrustProxy?.toUpperCase() === "TRUE");
  }

  private initializeRoute() : void {
    // init route
    this.app.use("/apis/user", new UserController().getRouter());
    this.app.use("/apis/test", new TestController().getRouter());
    this.app.use("/apis/camera", new CameraController().getRouter());
    this.app.use("/apis/route", new RouteController().getRouter());
    this.app.use("/apis/site", new SiteController().getRouter());
    this.app.use("/apis/task", new TaskController().getRouter());
    this.app.use("/apis/sop", new SopController().getRouter());
    this.app.use("/apis/notification", new NotificationController().getRouter());
    this.app.use("/apis/alert-type", new AlertTypeController().getRouter());
    this.app.use("/apis/file", new FileController().getRouter());
    this.app.use("/apis/dashboard-analytics", new DashboardAnalyticsController().getRouter());
    this.app.use("/apis/activity", new ActivityController().getRouter());
  }

  private addErrorHandler() : void {
    this.app.use((err : ApiError, req : Request, res : Response, next : NextFunction) => {
      const errorCode = !!err.rpCode ? err.rpCode : API_ERROR_CODE.SERVER_ERROR;
      if (errorCode === API_ERROR_CODE.SERVER_ERROR) {
        console.log("SERVER ERROR", err);
      }
      const {
        code,
        message
      } = API_ERROR_TYPE[errorCode];
      const statusCode = code;
      let errorMessage = message;
      if (!!err.rpMessage) {
        errorMessage = err.rpMessage;
      }

      res.status(statusCode).send({
        data : null,
        error : {
          status : statusCode,
          name : errorCode,
          message : errorMessage,
          detail : {}
        }
      });
      next();
    });
  }

  private async initializeDatabase() : Promise<void> {
    try {
      await AppDataSource.initialize();
      await createDefaultAdminAccount();
    } catch (e) {
      logger.error("[MainApplication] Connect database failed:", {
        message : e.message,
        stack : e.stack
      });
    }
  }

  private async testModeInitDataJob() : Promise<void> {
    if (!configuration.testMode) return;

    logger.debug("NXWitness host: " + configuration.nxWitnessUrl);
    const nxToken = await retrieveNxToken();
    if (!!nxToken) {
      await syncCameras(nxToken);
    } else {
      await initFakeCameras();
    }
    await initFakeSite();
    logger.debug("Test Mode Init Data Finished");
  }

  public start() : void {
    this.app.listen(this.port, async () => {
      await this.initializeDatabase();
      if (!configuration.testMode) await mqttService.connect();

      if (TaskProgressHandler) {
        TaskProgressHandler.initOnGoingTaskMap();
      }
      await this.testModeInitDataJob();

      logger.info(`⚡️[MainApplication-${ configuration.env }]: VPS Main Backend is running at port: ${ this.port }.`);
    });
  }
}
