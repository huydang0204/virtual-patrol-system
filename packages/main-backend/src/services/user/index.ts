import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";
import { configuration } from "config";

import {
  ForgetPassword,
  User
} from "entities";

import {
  ForgetPasswordRepository,
  RoleRepository,
  UserRepository
} from "repositories";

import {
  CountResponse,
  FindAndCountResponse,
  PartialEntity,
  ServiceResponse,
  SuccessResponse,
  UserRole,
  UserStatus,
  SYSTEM_ROLE_ID
} from "@vps/utils/lib/data";

import {
  getNxWitnessUserInfo,
  loginNxWitness
} from "services/thirdparty/nxWitness";
import {
  becomeUserTemplate,
  forgetPasswordTemplate,
  sendMail
} from "services/mails";
import { redisClient } from "services/thirdparty/redis";

import {
  CreateUserRequest,
  CreateUserResponse,
  LoginError,
  LoginResponse,
  UserData,
  UserError,
  UserResponse
} from "@vps/utils/lib/dto/user";
import {
  getCreateUserResponse,
  getUserDto
} from "./mapper";

const login = async (
  email : string,
  password : string,
  nXWitnessLogin : boolean
) : Promise<ServiceResponse<LoginResponse, LoginError>> => {
  let user : User = null;
  //login with nx witness account
  if (nXWitnessLogin) {
    const {
      data,
      error
    } = await loginNxWitness(email, password);

    if (error) {
      if (error.code === "ERR_BAD_REQUEST") {
        return { error : LoginError.InvalidEmailOrPassword };
      }
      return { error : LoginError.NxWitnessError };
    }

    const nxWitnessUser = await getNxWitnessUserInfo(
      data.token,
      data.username
    );
    if (nxWitnessUser.error) {
      return { error : LoginError.NxWitnessError };
    }

    const userWitnessId = nxWitnessUser.data.id
      .replace("{", "")
      .replace("}", "");
    user = await UserRepository.getUserByNxWitness(userWitnessId, true);
    // create new user if not existed at our database
    if (!user) {
      const userRole = await RoleRepository.findOneBy({ id : SYSTEM_ROLE_ID.Officer });

      user = await UserRepository.save({
        email : nxWitnessUser.data.name,
        isVerified : true,
        name : nxWitnessUser.data.fullName || nxWitnessUser.data.email,
        status : "active",
        nxWitnessId : userWitnessId,
        roleId : SYSTEM_ROLE_ID.Officer,
        role : userRole,
        latestLogin : new Date()
      } as PartialEntity<User>);
    }
    if (user?.status === UserStatus.blocked) {
      return { error : LoginError.UserBlocked };
    }
  } else {
    //normal login
    user = await UserRepository.findOne({
      where : { email },
      relations : { role : true }
    });
    if (user && user.isVerified && user.passwordHash) {
      if (user?.status === UserStatus.blocked) {
        return { error : LoginError.UserBlocked };
      }
      const same = await bcrypt.compare(password, user.passwordHash);
      if (!same) {
        return { error : LoginError.InvalidEmailOrPassword };
      }
    } else {
      return { error : LoginError.InvalidEmailOrPassword };
    }
  }

  user.latestLogin = new Date();
  user.status = UserStatus.active;
  await user.save();

  const nxToken = await retrieveNxToken();
  return {
    data : {
      jwt : jwt.sign(
        {
          id : user.id,
          name : user.name,
          roleId : user.roleId
        },
        configuration.jwtKey,
        { expiresIn : configuration.tokenExpiresMinute * 60 }
      ),
      user : {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role?.name,
        latestLogin : user.latestLogin?.toISOString(),
        tokenExpiredAt : addMinutes(new Date(), configuration.tokenExpiresMinute).toISOString(),
        nxToken,
        avatar : user.avatar
      }
    }
  };
};

const logout = async (userId : string) : Promise<boolean> => {
  await UserRepository.update({ id : userId }, { status : UserStatus.inactive });
  return true;
};

