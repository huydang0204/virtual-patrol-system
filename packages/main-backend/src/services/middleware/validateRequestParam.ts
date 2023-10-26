import { Schema } from "joi";
import {
  Request,
  Response,
  NextFunction
} from "express";
import { API_ERROR_CODE } from "@vps/utils/lib/data";

export const validateRequestParam = (schema : Schema) => {
  return (req : Request, res : Response, next : NextFunction) : void => {
    const { error } = schema.validate(req.params);
    if (error) {
      throw {
        rpCode : API_ERROR_CODE.VALIDATION_PATH_PARAMS_ERROR,
        rpMessage : error.message
      };
    }
    next();
  };
};
