import { CameraResponse } from "@vps/utils/lib/dto/camera";
import { Camera } from "entities";

const getCameraDto = (camera : Camera) : CameraResponse => {
  const {
    id,
    name,
    address,
    tags,
    lat,
    lng,
    status,
    region,
    bearing
  } = camera;

  return {
    id,
    name,
    address,
    tags,
    lat,
    lng,
    status,
    region,
    bearing
  };
};

export { getCameraDto };