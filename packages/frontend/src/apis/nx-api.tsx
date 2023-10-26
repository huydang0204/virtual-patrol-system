import axios from "axios";
import { NxWitnessLoginInfo } from "@vps/utils/lib/dto/thirdparty/nxwitness";

import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import { vpsApi } from "./utils";
import { retrieveNxToken } from "model/user-account";

const loginNxWitnessAxiosClient = axios.create({
  baseURL : process.env.NX_WITNESS_HOST,
  headers : { "content-type" : "application/json" }
});

const NX_IMAGE_API = "/ec2/cameraThumbnail";
const LOGIN_API = "/rest/v1/login/sessions";

export const loginNxWitness = async () : Promise<NxWitnessLoginInfo> => {
  const user = {
    username : process.env.NX_WITNESS_USERNAME,
    password : process.env.NX_WITNESS_PASSWORD,
    setCookie : true
  };

  const result = await loginNxWitnessAxiosClient.post(LOGIN_API, user);
  return result.data;
};

export const apiGetCameraImage = async (
  cameraId : string,
  timeInEpoch : number | string
) : Promise<ApiResult<Blob>> => {
  const params = {
    cameraId,
    time : timeInEpoch,
    width : 640,
    height : 360,
    rotate : 0,
    method : "precise"
  };

  const request : ApiRequest = {
    service : ApiService.nxWitness,
    url : NX_IMAGE_API,
    method : API_METHOD.GET,
    params,
    authToken : true,
    download : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

// live video url
export const getCameraVideoStreamURL = (
  cameraId : string,
  durationInSeconds? : number,
  startTime? : number,
  resolution = "360p"
) : string =>
  `${ process.env.NX_WITNESS_HOST }/web/media/${ cameraId }.webm?${ !!startTime ? `pos=${ startTime }` : "" }&${ !!durationInSeconds ? `duration=${ durationInSeconds }` : "" }&resolution=${ resolution }&width=640&height=360&rotate=0&auth=${ retrieveNxToken() }`;

// live image url 1 [this (time=latest) can't be used in live vitrual image grid, as there is no update parameters and grid will not be triggered updates]
export const getLiveImageURL = (cameraId : string) : string =>
  `${ process.env.NX_WITNESS_HOST }${ NX_IMAGE_API }?cameraId=${ cameraId }&time=latest&method=precise&width=640&height=360&rotate=0&auth=${ retrieveNxToken() }`;

// live image url 2
export const getCameraImageSnapshot = (cameraId : string, timeInEpoch : number) : string =>
  `${ process.env.NX_WITNESS_HOST }${ NX_IMAGE_API }?&cameraId=${ cameraId }&time=${ timeInEpoch }&method=precise&width=640&height=360&rotate=0&auth=${ retrieveNxToken() }`;
