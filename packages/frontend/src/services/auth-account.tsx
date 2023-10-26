import moment from "moment-timezone";

import {
  apiForgotPassword,
  apiGetForgotPasswordUserData,
  apiLogin,
  apiLogout,
  apiResetPassword
} from "apis/user-api";
import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";
import {
  authAccount,
  invalidateAccount
} from "model/user-account";
import { LoginType } from "data/user";
import {
  LoginUserResponse, ForgetPasswordResponse
} from "@vps/utils/lib/dto";
import { validatePassword } from "utils/validation";

export enum LoginError {
  INVALID_USERNAME = "INVALID_USERNAME",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  ACCOUNT_BLOCKED = "ACCOUNT_BLOCKED",
  LOGIN_FAILED = "LOGIN_FAILED"
}

export enum ForgotPasswordError {
  NOT_FOUND = "NOT_FOUND",
  INVALID_USERNAME = "INVALID_USERNAME",
  ACCOUNT_BLOCKED = "ACCOUNT_BLOCKED",
}

export enum ResetPasswordError {
  INVALID_PASSWORD = "INVALID_PASSWORD"
}

export const login = async (
  username : string,
  pwd : string,
  loginType : LoginType
) : Promise<ServiceResponse<LoginUserResponse, LoginError>> => {
  let errors = {} as Record<LoginError, boolean>;
  let usernameFailure = false,
    passwordFailure = false;
  if (!username) {
    usernameFailure = true;
  }
  if (!pwd) {
    passwordFailure = true;
  }

  let result : LoginUserResponse = null;
  if (!usernameFailure && !passwordFailure) {
    const {
      data,
      error
    } = await apiLogin(username, pwd, loginType === LoginType.NxLogin);
    if (!error) {
      errors = null;
      const {
        jwt : token,
        user
      } = data;

      authAccount(user.id, user.name, user.role, token, moment(user.tokenExpiredAt), user.nxToken, user.avatar, user.latestLogin);
      result = user;
    } else {
      switch (error) {
        case API_ERROR.BLOCKED:
          errors[LoginError.ACCOUNT_BLOCKED] = true;
          break;
        default:
          errors[LoginError.LOGIN_FAILED] = true;
      }
    }
  } else {
    errors[LoginError.INVALID_USERNAME] = usernameFailure;
    errors[LoginError.INVALID_PASSWORD] = passwordFailure;
  }

  return {
    data : result,
    errors
  };
};

export const logout = async () : Promise<boolean> => {
  const isSuccess = await apiLogout();
  if (isSuccess) {
    invalidateAccount();
  }
  return isSuccess;
};

export const forgotPassword = async (username : string) : Promise<ServiceResponse<boolean, ForgotPasswordError>> => {
  let errors = {} as Record<ForgotPasswordError, boolean>;
  let usernameFailure = false;
  if (!username) {
    usernameFailure = true;
  }

  let success = false;
  if (!usernameFailure) {
    const { error } = await apiForgotPassword(username);
    if (!error) {
      errors = null;
      success = true;
    } else {
      switch (error) {
        case API_ERROR.BLOCKED:
          errors[ForgotPasswordError.ACCOUNT_BLOCKED] = true;
          break;
        case API_ERROR.NOT_FOUND:
          errors[ForgotPasswordError.NOT_FOUND] = true;
          break;
        default:
          errors[ForgotPasswordError.INVALID_USERNAME] = true;
      }
    }
  } else {
    errors[ForgotPasswordError.INVALID_USERNAME] = usernameFailure;
  }

  return {
    data : success,
    errors
  };
};

export const getForgotPasswordUserData = async (forgotPasswordId : string) : Promise<ForgetPasswordResponse> => {
  const {
    data,
    error
  } = await apiGetForgotPasswordUserData(forgotPasswordId);

  if (!error && data) return data;
};

export const resetPassword = async (
  password : string,
  resetPasswordId : string,
  userId : string
) : Promise<ServiceResponse<boolean, ForgotPasswordError>> => {
  let errors = {} as Record<ForgotPasswordError, boolean>;
  let passwordFailure = false;
  const invalidPassword = !validatePassword(password);

  if (!password || invalidPassword) {
    passwordFailure = true;
  }

  let success = false;
  if (!passwordFailure) {
    const { error } = await apiResetPassword(password, resetPasswordId, userId);
    if (!error) {
      errors = null;
      success = true;
    } else {
      errors[ResetPasswordError.INVALID_PASSWORD] = true;
    }
  } else {
    errors[ResetPasswordError.INVALID_PASSWORD] = passwordFailure;
  }

  return {
    data : success,
    errors
  };
};