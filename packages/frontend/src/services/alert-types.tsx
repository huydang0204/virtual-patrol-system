import {
  apiCountAlertType,
  apiCreateAlertType,
  apiDeleteAlertType,
  apiGetAlertTypes,
  apiUpdateAlertType
} from "apis/alert-type-api";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import { AlertTypeResponse } from "@vps/utils/lib/dto";
import {
  API_ERROR,
  ServiceResponse
} from "model-type/service";

export enum AlertTypeError {
  InvalidId = "InvalidId",
  InvalidType = "InvalidType",
  DuplicatedType = "DuplicatedType",
  InvalidDescription = "InvalidDescription",
  InvalidActionTaken = "InvalidActionTaken",
  InvalidImageUrl = "InvalidImageUrl"
}

export const fetchAlertTypes = async (
  searchText ? : string,
  limit ? : number,
  offset ? : number
) : Promise<FindAndCountResponse<AlertTypeResponse>> => {
  const {
    data,
    error
  } = await apiGetAlertTypes(searchText, limit, offset);

  if (!error && data) return data;
};

export const countAlertTypes = async (searchText ? : string) : Promise<number> => {
  const {
    data,
    error
  } = await apiCountAlertType(searchText);

  if (!error) return data.count;
};

export const createAlertType = async (
  type : string,
  description : string,
  actionTaken : string[],
  imageUrl : string
) : Promise<ServiceResponse<boolean, AlertTypeError>> => {
  let errors = {} as Record<AlertTypeError, boolean>;
  const invalidType = !type;
  const invalidDescription = !description;
  const invalidActionTaken = actionTaken.length === 0;
  const invalidImageUrl = !imageUrl;

  let result = false;
  if (!invalidType && !invalidDescription && !invalidActionTaken && !invalidImageUrl) {
    const {
      data,
      error
    } = await apiCreateAlertType(type, description, actionTaken, imageUrl);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.EXISTED_ERROR:
          errors[AlertTypeError.DuplicatedType] = true;
          break;
      }
    }
  } else {
    errors[AlertTypeError.InvalidType] = invalidType;
    errors[AlertTypeError.InvalidDescription] = invalidDescription;
    errors[AlertTypeError.InvalidActionTaken] = invalidActionTaken;
    errors[AlertTypeError.InvalidImageUrl] = invalidImageUrl;
  }

  return {
    data : result,
    errors
  };
};

export const updateAlertType = async (
  id : string,
  type : string,
  description : string,
  actionTaken : string[],
  imageUrl : string
) : Promise<ServiceResponse<boolean, AlertTypeError>> => {
  let errors = {} as Record<AlertTypeError, boolean>;
  const invalidId = !id;
  const invalidType = !type;
  const invalidDescription = !description;
  const invalidActionTaken = actionTaken.length === 0;
  const invalidImageUrl = !imageUrl;

  let result = false;
  if (!invalidId && !invalidType && !invalidDescription && !invalidActionTaken) {
    const {
      data,
      error
    } = await apiUpdateAlertType(id, type, description, actionTaken, imageUrl);
    if (data && !error) {
      errors = null;
      result = true;
    } else {
      switch (error) {
        case API_ERROR.EXISTED_ERROR:
          errors[AlertTypeError.DuplicatedType] = true;
          break;
      }
    }
  } else {
    errors[AlertTypeError.InvalidId] = invalidId;
    errors[AlertTypeError.InvalidType] = invalidType;
    errors[AlertTypeError.InvalidDescription] = invalidDescription;
    errors[AlertTypeError.InvalidActionTaken] = invalidActionTaken;
    errors[AlertTypeError.InvalidImageUrl] = invalidImageUrl;
  }

  return {
    data : result,
    errors
  };
};

export const deleteAlertType = async (id : string) : Promise<ServiceResponse<boolean, AlertTypeError>> => {
  let errors = {} as Record<AlertTypeError, boolean>;
  const invalidId = !id;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiDeleteAlertType(id);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[AlertTypeError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};