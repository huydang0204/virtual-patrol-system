import {
  NextFunction,
  Request,
  Response
} from "express";
import Joi from "joi";
import Controller from "controllers/controller";
import {
  API_ERROR_CODE,
  ApiError,
  SYSTEM_ROLE_ID,
  ActivityType,
  UserRole
} from "@vps/utils/lib/data";

import {
  CreateUserRequest,
  LoginError,
  UserAuthorization,
  UserError

} from "@vps/utils/lib/dto/user";

import {
  verifyEmail,
  activateUser,
  blockUser,
  changePassword,
  countUsers,
  createForgetPassword,
  createUser,
  deleteUserById,
  getUser,
  listUsers,
  login,
  logout,
  resetPassword,
  updateUser

} from "services/user";
import { getForgetPassword } from "services/forgetpassword";
import {
  auth,
  validateRequestBody,
  validateRequestParam,
  validateRequestQuery
} from "services/middleware";
import { PASSWORD_REGEX } from "utils/data";
import { logActivity } from "services/activity";

export default class UserController extends Controller {
  private readonly idParamSchema = Joi.object({
    id : Joi.string().uuid()
      .required()
  });

  private readonly authSchema = Joi.object({
    email : Joi.string().required(),
    password : Joi.string().required(),
    nxWitnessLogin : Joi.bool().allow(null)
      .optional()
  });

  private readonly verifyEmailSchema = Joi.object({
    email : Joi.string().email()
      .required(),
    password : Joi.string().min(8)
      .regex(RegExp(PASSWORD_REGEX))
      .required()
  });

  private readonly userCreateSchema = Joi.object({
    name : Joi.string().max(128)
      .required(),
    email : Joi.string().email()
      .required(),
    roleId : Joi.string().guid()
      .valid(SYSTEM_ROLE_ID.Admin, SYSTEM_ROLE_ID.Officer, SYSTEM_ROLE_ID.Client)
      .required(),
    callingCode : Joi.string().max(5)
      .optional()
      .allow("", null),
    phoneNumber : Joi.string().max(20)
      .optional()
      .allow("", null),
    avatarUrl : Joi.string()
      .optional()
      .allow("", null)
  });

  private readonly userUpdateSchema = Joi.object({
    name : Joi.string().max(128)
      .allow("", null),
    roleId : Joi.string().guid()
      .valid(SYSTEM_ROLE_ID.Admin, SYSTEM_ROLE_ID.Officer, SYSTEM_ROLE_ID.Client),
    callingCode : Joi.string().max(5)
      .allow("", null),
    phoneNumber : Joi.string().max(20)
      .allow("", null),
    avatarUrl : Joi.string().allow("", null)
      .optional()
  });

  private readonly userUpdateYourselfSchema = Joi.object({
    name : Joi.string().max(128)
      .allow("", null)
      .optional(),
    callingCode : Joi.string().max(5)
      .allow("", null)
      .optional(),
    phoneNumber : Joi.string().max(20)
      .allow("", null)
      .optional(),
    avatarUrl : Joi.string().allow("", null)
      .optional()
  });

  private readonly userChangePasswordSchema = Joi.object({
    newPassword : Joi.string()
      .max(25)
      .min(8)
      .regex(RegExp(PASSWORD_REGEX))
      .disallow(Joi.ref("oldPassword"))
      .required(),
    oldPassword : Joi.string().required()
  });

  private readonly userResetPassword = Joi.object({
    newPassword : Joi.string().max(128)
      .min(12)
      .regex(RegExp(PASSWORD_REGEX))
      .required(),
    userId : Joi.string().required()
  });

