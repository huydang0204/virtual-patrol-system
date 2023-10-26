import { vpsApi } from "apis/utils";
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import {
  CountResponse,
  FindAndCountResponse
} from "@vps/utils/lib/data";
import { SiteResponse } from "@vps/utils/lib/dto";

const SITE_API = "/site";

export const apiGetSites = async (
  searchText : string,
  limit : number,
  offset : number
) : Promise<ApiResult<FindAndCountResponse<SiteResponse>>> => {
  const params = {
    searchText,
    limit,
    offset
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API + "/list",
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

  let rp : FindAndCountResponse<SiteResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetSiteById = async (siteId : string) : Promise<ApiResult<SiteResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API + "/" + siteId,
    method : API_METHOD.GET,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : SiteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountSite = async (searchText : string) : Promise<ApiResult<CountResponse>> => {
  const params = { searchText };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API + "/count",
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

  let rp : CountResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCreateSite = async (name : string, description : string, cameraIds ?: string[]) : Promise<ApiResult<SiteResponse>> => {
  const body = {
    name,
    description,
    cameraIds
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API,
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

  let rp : SiteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateSite = async (
  id : string,
  name : string,
  description : string,
  cameraIds : string[]
) : Promise<ApiResult<SiteResponse>> => {
  const body = {
    name,
    description,
    cameraIds
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API + "/" + id,
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

  let rp : SiteResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteSite = async (id : string) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : SITE_API + "/" + id,
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
