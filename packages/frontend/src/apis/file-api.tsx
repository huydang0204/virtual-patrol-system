import { vpsApi } from "apis/utils";
import {
  API_METHOD,
  ApiRequest,
  ApiResult,
  ApiService
} from "model-type/service";
import { FileUploadResponse } from "@vps/utils/lib/dto";

const FILE_PREFIX = "/file";

export const uploadImageApi = async (formData : FormData) : Promise<ApiResult<FileUploadResponse>> => {
  const request : ApiRequest = {
    service : ApiService.vps,
    url : FILE_PREFIX + "/image",
    method : API_METHOD.POST,
    data : formData,
    authToken : true
  };

  const {
    success,
    data,
    errorCode
  } = await vpsApi(request);

  let response : FileUploadResponse = null;

  if (success) {
    response = data;
  }

  return {
    data : response,
    error : errorCode
  };
};