  private readonly blockSchema = Joi.object({ reason : Joi.string().max(128) });

  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error : UserError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case UserError.InvalidUserId:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "User not found!";
        break;
      case UserError.InvalidOldPassword:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Invalid Old Password!";
        break;
      case UserError.AvatarNotFound:
        rpCode = API_ERROR_CODE.BAD_REQUEST;
        rpMessage = "Avatar not found!";
        break;
      case UserError.ForgetPasswordNotFound:
        rpCode = API_ERROR_CODE.NOT_FOUND;
        rpMessage = "Forget Password not found!";
        break;
      case UserError.UserBlocked:
        rpCode = API_ERROR_CODE.BLOCKED;
        rpMessage = "User has been blocked!";
        break;
      case UserError.AlreadyExisted:
        rpCode = API_ERROR_CODE.EXISTED_ERROR;
        rpMessage = "User is already existed!";
        break;
      case UserError.InvalidRole:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Invalid Role!";
        break;
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiGetUser = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await getUser(id as string);
      if (error) {
        this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiLogin = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        email,
        password,
        nxWitnessLogin
      } = req.body;
      const {
        data,
        error
      } = await login(email as string, password as string, nxWitnessLogin as boolean);
      if (error) {
        let rpCode : API_ERROR_CODE = API_ERROR_CODE.SERVER_ERROR,
          rpMessage = undefined;
        switch (error) {
          case LoginError.InvalidEmailOrPassword:
            rpCode = API_ERROR_CODE.DATA_INVALID;
            rpMessage = "Invalid email or password!";
            break;
          case LoginError.NxWitnessError:
            rpCode = API_ERROR_CODE.SERVER_ERROR;
            rpMessage = "Cannot connect to NX Witness!";
            break;
          case LoginError.UserBlocked:
            rpCode = API_ERROR_CODE.BLOCKED;
            rpMessage = "User has been blocked!";
            break;
        }
        throw {
          rpCode,
          rpMessage
        };
      }