const createDefaultAdminAccount = async () : Promise<void> => {
  const password = configuration.adminPassword;
  const email = configuration.adminEmail;
  if (!email || !password) return;
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await UserRepository.findOneBy({ email });
  if (!user) {
    const adminUser : PartialEntity<User> = {
      id : uuid(),
      email,
      name : "admin",
      passwordHash : passwordHash,
      roleId : SYSTEM_ROLE_ID.Admin,
      isVerified : true
    };
    await UserRepository.save(adminUser);
  }
};

const getUser = async (id : string) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({
    where : { id },
    relations : { role : true }
  });
  return checkedUser ? { data : getUserDto(checkedUser) } : { error : UserError.InvalidUserId };
};

const updateUser = async (
  id : string,
  name : string,
  roleId : string,
  callingCode : string,
  phoneNumber : string,
  avatarUrl : string
) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({
    where : { id },
    relations : { role : true }
  });

  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }

  if (!!roleId && roleId !== checkedUser.roleId) {
    const role = await RoleRepository.findOneBy({ id : roleId });
    if (!role) {
      return { error : UserError.InvalidRole };
    }
    checkedUser.role = role;
  }

  checkedUser.name = name ?? checkedUser.name;
  checkedUser.callingCode = callingCode ?? checkedUser.callingCode;
  checkedUser.phoneNumber = phoneNumber ?? checkedUser.phoneNumber;
  checkedUser.avatar = avatarUrl;

  const result = await checkedUser.save();
  return { data : getUserDto(result) };
};

const deleteUserById = async (id : string) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { id } });
  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }
  const now = new Date();
  const prevEmail = checkedUser.email;
  checkedUser.deletedAt = now;
  checkedUser.email = `${ prevEmail }-deletedAt-${ now.valueOf() }`;
  await UserRepository.save(checkedUser);

  return { data : getUserDto(checkedUser) };
};

const createUser = async (
  userRequest : CreateUserRequest,
  userAuth : UserData
) : Promise<ServiceResponse<CreateUserResponse, UserError>> => {
  const {
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    avatarUrl
  } = userRequest;
  const checkedUser = await UserRepository.findOne({ where : { email } });
  if (checkedUser) {
    return { error : UserError.AlreadyExisted };
  }

  const randomPassword = Math.random().toString(36)
    .slice(-8);
  const passwordHash = bcrypt.hashSync(randomPassword, 10);
  const result = await UserRepository.save({
    name,
    email,
    callingCode,
    phoneNumber,
    roleId,
    avatar : avatarUrl,
    passwordHash,
    status : UserStatus.inactive,
    isVerified : true // TODO: check if need to verify email
  });

  sendMail({
    subject : "[VPS] Invitation to VPS Platform",
    template : becomeUserTemplate({
      createdUserName : name,
      createdUserEmail : email,
      createdUserPassword : randomPassword,
      creatorName : userAuth.name
    }),
    sendTos : [result.email]
  });

  return { data : getCreateUserResponse(result, randomPassword) };
};

const listUsers = async (
  ids : string,
  searchText : string,
  limit : number,
  offset: number,
  reqFilterRoles: UserRole[],
  withBlockedUsers : boolean
) : Promise<FindAndCountResponse<UserResponse>> => {
  const result = await UserRepository.findAndCountWithOptions(
    ids,
    searchText,
    limit,
    offset,
    reqFilterRoles,
    withBlockedUsers
  );
  return {
    data : result[0].map(getUserDto),
    count : result[1],
    limit : limit,
    offset : offset
  };
};

const countUsers = async () : Promise<CountResponse> => {
  const count = await UserRepository.count();
  return { count };
};

const createForgetPassword = async (email : string) : Promise<ServiceResponse<boolean, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { email } });

  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }

  if (checkedUser.status === UserStatus.blocked) {
    return { error : UserError.UserBlocked };
  }

  const forgetPassword = new ForgetPassword();
  forgetPassword.id = uuid();
  forgetPassword.user = checkedUser;

  await ForgetPasswordRepository.save(forgetPassword);
  sendMail({
    subject : "[VPS] Forget password",
    template : forgetPasswordTemplate({
      user : checkedUser,
      link : `${ process.env.FE_URL }/vps/user/reset-password?id=${ forgetPassword.id }`
    }),
    sendTos : [checkedUser.email]
  });

  return { data : true };
};

