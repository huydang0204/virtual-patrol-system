import { Sop } from "entities";
import { SopResponse } from "@vps/utils/lib/dto/sop";

export const getSopDto = (sop : Sop) : SopResponse => {
  if (!sop) return null;
  const {
    id,
    name,
    type,
    startDate,
    endDate,
    checklists,
    createdAt,
    deletedAt
  } = sop;
  const result = {
    id,
    name,
    type,
    startDate : startDate?.toISOString(),
    endDate : endDate?.toISOString(),
    checklists,
    createdAt : createdAt.toISOString()
  };

  if (!!deletedAt) {
    result["deletedAt"] = deletedAt.toISOString();
  }

  return result;
};
