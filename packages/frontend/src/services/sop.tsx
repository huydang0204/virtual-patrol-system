import {
  apiCountSop,
  apiCreateSop,
  apiDeleteSop,
  apiGetSops,
  apiUpdateSop
} from "apis/sop-api";
import { 
  FindAndCountResponse,
  SopType 
} from "@vps/utils/lib/data";
import { SopResponse } from "@vps/utils/lib/dto";
import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";

export enum SopError {
  InvalidId = "InvalidId",
  InvalidType = "InvalidType",
  InvalidName = "InvalidName",
  DuplicatedName = "DuplicatedName",
  InvalidChecklists = "InvalidChecklists"
}

export const fetchSops = async (
  type ?: SopType,
  searchText ? : string,
  limit ? : number,
  offset ? : number
) : Promise<FindAndCountResponse<SopResponse>> => {
  const {
    data,
    error
  } = await apiGetSops(type, searchText, limit, offset);

  if (!error && data) return data;
};

export const countSop = async () : Promise<Record<SopType, number>> => {
  const {
    data,
    error
  } = await apiCountSop();

  if (!error) return data;
};

export const createSop = async (
  type : SopType,
  name : string,
  checklists : string[],
  startDate : Date,
  endDate : Date
) : Promise<ServiceResponse<boolean, SopError>> => {
  let errors = {} as Record<SopError, boolean>;
  const invalidType = !type;
  const invalidName = !name;
  const invalidChecklists = !checklists || (checklists.length == 1 && checklists[0] === "");

  let result = false;
  if (!invalidName && !invalidType && !invalidChecklists) {
    for (let i = 0; i < checklists.length; i++) {
      const value = checklists[i];
      if (value === "") {
        checklists.splice(i, 1);
      }
    }
    const {
      data,
      error
    } = await apiCreateSop(type, name, checklists, startDate, endDate);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.EXISTED_ERROR:
          errors[SopError.DuplicatedName] = true;
          break;
      }
    }
  } else {
    errors[SopError.InvalidType] = invalidType;
    errors[SopError.InvalidName] = invalidName;
    errors[SopError.InvalidChecklists] = invalidChecklists;
  }

  return {
    data : result,
    errors
  };
};

export const updateSop = async (
  id : number,
  name : string,
  checklists : string[],
  startDate : Date,
  endDate : Date
) : Promise<ServiceResponse<boolean, SopError>> => {
  let errors = {} as Record<SopError, boolean>;
  const invalidId = !id;
  const invalidName = !name;
  const invalidChecklists = !checklists || (checklists.length == 1 && checklists[0] === "");

  let result = false;
  if (!invalidId && !invalidName && !invalidChecklists) {
    for (let i = 0; i < checklists.length; i++) {
      const value = checklists[i];
      if (value === "") {
        checklists.splice(i, 1);
      }
    }
    const {
      data,
      error
    } = await apiUpdateSop(id, name, checklists, startDate, endDate);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.EXISTED_ERROR:
          errors[SopError.DuplicatedName] = true;
          break;
      }
    }
  } else {
    errors[SopError.InvalidId] = invalidId;
    errors[SopError.InvalidName] = invalidName;
    errors[SopError.InvalidChecklists] = invalidChecklists;
  }

  return {
    data : result,
    errors
  };
};

export const deleteSop = async (sopId : number) : Promise<ServiceResponse<boolean, SopError>> => {
  let errors = {} as Record<SopError, boolean>;
  const invalidId = !sopId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiDeleteSop(sopId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[SopError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};
