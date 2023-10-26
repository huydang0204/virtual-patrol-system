import axios, {
  AxiosInstance,
  AxiosRequestConfig
} from "axios";

import {
  EVENT_EMITTER_NAME,
  EventEmitter
} from "utils/event-emitter";
import {
  ApiRequest,
  ApiResponse,
  ApiService
} from "model-type/service";
import { API_ERROR_CODE } from "data/common-data";
import {
  retrieveAuthToken,
  retrieveNxToken
} from "model/user-account";

const rtvsInstance = axios.create({ baseURL : process.env.API_HOST });
const nxInstance = axios.create({
  baseURL : process.env.NX_WITNESS_HOST,
  withCredentials : true
});

const vpsApi = async (request : ApiRequest) : Promise<ApiResponse> => {
  const {
    service,
    url,
    method,
    params,
    data,
    extraHeaders,
    authToken,
    download,
    timeout
  } = request;

  // build header
  const headers = { ...extraHeaders };

  let instance : AxiosInstance = rtvsInstance;
  let secret = null;
  switch (service) {
    case ApiService.vps:
      instance = rtvsInstance;
      if (authToken) secret = retrieveAuthToken();
      break;
    case ApiService.nxWitness:
      instance = nxInstance;
      if (authToken) secret = retrieveNxToken();
      break;
  }

  let success = false,
    apiResponse = null,
    errorCode = null,
    errorMsg = null;
  if (authToken) {
    if (!!secret) {
      switch (service) {
        case ApiService.vps:
          headers["Authorization"] = "Bearer " + secret;
          break;
        case ApiService.nxWitness:
          params["auth"] = secret;
          break;
      }
    } else {
      errorCode = API_ERROR_CODE.UNAUTHORIZED;
    }
  }

  if (!errorCode) {
    try {
      const config : AxiosRequestConfig = {
        url,
        method,
        params,
        data,
        headers
      };
      if (!!timeout) {
        config["timeout"] = timeout;
      } else {
        config["timeout"] = 10000;
      }
      if (download) {
        config["responseType"] = "blob";
      }

      const { data : responseData } = await instance.request(config);

      success = true;
      apiResponse = responseData;
    } catch (e) {
      success = false;

      const errorResponse = e.response?.data;
      if (errorResponse) {
        const errorData = errorResponse.error;
        if (errorData) {
          errorCode = errorData.name;
          errorMsg = errorData.message;
        }
      }

      if (!errorCode) {
        errorCode = API_ERROR_CODE.SERVER_ERROR;
        errorMsg = "Please try again later.";
      }
    }
  }

  if (!success) {
    switch (errorCode) {
      case API_ERROR_CODE.UNAUTHORIZED:
        EventEmitter.emit(EVENT_EMITTER_NAME.EVENT_UNAUTHORIZED_USER);
        break;
    }
  }

  return {
    success,
    data : apiResponse,
    errorCode,
    errorMsg
  };
};

export { vpsApi };
