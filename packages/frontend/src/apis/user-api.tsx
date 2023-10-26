import { vpsApi } from "apis/utils";
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import {
  CountResponse,
  FindAndCountResponse,
  SuccessResponse
} from "@vps/utils/lib/data/types";

//LoginResponse

import {
  LoginResponse, ForgetPasswordResponse
} from "@vps/utils/lib/dto";


import {
  CreateUserResponse,
  UserCreateRequest,
  UserResponse,
  UpdateUserRequest,
  SelfUpdateUserRequest
} from "@vps/utils/lib/dto/user"; //TODO: Check this

const LOGIN_API = "/user/login";
const LOGOUT_API = "/user/logout";
const USER_API = "/user";
const FORGOT_PASSWORD_API = "/user/forget-password";
const RESET_PASSWORD_API = "/user/reset-password";

export const apiLogin = async (
  email : string,
  password : string,
  nxWitnessLogin : boolean
) : Promise<ApiResult<LoginResponse>> => {
  const requestBody = {
    email,
    password,
    nxWitnessLogin
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : LOGIN_API,
    method : API_METHOD.POST,
    data : requestBody,
    authToken : false
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : LoginResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiLogout = async () : Promise<boolean> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : LOGOUT_API,
    method : API_METHOD.POST,
    authToken : true
  };

  const apiResponse = await vpsApi(request);

  return apiResponse.success;
};

export const apiFetchUsers = async (
  filterRoles : string[],
  searchText : string,
  limit : number,
  offset : number,
  withBlockedUsers : boolean
) : Promise<ApiResult<FindAndCountResponse<UserResponse>>> => {
  const params = {
    searchText,
    limit,
    offset,
    withBlockedUsers,
    filterRoles : ""
  };

  if (!filterRoles.includes("All")) params.filterRoles = JSON.stringify(filterRoles);

  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/list",
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

  let rp : FindAndCountResponse<UserResponse> = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCountUser = async (searchText : string) : Promise<ApiResult<CountResponse>> => {
  const params = { searchText };
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/count",
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

export const apiGetUserById = async (userId : string) : Promise<ApiResult<UserResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/" + userId,
    method : API_METHOD.GET,
    authToken : true
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : UserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiCreateUser = async (user: UserCreateRequest) : Promise<ApiResult<CreateUserResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API,
    method : API_METHOD.POST,
    data : user,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : CreateUserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateUser = async (userId: string, user: UpdateUserRequest) : Promise<ApiResult<UserResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/" + userId,
    method : API_METHOD.PUT,
    data : user,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : UserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiUpdateUserSelf = async (user: SelfUpdateUserRequest) : Promise<ApiResult<UserResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API,
    method : API_METHOD.PUT,
    data : user,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : UserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiDeleteUser = async (id : string) : Promise<ApiResult<boolean>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/" + id,
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

export const apiActivateUser = async (userId : string) : Promise<ApiResult<UserResponse>> => {
  const params = { id : userId };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/activate",
    method : API_METHOD.PUT,
    params,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : UserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiBlockUser = async (userId : string) : Promise<ApiResult<UserResponse>> => {
  const params = { id : userId };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/block",
    method : API_METHOD.PUT,
    params,
    authToken : true
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : UserResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiChangePassword = async (oldPassword : string, newPassword : string) : Promise<ApiResult<SuccessResponse>> => {
  const body = {
    oldPassword,
    newPassword
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : USER_API + "/change-password",
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

  let rp : SuccessResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiForgotPassword = async (email : string) : Promise<ApiResult<LoginResponse>> => {
  const requestBody = { email };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : FORGOT_PASSWORD_API,
    method : API_METHOD.POST,
    data : requestBody,
    authToken : false
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : LoginResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiGetForgotPasswordUserData = async (forgotPasswordId : string) : Promise<ApiResult<ForgetPasswordResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : FORGOT_PASSWORD_API + "/" + forgotPasswordId,
    method : API_METHOD.GET,
    authToken : false
  };

  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : ForgetPasswordResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};

export const apiResetPassword = async (newPassword : string, resetPasswordId : string, userId : string) : Promise<ApiResult<LoginResponse>> => {
  const requestBody = {
    newPassword,
    userId
  };

  const request : ApiRequest = {
    service : ApiService.vps,
    url : RESET_PASSWORD_API + "/" + resetPasswordId,
    method : API_METHOD.POST,
    data : requestBody,
    authToken : false
  };
  const apiResponse = await vpsApi(request);
  const {
    success,
    data : responseData,
    errorCode
  } = apiResponse;

  let rp : LoginResponse = null;
  if (success) {
    rp = responseData;
  }

  return {
    data : rp,
    error : errorCode
  };
};
