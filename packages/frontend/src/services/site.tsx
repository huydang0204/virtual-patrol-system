import {
  apiCountSite,
  apiCreateSite,
  apiDeleteSite,
  apiGetSiteById,
  apiGetSites,
  apiUpdateSite
} from "apis/site-api";

import { FindAndCountResponse } from "@vps/utils/lib/data";
import { SiteResponse } from "@vps/utils/lib/dto";
import { ServiceResponse } from "model-type/service";

export enum SiteError {
  InvalidId = "InvalidId",
  InvalidName = "InvalidName",
  InvalidDescription = "InvalidDescription"
}

export const fetchSites = async (searchText ?: string, limit ?: number, offset ?: number) : Promise<FindAndCountResponse<SiteResponse>> => {
  const {
    data,
    error
  } = await apiGetSites(searchText, limit, offset);

  if (!error && data) return data;
};

export const fetchSite = async (siteId : string) : Promise<SiteResponse> => {
  const {
    data,
    error
  } = await apiGetSiteById(siteId);

  if (!error && data) return data;
};

export const countSites = async (searchText ?: string) : Promise<number> => {
  const {
    data,
    error
  } = await apiCountSite(searchText);

  if (!error) return data.count;
};

export const createSite = async (name : string, description : string, cameraIds ?: string[]) : Promise<ServiceResponse<boolean, SiteError>> => {
  let errors = {} as Record<SiteError, boolean>;
  const invalidName = !name;
  const invalidDescription = !description;

  let result = false;
  if (!invalidName && !invalidDescription) {
    const {
      data,
      error
    } = await apiCreateSite(name, description, cameraIds);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[SiteError.InvalidName] = invalidName;
    errors[SiteError.InvalidDescription] = invalidDescription;
  }

  return {
    data : result,
    errors
  };
};

export const updateSite = async (id : string, name : string, description : string, cameraIds : string[] = []) : Promise<ServiceResponse<boolean, SiteError>> => {
  let errors = {} as Record<SiteError, boolean>;
  const invalidId = !id;
  const invalidName = !name;
  const invalidDescription = !description;

  let result = false;
  if (!invalidId && !invalidName && !invalidDescription) {
    const {
      data,
      error
    } = await apiUpdateSite(id, name, description, cameraIds);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[SiteError.InvalidId] = invalidId;
    errors[SiteError.InvalidName] = invalidName;
    errors[SiteError.InvalidDescription] = invalidDescription;
  }

  return {
    data : result,
    errors
  };
};

export const deleteSite = async (site : SiteResponse) : Promise<ServiceResponse<boolean, SiteError>> => {
  let errors = {} as Record<SiteError, boolean>;
  const invalidId = !site?.id;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiDeleteSite(site.id);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[SiteError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};
