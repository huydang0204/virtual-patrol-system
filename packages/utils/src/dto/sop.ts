import { SopType } from "../data";

export interface SopResponse {
  id : number,
  name : string,
  type : SopType,
  startDate : string,
  endDate : string,
  checklists : string[],
  createdAt : string,
  deletedAt ?: string
}

export enum SopError {
  SopNotFound = "SopNotFound",
  DuplicateSop = "DuplicateSop"
}
