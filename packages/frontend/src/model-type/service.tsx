import { AxiosRequestHeaders } from "axios";

export enum ApiService {
  vps = "vps",
  nxWitness = "nxWitness"
}

export enum API_ERROR {
  VALIDATION_BODY_ERROR = "VALIDATION_BODY_ERROR",
  VALIDATION_QUERY_PARAMS_ERROR = "VALIDATION_QUERY_PARAMS_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  URL_NOT_FOUND_URL = "URL_NOT_FOUND_URL",
  BAD_REQUEST = "BAD_REQUEST",
  EXISTED_ERROR = "EXISTED_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  ACCESS_DENIED = "ACCESS_DENIED",
  BLOCKED = "BLOCKED",
  DATA_INVALID = "DATA_INVALID"
}

export enum API_METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete"
}

export type ApiRequest = {
  service : ApiService,
  url : string,
  method : API_METHOD,
  params? : Record<string, unknown>,
  data? : Record<string, unknown> | FormData,
  extraHeaders? : AxiosRequestHeaders,
  authToken? : boolean,
  timeout? : number,
  download? : boolean
}

export type ApiResult<T> = {
  data : T,
  error : API_ERROR
}

export type ApiResponse = {
  success : boolean,
  data : undefined,
  errorCode : API_ERROR,
  errorMsg? : string
};

export type ServiceResponse<T, S extends string> = {
  data ?: T,
  errors ?: Record<S, boolean>
};

export type OptionData<T> = {
  name : string,
  value : T
};
