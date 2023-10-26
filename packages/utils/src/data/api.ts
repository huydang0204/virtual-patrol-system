export enum API_ERROR_CODE {
  VALIDATION_BODY_ERROR = "VALIDATION_BODY_ERROR",
  VALIDATION_QUERY_PARAMS_ERROR = "VALIDATION_QUERY_PARAMS_ERROR",
  VALIDATION_PATH_PARAMS_ERROR = "VALIDATION_PATH_PARAMS_ERROR",
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

export interface ApiError extends Partial<Error> {
  rpCode? : API_ERROR_CODE,
  rpMessage? : string
}

export type ErrorType = {
  message : string,
  code : number
}

export const API_ERROR_TYPE : Record<API_ERROR_CODE, ErrorType>= {
  [API_ERROR_CODE.DATA_INVALID] : {
    message : "Invalid Data",
    code : 400
  },
  [API_ERROR_CODE.VALIDATION_BODY_ERROR] : {
    message : "Invalid Body",
    code : 400
  },
  [API_ERROR_CODE.VALIDATION_QUERY_PARAMS_ERROR] : {
    code : 400,
    message : "Invalid Query Params"
  },
  [API_ERROR_CODE.VALIDATION_PATH_PARAMS_ERROR] : {
    code : 400,
    message : "Invalid Path Params"
  },
  [API_ERROR_CODE.SERVER_ERROR] : {
    code : 500,
    message : "Server Error"
  },
  [API_ERROR_CODE.NOT_FOUND] : {
    code : 404,
    message : "Not Found"
  },
  [API_ERROR_CODE.URL_NOT_FOUND_URL] : {
    code : 404,
    message : "Url Not Found"
  },
  [API_ERROR_CODE.BAD_REQUEST] : {
    code : 400,
    message : "Bad Request"
  },
  [API_ERROR_CODE.EXISTED_ERROR] : {
    code : 409,
    message : "Resource existed"
  },
  [API_ERROR_CODE.UNAUTHORIZED] : {
    code : 403,
    message : "Unauthorized"
  },
  [API_ERROR_CODE.ACCESS_DENIED] : {
    code : 401,
    message : "Your current role not allow to access this resource"
  },
  [API_ERROR_CODE.BLOCKED] : {
    code : 400,
    message : "Account is blocked"
  }
};
