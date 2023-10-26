import { vpsApi } from "./utils";
import { 
  FindAndCountResponse,
  ActivityType 
} from "@vps/utils/lib/data";
import { UserActivityResponse } from "@vps/utils/lib/dto"; // TODO: Check This
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";

const ACTIVITY_API = "/activity";

export const apiGetUserActivities = async (
  types : string[],
  limit ? : number,
  offset ? : number,
  userId ? : string,
  filteredDateRange ? : { from : string, to : string }
) : Promise<ApiResult<FindAndCountResponse<UserActivityResponse>>> => {
  const params = {
    types : JSON.stringify(types),
    userId,
    limit,
    offset,
    ...(filteredDateRange.from && filteredDateRange.to && {
      from : filteredDateRange.from,
      to : filteredDateRange.to
    })
  };

  if (!userId) {
    delete params.userId;
  }

  const request : ApiRequest = {
    service : ApiService.vps,
    url : ACTIVITY_API + "/list",
    method : API_METHOD.GET,
    params,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : FindAndCountResponse<UserActivityResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiNewActivity = async (type : ActivityType, targetName ? : string) : Promise<ApiResult<UserActivityResponse>> => {
  const body = {
    type,
    targetName
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : ACTIVITY_API,
    method : API_METHOD.POST,
    data : body,
    authToken : true
  };

  const {
    success,
    data : responseData,
    errorCode
  } = await vpsApi(request);
  let result : UserActivityResponse = null;
  if (success) {
    result = responseData;
  }

  return {
    data : result,
    error : errorCode
  };
};
