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
import { CameraResponse } from "@vps/utils/lib/dto";

const CAMERA_API = "/camera";

export const apiListCameras = async (
  siteId ?: string,
  searchText ?: string,
  limit ?: number,
  offset ?: number
) : Promise<ApiResult<FindAndCountResponse<CameraResponse>>> => {
  const params = {};
  if (limit != undefined && offset != undefined) {
    params["limit"] = limit;
    params["offset"] = offset;
  }
  if (!!siteId) {
    params["siteId"] = siteId;
  }
  if (!!searchText) {
    params["searchText"] = searchText;
  }

  const request : ApiRequest = {
    service : ApiService.vps,
    url : CAMERA_API + "/list",
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

  let rp : FindAndCountResponse<CameraResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountCameras = async () : Promise<ApiResult<CountResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : CAMERA_API + "/count",
    method : API_METHOD.GET,
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

type UpdateCameraRequest = {
  name ?: string;
  address ?: string;
  tags ?: string;
  sops ?: string;
  lat ?: string;
  lng ?: string;
  region ?: string;
  bearing ?: string;
  siteId ?: string;
  sopIds ?: number[];
}

export const apiUpdateCamera = async (id : string, name : string, siteId : string, sopIds : number[]) : Promise<ApiResult<CameraResponse>> => {
  const body : UpdateCameraRequest = {
    name,
    siteId,
    sopIds
  };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : CAMERA_API + "/" + id,
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

  let rp : CameraResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
