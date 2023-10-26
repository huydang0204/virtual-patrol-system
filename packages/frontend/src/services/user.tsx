import {
  apiActivateUser,
  apiBlockUser,
  apiChangePassword,
  apiCountUser,
  apiCreateUser,
  apiDeleteUser,
  apiFetchUsers,
  apiGetUserById,
  apiUpdateUser,
  apiUpdateUserSelf
} from "apis/user-api";
import {
  CreateUserRequest,
  UserResponse,
  UpdateUserRequest,
  SelfUpdateUserRequest
} from "@vps/utils/lib/dto/user";
import { FindAndCountResponse } from "@vps/utils/lib/data/types";
import {
  API_ERROR, ServiceResponse
} from "model-type/service";
import { validatePassword } from "../utils/validation";

export enum UserError {
  InvalidId = "InvalidId",
  InvalidName = "InvalidName",
  InvalidEmail = "InvalidEmail",
  DuplicatedEmail = "DuplicatedEmail"
}

export enum ChangePasswordError {
  InvalidOldPassword = "InvalidOldPassword",
  InvalidNewPassword = "InvalidNewPassword",
  NewPasswordNotMatch = "NewPasswordNotMatch",
  WrongOldPassword = "WrongOldPassword",
  Unknown = "Unknown"
}

export const fetchUsers = async (filterRoles ?: string[], searchText ?: string, limit ?: number, offset ?: number, withBlockedUsers ?: boolean) : Promise<FindAndCountResponse<UserResponse>> => {
  const {
    data,
    error
  } = await apiFetchUsers(filterRoles, searchText, limit, offset, withBlockedUsers);

  if (!error && data) return data;
};

export const countUsers = async (searchText ?: string) : Promise<number> => {
  const {
    data,
    error
  } = await apiCountUser(searchText);

  if (!error) return data.count;
};

export const fetchUserById = async (userId : string) : Promise<UserResponse> => {
  const {
    data,
    error
  } = await apiGetUserById(userId);

  if (!error && data) return data;
};

export const createUser = async (user : CreateUserRequest) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidName = !user.name;
  const invalidEmail = !user.email;

  let result = false;
  if (!invalidName && !invalidEmail) {
    const {
      data,
      error
    } = await apiCreateUser(user);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.EXISTED_ERROR:
          errors[UserError.DuplicatedEmail] = true;
          break;
      }
    }
  } else {
    errors[UserError.InvalidName] = invalidName;
    errors[UserError.InvalidEmail] = invalidEmail;
  }

  return {
    data : result,
    errors
  };
};

export const updateUser = async (
  userId : string,
  user: UpdateUserRequest
) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidId = !userId;
  const invalidName = !user?.name;
  // const invalidEmail = !validateEmail(user?.email);
  const invalidEmail = false;

  let result = false;
  if (!invalidId && !invalidEmail && !invalidName) {
    const {
      data,
      error
    } = await apiUpdateUser(userId, user);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[UserError.InvalidId] = invalidId;
    errors[UserError.InvalidName] = invalidName;
    errors[UserError.InvalidEmail] = invalidEmail;
  }

  return {
    data : result,
    errors
  };
};

export const updateUserSelf = async (user : SelfUpdateUserRequest) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidName = !user?.name;
  // const invalidEmail = !validateEmail(user?.email);
  const invalidEmail = false;

  let result = false;
  if (!invalidEmail && !invalidName) {
    const {
      data,
      error
    } = await apiUpdateUserSelf(user);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[UserError.InvalidName] = invalidName;
    errors[UserError.InvalidEmail] = invalidEmail;
  }

  return {
    data : result,
    errors
  };
};

export const deleteUser = async (id : string) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidId = !id;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiDeleteUser(id);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[UserError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const activateUser = async (userId : string) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidId = !userId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiActivateUser(userId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[UserError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const blockUser = async (userId : string) : Promise<ServiceResponse<boolean, UserError>> => {
  let errors = {} as Record<UserError, boolean>;
  const invalidId = !userId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiBlockUser(userId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[UserError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const changePassword = async (oldPassword : string, newPassword : string, confirmNewPassword : string) : Promise<ServiceResponse<boolean, ChangePasswordError>> => {
  let errors = {} as Record<ChangePasswordError, boolean>;
  const invalidOldPassword = !oldPassword;
  const invalidNewPassword = !validatePassword(newPassword);
  const newPasswordNotMatch = confirmNewPassword !== newPassword;

  let result = false;
  if (!invalidOldPassword && !invalidNewPassword && !newPasswordNotMatch) {
    const {
      data,
      error
    } = await apiChangePassword(oldPassword, newPassword);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.DATA_INVALID:
          errors[ChangePasswordError.WrongOldPassword] = true;
          break;
        default:
          errors[ChangePasswordError.Unknown] = true;
      }
    }
  } else {
    errors[ChangePasswordError.InvalidOldPassword] = invalidOldPassword;
    errors[ChangePasswordError.InvalidNewPassword] = invalidNewPassword;
    errors[ChangePasswordError.NewPasswordNotMatch] = newPasswordNotMatch;
  }

  return {
    data : result,
    errors
  };
};