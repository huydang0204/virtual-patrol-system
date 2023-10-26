import {
  API_METHOD, ApiRequest, ApiResult, ApiService
} from "model-type/service";
import { vpsApi } from "./utils";
import { DashboardAnalyticsResponse } from "@vps/utils/lib/dto/dashboard-analytics";

const DASHBOARD_API = "/dashboard-analytics";

export const apiGetDashboardData = async (
  monthYear : string,
  type : "Weekly" | "Monthly",
  siteId : number
): Promise<ApiResult<DashboardAnalyticsResponse>> => {
  const params = {
    date : monthYear,
    type,
    siteId
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : DASHBOARD_API,
    method : API_METHOD.GET,
    authToken : true,
    params
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp: DashboardAnalyticsResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
