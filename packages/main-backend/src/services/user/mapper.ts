import { User } from "entities";
import {
  CreateUserResponse,
  MiniUserResponse,
  UserResponse
} from "@vps/utils/lib/dto/user";

export const getUserDto = (user : User) : UserResponse => {
  if (!user) return null;

  const {
    id,
    nxWitnessId,
    avatar,
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    status,
    isVerified,
    blockingReason,
    role,
    latestLogin,
    latestChangePassword
  } = user;

  return {
    id,
    nxWitnessId,
    avatar,
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    status,
    isVerified,
    blockingReason,
    role : role?.name,
    latestLogin : latestLogin?.toISOString(),
    latestChangePassword : latestChangePassword?.toISOString()
  };
};

export const getMiniUserDto = (user: User): MiniUserResponse => {
  if (!user) return null;

  const {
    id,
    name,
    avatar
  } = user;

  return {
    id,
    avatar,
    name
  };
};

export const getCreateUserResponse = (user : User, password : string) : CreateUserResponse => {
  if (!user) return null;

  const {
    id,
    avatar,
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    status,
    role
  } = user;

  return {
    id,
    avatar,
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    status,
    role : role?.name,
    password
  };
};
