import {
  apiCountCameras,
  apiListCameras,
  apiUpdateCamera
} from "apis/camera-api";
import { CameraResponse } from "@vps/utils/lib/dto";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";

export enum CameraError {
  InvalidId = "InvalidId",
  InvalidName = "InvalidName",
  InvalidSiteId = "InvalidSiteId"
}

export const fetchCameras = async (
  siteId ?: string,
  searchText ? : string,
  limit ?: number,
  offset ?: number
) : Promise<FindAndCountResponse<CameraResponse>> => {
  const {
    data,
    error
  } = await apiListCameras(siteId, searchText, limit, offset);

  if (!error) return data;
};

export const countCameras = async () : Promise<number> => {
  const {
    data,
    error
  } = await apiCountCameras();

  if (!error) return data.count;
};

export const updateCamera = async (
  id : string,
  name : string,
  siteId : string,
  sopIds : number[]
) : Promise<ServiceResponse<boolean, CameraError>> => {
  let errors = {} as Record<CameraError, boolean>;
  const invalidId = !id;
  const invalidName = !name;

  let result = false;
  if (!invalidName && !invalidId) {
    const {
      data,
      error
    } = await apiUpdateCamera(id, name, siteId, sopIds);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.ACCESS_DENIED:
          errors[CameraError.InvalidSiteId] = true;
          break;
      }
    }
  } else {
    errors[CameraError.InvalidId] = invalidId;
    errors[CameraError.InvalidName] = invalidName;
  }

  return {
    data : result,
    errors
  };
};
