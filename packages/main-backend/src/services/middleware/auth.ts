import {
  Request,
  Response,
  NextFunction
} from "express";
import jwt from "jsonwebtoken";
import { configuration } from "config";
import { API_ERROR_CODE } from "@vps/utils/lib/data";

import {
  UserData,
  UserAuthorization
} from "@vps/utils/lib/dto/user";
import { logger } from "services/logger";

const authorizedTokenAndRole = (token : string, allowRoles : string[]) : UserData => {
  if (!token) {
    throw { rpCode : API_ERROR_CODE.UNAUTHORIZED };
  }

  let user = null;
  try {
    user = jwt.verify(
      token,
      configuration.jwtKey
    ) as UserData;
  } catch (e) {
    logger.debug(e);
  }

  if (!user) {
    throw { rpCode : API_ERROR_CODE.UNAUTHORIZED };
  }

  if (allowRoles.length > 0 && !allowRoles.includes(user.roleId)) {
    throw { rpCode : API_ERROR_CODE.ACCESS_DENIED };
  }
  return user;
};

export const auth = (allowRoles : string[] = []) => {
  return async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const token : string = req.header("Authorization")?.replace("Bearer ", "");
      const user = authorizedTokenAndRole(token, allowRoles);
      const userLogged : UserAuthorization = {
        user,
        token
      };

      req.headers.user = JSON.stringify(userLogged);
      next();
    } catch (e) {
      next(e);
    }
  };
};

export const authUrl = (allowRoles : string[] = []) => {
  return async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const token : string = req.query.token as unknown as string;
      const user = authorizedTokenAndRole(token, allowRoles);
      const userLogged : UserAuthorization = {
        user,
        token
      };

      req.headers.user = JSON.stringify(userLogged);
      next();
    } catch (e) {
      next(e);
    }
  };
};
