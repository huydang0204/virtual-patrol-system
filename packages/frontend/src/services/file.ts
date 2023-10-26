import { uploadImageApi } from "apis/file-api";

import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";
import { FileUploadResponse } from "@vps/utils/lib/dto";

export enum FileError {
  FileRequired = "FileRequired",
  FileInvalid = "FileInvalid"
}

export const uploadImage = async (file : File) : Promise<ServiceResponse<FileUploadResponse, FileError>> => {
  let errors = {} as Record<FileError, boolean>;
  const invalidFile = !file;

  let response : FileUploadResponse = null;
  if (!invalidFile) {
    const formData = new FormData();
    formData.append("file", file);
    const {
      data,
      error
    } = await uploadImageApi(formData);

    if (!!data && !error) {
      errors = null;
      response = data;
    } else {
      switch (error) {
        case API_ERROR.DATA_INVALID:
          errors[FileError.FileInvalid] = true;
          break;
      }
    }
  } else {
    errors[FileError.FileRequired] = invalidFile;
  }

  return {
    data : response,
    errors
  };
};