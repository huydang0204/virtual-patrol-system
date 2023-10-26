import { apiGetCameraImage } from "apis/nx-api";
import { ApiResult } from "model-type/service";
import { retrieveNxToken } from "model/user-account";

export const getCameraSnapshot = async (
  cameraId: string,
  timeInEpoch: number | string
): Promise<ApiResult<Blob>> => {
  const {
    data, error 
  } = await apiGetCameraImage(cameraId, timeInEpoch);

  if (!error) return {
    data,
    error 
  };
  else return {
    data : null,
    error 
  };
};