import {
  Camera,
  Site
} from "entities";
import { SiteResponse } from "@vps/utils/lib/dto/site";
import { EntityOverallData } from "@vps/utils/lib/data";

export const getSiteDto = (site : Site, noCameras ?: number, withCameras ?: boolean) : SiteResponse => {
  if (!site) return null;

  const {
    id,
    name,
    description,
    cameras,
    deleted
  } = site;

  const result = {
    id,
    name,
    description,
    noCameras : noCameras ?? (!!cameras ? cameras.length : 0)
  };

  if (deleted) {
    result["deleted"] = true;
  }

  if (withCameras && !!cameras) {
    result["cameras"] = cameras.map((camera : Camera) => new EntityOverallData<Camera>(camera));
  }

  return result;
};
