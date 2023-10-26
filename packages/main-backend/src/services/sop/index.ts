import { SopRepository } from "repositories";
import {
  FindAndCountResponse,
  ServiceResponse,
  SopType
} from "@vps/utils/lib/data";
import {
  SopError,
  SopResponse
} from "@vps/utils/lib/dto/sop";
import { getSopDto } from "./mapper";
import {
  endOfDay,
  startOfDay
} from "date-fns";

const countSop = async () : Promise<Record<SopType, number>> => {
  const result : Record<SopType, number> = await SopRepository.countByType();
  return result;
};

const listSop = async (
  limit : number,
  offset : number,
  searchText : string,
  type : SopType
) : Promise<FindAndCountResponse<SopResponse>> => {
  const [
    tasks,
    count
  ] = await SopRepository.findAndCountWithOptions(
    limit,
    offset,
    searchText,
    type
  );

  let results : SopResponse[] = [];
  if (!!tasks) {
    results = tasks.map(getSopDto);
  }

  return {
    data : results,
    count,
    limit,
    offset
  };
};

const getSop = async (id : number) : Promise<ServiceResponse<SopResponse, SopError>> => {
  const sop = await SopRepository.findOne({
    where : { id },
    relations : { cameras : true }
  });
  if (!sop) {
    return { error : SopError.SopNotFound };
  }

  return { data : getSopDto(sop) };
};

const createSop = async (
  name : string,
  type : SopType,
  checklists : string[],
  startDate : string,
  endDate : string
) : Promise<ServiceResponse<SopResponse, SopError>> => {
  const existedSop = await SopRepository.findOne({ where : { name } });
  if (!!existedSop) {
    return { error : SopError.DuplicateSop };
  }

  const sop = await SopRepository.save({
    name : name,
    type : type,
    checklists : checklists,
    startDate : !startDate ? null : startOfDay(new Date(startDate)),
    endDate : !endDate ? null : endOfDay(new Date(endDate))
  });

  return { data : getSopDto(sop) };
};
const updateSop = async (
  id : number,
  name : string,
  checklists : string[],
  startDate : string,
  endDate : string
) : Promise<ServiceResponse<SopResponse, SopError>> => {
  const sop = await SopRepository.findOneBy({ id });
  if (!sop) {
    return { error : SopError.SopNotFound };
  }

  if (name !== sop.name) {
    const existedSop = await SopRepository.findOne({ where : { name } });
    if (!!existedSop) {
      return { error : SopError.DuplicateSop };
    }
  }

  sop.name = name;
  sop.checklists = checklists;
  sop.startDate = !startDate ? null : startOfDay(new Date(startDate));
  sop.endDate = !endDate ? null : endOfDay(new Date(endDate));
  const result = await SopRepository.save(sop);

  return { data : getSopDto(result) };
};

const deleteSop = async (id : number) : Promise<ServiceResponse<SopResponse, SopError>> => {
  const sop = await SopRepository.findOne({
    where : { id },
    relations : { cameras : true }
  });
  if (!sop) {
    return { error : SopError.SopNotFound };
  }

  sop.deletedAt = new Date();
  sop.cameras = [];
  await SopRepository.save(sop);

  return { data : getSopDto(sop) };
};

export {
  countSop,
  listSop,
  createSop,
  getSop,
  deleteSop,
  updateSop
};
