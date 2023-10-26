import {
  NextFunction,
  Request,
  Response
} from "express";
import multer from "multer";

import { processImage } from "services/thirdparty/image";
import Controller from "controllers/controller";
import { auth } from "services/middleware";
import {
  API_ERROR_CODE,
  ApiError
} from "@vps/utils/lib/data";
import { ImageError } from "@vps/utils/lib/dto/thirdparty/image";

const upload = multer();

export default class FileController extends Controller {

  constructor() {
    super();
    this.initRoute();
  }

  private handleError(error : ImageError) : ApiError {
    let rpCode;
    let rpMessage;
    switch (error) {
      case ImageError.FileNotFound:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "File is required.";
        break;
      case ImageError.FileSizeError:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "File size too large.";
        break;
      case ImageError.MimeError:
        rpCode = API_ERROR_CODE.DATA_INVALID;
        rpMessage = "Invalid file MIME type.";
        break;
      case ImageError.FileSavingFail:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
        rpMessage = "File saving failed.";
        break;
      default:
        rpCode = API_ERROR_CODE.SERVER_ERROR;
    }
    return {
      rpCode,
      rpMessage
    };
  }

  apiUploadImage = async (
    req : Request,
    res : Response,
    next : NextFunction
  ) : Promise<void> => {
    try {
      const file : Express.Multer.File = req.file;
      const {
        data,
        error
      } = await processImage(file);
      if (!!error) {
        throw this.handleError(error);
      }

      res.status(200).send({ fileUrl : data });
    } catch (e) {
      next(e);
    }
  };

  initRoute = () : void => {
    this.router.post("/image", [
      auth(),
      upload.single("file")
    ], this.apiUploadImage);
  };
}
