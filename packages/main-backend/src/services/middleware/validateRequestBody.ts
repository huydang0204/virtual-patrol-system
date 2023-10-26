import { Schema } from "joi";
import {
  Request,
  Response,
  NextFunction
} from "express";
import { API_ERROR_CODE } from "@vps/utils/lib/data";

export const validateRequestBody = (schema : Schema) => {
  return (req : Request, res : Response, next : NextFunction) : void => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw {
        rpCode : API_ERROR_CODE.VALIDATION_BODY_ERROR,
        rpMessage : error.message
      };
    }
    next();
  };
};
