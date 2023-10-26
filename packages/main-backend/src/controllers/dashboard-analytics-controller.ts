import {
  NextFunction,
  Request,
  Response
} from "express";

import Controller from "controllers/controller";

import {
  API_ERROR_CODE,
  ApiError
} from "@vps/utils/lib/data";
import { auth } from "services/middleware/auth";
import {
  DashboardAnalyticsError,
  DashboardAnalyticsType
} from "@vps/utils/lib/dto/dashboard-analytics";
import { getDashboardAnalytics } from "services/dashboard-analytics";
import { format } from "date-fns";
import Joi from "joi";
import { validateRequestQuery } from "services/middleware";

export default class DashboardAnalyticsController extends Controller {

  private readonly filterSchema = Joi.object({
    date : Joi.string().optional(),
    siteId : Joi.number().optional(),
    type : Joi.string().valid(DashboardAnalyticsType.Weekly, DashboardAnalyticsType.Monthly)
      .required()

  });
  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error: DashboardAnalyticsError): ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case DashboardAnalyticsError.NotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Dashboard Analytics not found!";
        break;

      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiGetDashboardAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        siteId,
        date,
        type
      } = req.query;

      const reqSiteId = !!siteId ? siteId as string : undefined;
      let reqDate= "";
      if (!!date) {
        reqDate = type == "Monthly" ? format(new Date(date as string), "MMM-yyyy") : date as string;
      }

      const {
        data,
        error
      } = await getDashboardAnalytics(reqDate as string, reqSiteId as string, type as DashboardAnalyticsType);
      if (!!error) {
        throw this.handleError(error);
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = (): void => {
    this.router.get("/", auth(), validateRequestQuery(this.filterSchema), this.apiGetDashboardAnalytics);
  };
}