const verifyEmail = async (id : string, emailInfo : {
  email : string,
  password : string
}) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { id } });
  if (!checkedUser ||
    checkedUser.passwordHash ||
    checkedUser.isVerified ||
    checkedUser.email !== emailInfo.email) {
    return { error : UserError.InvalidUserId };
  }

  if (checkedUser.status === UserStatus.blocked) {
    return { error : UserError.UserBlocked };
  }

  checkedUser.passwordHash = bcrypt.hashSync(emailInfo.password, 10);
  checkedUser.latestChangePassword = new Date();
  checkedUser.isVerified = true;

  const result = await checkedUser.save();

  return { data : getUserDto(result) };
};

const resetPassword = async (id : string, resetInfo : {
  newPassword : string,
  userId : string
}) : Promise<ServiceResponse<SuccessResponse, UserError>> => {
  const checkedForgetPassword = await ForgetPasswordRepository.findOne({
    where : { id },
    relations : { user : true }
  });
  if (!checkedForgetPassword || checkedForgetPassword?.userId !== resetInfo.userId) {
    return { error : UserError.InvalidUserId };
  }

  if (checkedForgetPassword.user.status === UserStatus.blocked) {
    return { error : UserError.UserBlocked };
  }

  //assign new password
  await UserRepository.update({ id : resetInfo.userId }, {
    passwordHash : bcrypt.hashSync(resetInfo.newPassword, 10),
    latestChangePassword : new Date()
  });

  await ForgetPasswordRepository.remove(checkedForgetPassword);
  return { data : { success : true } };
};

const changePassword = async (id : string, passwordInfo : {
  newPassword : string,
  oldPassword : string
}) : Promise<ServiceResponse<SuccessResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { id } });
  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }

  if (checkedUser.status === UserStatus.blocked) {
    return { error : UserError.UserBlocked };
  }

  //check old password correction
  const same = await bcrypt.compare(passwordInfo.oldPassword, checkedUser.passwordHash);
  if (!same) {
    return { error : UserError.InvalidOldPassword };
  }

  //assign new password
  checkedUser.passwordHash = bcrypt.hashSync(passwordInfo.newPassword, 10);
  checkedUser.latestChangePassword = new Date();
  await checkedUser.save();

  return { data : { success : true } };
};

const blockUser = async (
  id : string,
  reason : string
) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { id } });
  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }

  checkedUser.blockingReason = reason ?? checkedUser.blockingReason;
  checkedUser.status = UserStatus.blocked;
  checkedUser.blockedAt = new Date();
  const result = await checkedUser.save();

  return { data : getUserDto(result) };
};

const activateUser = async (id : string) : Promise<ServiceResponse<UserResponse, UserError>> => {
  const checkedUser = await UserRepository.findOne({ where : { id } });
  if (!checkedUser) {
    return { error : UserError.InvalidUserId };
  }

  checkedUser.blockingReason = null;
  checkedUser.blockedAt = null;
  checkedUser.status = UserStatus.active;
  checkedUser.reactivatedAt = new Date();
  const result = await checkedUser.save();

  return { data : getUserDto(result) };
};

const retrieveNxToken = async () : Promise<string> => {
  let nxToken = await redisClient.get(configuration.redisKeyNxToken);
  if (!nxToken) {
    const {
      data : loginRp,
      error : loginError
    } = await loginNxWitness(configuration.nxWitnessUsername, configuration.nxWitnessPassword);
    if (!!loginError) {
      return null;
    }
    nxToken = loginRp.token;
  }
  return nxToken;
};

export {
  login,
  createDefaultAdminAccount,
  updateUser,
  resetPassword,
  blockUser,
  activateUser,
  changePassword,
  getUser,
  deleteUserById,
  createUser,
  listUsers,
  countUsers,
  createForgetPassword,
  verifyEmail,
  retrieveNxToken,
  logout
};
