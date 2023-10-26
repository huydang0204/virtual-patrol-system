import { ActivityType } from "../data";

export interface UserData {
  id : string;
  name : string;
  roleId ?: string;
  latestLogin ?: Date;
}

export interface UserAuthorization {
  user : UserData;
  token : string;
}

export enum LoginError {
  InvalidEmailOrPassword = "InvalidEmailOrPassword",
  NxWitnessError = "NxWitnessError",
  UserBlocked = "UserBlocked"
}

export enum UserError {
  InvalidUserId = "InvalidUserId",
  AvatarNotFound = "AvatarNotFound",
  AlreadyExisted = "AlreadyExisted",
  InvalidRole = "InvalidRole",
  ForgetPasswordNotFound = "ForgetPasswordNotFound",
  InvalidOldPassword = "InvalidOldPassword",
  UserBlocked = "UserBlocked"
}

export interface UserResponse {
  id : string;
  nxWitnessId : string;
  avatar : string;
  name : string;
  email : string;
  callingCode : string;
  phoneNumber : string;
  roleId : string;
  status : string;
  isVerified : boolean;
  blockingReason : string;
  role: string;
  latestLogin : string;
  latestChangePassword ?: string;
}

export interface CreateUserResponse {
  id : string;
  name : string;
  email : string;
  avatar : string;
  callingCode : string;
  phoneNumber : string;
  roleId : string;
  role : string;
  status : string;
  password : string
}

export interface MiniUserResponse {
  id: string;
  name: string;
  avatar: string;

}

export interface CreateUserRequest {
  name : string;
  email : string;
  callingCode?: string;
  phoneNumber?: string;
  roleId?: string;
  avatarUrl?: string;
}

/*
Dto from frontend
*/

export type UserActivityResponse = {
  id: string;
  type: ActivityType;
  userId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  user: UserActivityData
}

interface UserActivityData {
  id: string;
  avatar: string;
  name: string;
  email: string;
  status: string;
  role: string;
  latestLogin: Date;
}

export type UpdateUserRequest = {
  name?: string;
  email?: string,
  callingCode?: string;
  phoneNumber?: string;
  roleId?: string;
  avatarUrl?: string;
}

export type SelfUpdateUserRequest = Omit<UpdateUserRequest, "roleId">;

//TODO: Consider later
export type UserCreateRequest = {
  name: string;
  email: string,
  callingCode?: string;
  phoneNumber?: string;
  roleId?: string;
  avatarUrl?: string;
}

export type LoginUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  tokenExpiredAt: string;
  nxToken: string;
  avatar: string;
  latestLogin: string;
};

export type LoginResponse = {
  jwt: string,
  user: LoginUserResponse
}