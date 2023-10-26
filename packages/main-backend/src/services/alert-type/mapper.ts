import { AlertType } from "entities";
import { AlertTypeResponse } from "@vps/utils/lib/dto/alert-type";

export const getAlertTypeDto = (alertType : AlertType) : AlertTypeResponse => {
  if (!alertType) return null;

  const {
    id,
    type,
    priority,
    description,
    actionTaken,
    imageUrl,
    deletedAt
  } = alertType;

  const result = {
    id,
    type,
    priority,
    description,
    actionTaken,
    imageUrl
  };

  if (!!deletedAt) {
    result["deletedAt"] = deletedAt.toISOString();
  }

  return result;
};
