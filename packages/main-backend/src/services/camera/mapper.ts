import { CameraResponse } from "@vps/utils/lib/dto/camera";
import { Camera } from "entities";
import { getSopDto } from "services/sop/mapper";

const getCameraDto = (camera : Camera) : CameraResponse => {
  if (!camera) return null;

  const {
    id,
    name,
    address,
    tags,
    lat,
    lng,
    status,
    bearing,
    site,
    sops
  } = camera;

  return {
    id,
    name,
    address,
    tags,
    lat,
    lng,
    status,
    bearing,
    siteId : site?.id,
    siteName : site?.name,
    sops : sops ? sops.map(getSopDto) : undefined
  };
};

export { getCameraDto };