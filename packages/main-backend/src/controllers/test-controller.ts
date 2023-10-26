import {
  NextFunction,
  Request,
  Response
} from "express";
import { configuration } from "config";
import Controller from "controllers/controller";

export default class TestController extends Controller {
  constructor() {
    super();
    this.initRoute();
  }

  apiGetVersion = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      res.status(200).send({ version : configuration.version });
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    this.router.get(
      "/version",
      this.apiGetVersion
    );
  };
}
