import {
  Get,
  Query,
  Route,
  Security,
  Tags
} from "tsoa";
import { exampleNumber } from "types/common";
import {
  DashboardAnalyticsResponse,
  exampleAlertCountAnalytics,
  exampleTaskCountAnalytics
} from "types/dashboard-analytics";

@Route("dashboard-analytics")
@Tags("Dashboard Analytics")
export default class DashboardAnalyticsController {

    @Get()
    @Security("Authorization")
  public async getDashboardAnalytics(@Query() siteId?: string, @Query() date?: string): Promise<DashboardAnalyticsResponse> {
    return {
      id : "string",
      siteId : exampleNumber,
      taskCountAnalytics : exampleTaskCountAnalytics,
      alertCountAnalytics : exampleAlertCountAnalytics,
      weeklyAlertCountAnalytics : [1,
        2]
    };
  }

}