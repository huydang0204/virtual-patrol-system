import { vpsApi } from "apis/utils";
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import { SopResponse } from "@vps/utils/lib/dto";
import { SopType } from "@vps/utils/lib/data";

const SOP_API = "/sop";

export const apiGetSops = async (
  type : SopType,
  searchText : string,
  limit : number,
  offset : number
) : Promise<ApiResult<FindAndCountResponse<SopResponse>>> => {
  const params = {
    type,
    searchText,
    limit,
    offset
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SOP_API + "/list",
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

  let rp : FindAndCountResponse<SopResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountSop = async () : Promise<ApiResult<Record<SopType, number>>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SOP_API + "/count",
    method : API_METHOD.GET,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : Record<SopType, number> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCreateSop = async (
  type : SopType,
  name : string,
  checklists : string[],
  startDate : Date,
  endDate : Date
) : Promise<ApiResult<SopResponse>> => {
  const body = {
    type,
    name,
    checklists
  };
  if (!!startDate && !!endDate) {
    body["startDate"] = startDate;
    body["endDate"] = endDate;
  }
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SOP_API,
    method : API_METHOD.POST,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : SopResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateSop = async (
  id : number,
  name : string,
  checklists : string[],
  startDate : Date,
  endDate : Date
) : Promise<ApiResult<SopResponse>> => {
  const body = {
    name,
    checklists
  };
  if (!!startDate && !!endDate) {
    body["startDate"] = startDate;
    body["endDate"] = endDate;
  }
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SOP_API + "/" + id,
    method : API_METHOD.PUT,
    data : body,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : SopResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteSop = async (id : number) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SOP_API + "/" + id,
    method : API_METHOD.DELETE,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp = false;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
