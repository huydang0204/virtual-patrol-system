import {
  CountResponse,
  FindAndCountResponse,
  ServiceResponse
} from "@vps/utils/lib/data";
import {
  AlertTypeError,
  AlertTypeResponse
} from "@vps/utils/lib/dto/alert-type";

import { AlertTypeRepository } from "repositories/alert-type-repository";
import { getAlertTypeDto } from "./mapper";

const listAlertType = async (
  limit : number,
  offset : number,
  searchText : string
) : Promise<FindAndCountResponse<AlertTypeResponse>> => {

  const [
    alertTypes,
    count
  ] = await AlertTypeRepository.findAndCountWithOptions(
    limit,
    offset,
    searchText
  );

  let result : AlertTypeResponse[] = [];
  if (!!alertTypes) {
    result = alertTypes.map(getAlertTypeDto);
  }

  return {
    data : result,
    count,
    limit,
    offset
  };
};

const countAlertTypes = async (searchText : string) : Promise<CountResponse> => {

  const count = await AlertTypeRepository.countWithOption(searchText);
  return { count };
};

const getAlertType = async (id : string) : Promise<AlertTypeResponse> => {
  const site = await AlertTypeRepository.findOne({ where : { id } });
  return getAlertTypeDto(site);
};

const createAlertType = async (
  type : string,
  description: string,
  actionTaken: string[],
  imageUrl: string
): Promise<ServiceResponse<AlertTypeResponse, AlertTypeError>> => {
  const existedType = await AlertTypeRepository.findOneBy({ type });
  if (!!existedType) {
    return { error : AlertTypeError.DuplicatedType };
  }
  const alertType = await AlertTypeRepository.save({
    type,
    description,
    actionTaken,
    imageUrl
  });
  return { data : getAlertTypeDto(alertType) };
};

const updateAlertType = async (
  id: string,
  type: string,
  description: string,
  actionTaken: string[],
  imageUrl: string
): Promise<ServiceResponse<AlertTypeResponse, AlertTypeError>> => {
  const checkedAlertType = await AlertTypeRepository.findOneBy({ id });
  if (!checkedAlertType) {
    return { error : AlertTypeError.NotFound };
  }

  if (type != checkedAlertType.type) {
    const existedType = await AlertTypeRepository.findOneBy({ type });
    if (!!existedType) {
      return { error : AlertTypeError.DuplicatedType };
    }
  }

  checkedAlertType.type = type;
  checkedAlertType.description = description;
  checkedAlertType.actionTaken = actionTaken;
  checkedAlertType.imageUrl = imageUrl;
  const result = await AlertTypeRepository.save(checkedAlertType);

  return { data : getAlertTypeDto(result) };
};

const deleteAlertType = async (id: string): Promise<ServiceResponse<AlertTypeResponse, AlertTypeError>> => {
  const checkedAlertType = await AlertTypeRepository.findOne({ where : { id } });
  if (!checkedAlertType) {
    return { error : AlertTypeError.NotFound };
  }

  await AlertTypeRepository.softRemove(checkedAlertType);
  return { data : getAlertTypeDto(checkedAlertType) };
};

export {
  listAlertType,
  countAlertTypes,
  getAlertType,
  createAlertType,
  deleteAlertType,
  updateAlertType
};