      logActivity(ActivityType.UserLogin, {
        id : data.user.id,
        name : data.user.name
      });
      res.status(200).send(data);
    } catch (e) {
      next(e);
    }
  };

  apiLogout = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { user } = JSON.parse(req.headers.user as string) as UserAuthorization;
      const success = await logout(user.id);
      if (success) {
        logActivity(ActivityType.UserLogout, user);
      }
      res.status(200).send({ success });
    } catch (error) {
      next(error);
    }
  };

  apiUpdateUser = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        name,
        callingCode,
        phoneNumber,
        roleId,
        avatarUrl
      } = req.body;
      const {
        data,
        error
      } = await updateUser(id, name as string, roleId as string, callingCode as string, phoneNumber as string, avatarUrl as string);
      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiSelfUpdateUser = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { user } = JSON.parse(req.headers.user as string) as UserAuthorization;
      const {
        name,
        callingCode,
        phoneNumber,
        avatarUrl
      } = req.body;
      const {
        data,
        error
      } = await updateUser(user.id, name as string, null, callingCode as string, phoneNumber as string, avatarUrl as string);
      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiDeleteUserById = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await deleteUserById(id as string);
      if (error) {
        throw this.handleError(error);
      }

      const { user } = JSON.parse(req.headers.user as string) as UserAuthorization;
      logActivity(ActivityType.DeleteUser, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiVerifyEmail = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        email,
        password
      } = req.body;
      const {
        data,
        error
      } = await verifyEmail(id as string, {
        email,
        password
      });
      if (error) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "User Not Found!"
        };
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCreateUser = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      const createUserRequest = req.body as CreateUserRequest;

      const {
        data,
        error
      } = await createUser(createUserRequest, user);
      if (error) {
        throw {
          rpCode : API_ERROR_CODE.EXISTED_ERROR,
          rpMessage : "User Already Existed."
        };
      }
      logActivity(ActivityType.CreateUser, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiListUsers = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const {
        ids,
        searchText,
        limit,
        offset,
        withBlockedUsers,
        filterRoles
      } = req.query;
      const reqLimit = !!limit ? parseInt(limit as string) : undefined;
      const reqOffset = !!offset ? parseInt(offset as string) : undefined;
      const reqFilterRoles : UserRole[] = !!filterRoles ? JSON.parse(filterRoles as string) : undefined;

      const data = await listUsers(
        ids as string,
        searchText as string,
        reqLimit,
        reqOffset,
        reqFilterRoles,
        withBlockedUsers === "true"
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiCountUsers = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const data = await countUsers();
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiForgetPassword = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { email } = req.body;
      const {
        data,
        error
      } = await createForgetPassword(email as string);
      if (error) {
        throw this.handleError(error);
      }
      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  apiCheckForgetPasswordKey = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        data,
        error
      } = await getForgetPassword(id as string);
      if (!!error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiResetPassword = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { id } = req.params;
      const {
        newPassword,
        userId
      } = req.body;

      const {
        data,
        error
      } = await resetPassword(id as string, {
        newPassword : newPassword,
        userId : userId
      });
      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiChangePassword = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      const {
        newPassword,
        oldPassword
      } = req.body;

      const {
        data,
        error
      } = await changePassword(user.id, {
        newPassword,
        oldPassword
      });
      if (error) {
        throw this.handleError(error);
      }

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiBlockUser = async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const id = req.query.id as unknown as string;
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      const { reason } = req.body;

      const {
        data,
        error
      } = await blockUser(id, reason);

      if (error) {
        throw {
          rpCode : API_ERROR_CODE.NOT_FOUND,
          rpMessage : "User Not Found!"
        };
      }
      logActivity(ActivityType.BlockUser, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  apiActivateUser = async (req : Request, res : Response, next : NextFunction) : Promise<Response | void> => {
    try {
      const { id } = req.query;
      const { user } = JSON.parse(req.headers.user as string) as unknown as UserAuthorization;
      const {
        data,
        error
      } = await activateUser(id as string);
      if (error) {
        throw this.handleError(error);
      }
      logActivity(ActivityType.ActivateUser, user, data.name);

      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

  initRoute = () : void => {
    // auth
    this.router.post("/login", validateRequestBody(this.authSchema), this.apiLogin);
    this.router.post("/logout", auth(), this.apiLogout);

    // common user apis
    this.router.put("/", auth(), validateRequestBody(this.userUpdateYourselfSchema), this.apiSelfUpdateUser);
    this.router.post("/verify-email/:id", validateRequestParam(this.idParamSchema), validateRequestBody(this.verifyEmailSchema), this.apiVerifyEmail);

    // password apis
    this.router.get("/forget-password/:id", validateRequestParam(this.idParamSchema), this.apiCheckForgetPasswordKey);
    this.router.post("/forget-password", this.apiForgetPassword);
    this.router.post("/change-password", auth(), validateRequestBody(this.userChangePasswordSchema), this.apiChangePassword);
    this.router.post("/reset-password/:id", validateRequestParam(this.idParamSchema), validateRequestBody(this.userResetPassword), this.apiResetPassword);

    // admin apis
    this.router.put("/activate", auth([SYSTEM_ROLE_ID.Admin]), validateRequestQuery(this.idParamSchema), this.apiActivateUser);
    this.router.put("/block", auth([SYSTEM_ROLE_ID.Admin]), validateRequestQuery(this.idParamSchema), validateRequestBody(this.blockSchema), this.apiBlockUser);
    this.router.post("/", auth([SYSTEM_ROLE_ID.Admin]), validateRequestBody(this.userCreateSchema), this.apiCreateUser);
    this.router.put("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestBody(this.userUpdateSchema), this.apiUpdateUser);
    this.router.delete("/:id", auth([SYSTEM_ROLE_ID.Admin]), validateRequestParam(this.idParamSchema), this.apiDeleteUserById);

    // get user(s) apis
    this.router.get("/list", auth(), this.apiListUsers);
    this.router.get("/count", auth(), this.apiCountUsers);
    this.router.get("/:id", auth(), validateRequestParam(this.idParamSchema), this.apiGetUser);
  };
}
