import {
  UUID,
  email
} from "./common";

/**
 * request of login api
 */
export interface LoginRequest {
  /**
   * email of user account
   */
  email: email,
  /**
   * password of user account
   */
  password: string,
  /**
   * is user using NX Witness Account?
   */
  nxWitnessLogin : boolean
}

/**
 * response of login api
 */
export interface LoginResponse {
  jwt : string,
  user : {
    id: UUID,
    name : string,
    email: email,
    role: UUID,
    latestLogin: Date,
    tokenExpiredAt : Date,
    nxToken : string,
    avatar : string
  }
}

/**
 * response of user apis
 */
export interface UserResponse {
  id: UUID;
  nxWitnessId: string;
  avatar: string;
  name: string;
  email: email;
  callingCode: string;
  phoneNumber: string;
  roleId: UUID;
  status: string;
  isVerified: boolean;
  blockingReason: string;
  role: string;
  latestLogin: Date;
}

/**
 * user list as response
 */
export interface UserList {
  data: UserResponse[];
}

/**
 * request body of updating user information
 */
export interface UserUpdateBody {
  name: string;
  roleId: UUID;
  callingCode: string;
  phoneNumber: string;
  avatarUrl: string;
}

/**
 * request body on verifying user's email
 */
export interface VerifyEmailBody {
  email: email;
  password: string;
}

/**
 * request body of creating user
 */
export interface UserCreationBody {
  name: string;
  email: email;
  roleId: UUID;
  callingCode: string;
  phoneNumber: string;

}

/**
 * Response when asking for forget password
 */
export interface ForgetPasswordResponse {

  id: string;
  userId: string;
  createdAt: Date;
  user: UserResponse;
}

/**
 * request body of asking for forget password
 */
export interface ForgetPasswordRequest {
  email: email;
}