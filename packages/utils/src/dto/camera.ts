import { CameraStatus } from "../data";
import { SopResponse } from "../dto/sop";

export enum CameraError {
  NotFound = "CameraNotFound",
  SopNotFound = "SopNotFound",
  BadRequest = "BadRequest",
  AlreadyExisted = "AlreadyExisted",
  ServerError = "ServerError",
  CSVError = "CSVError",
  NxTokenFail = "NxTokenFail",
  WitnessStatusFail = "WitnessStatusFail",
  SiteNotFound = "SiteNotFound"
}

export interface CameraRequest {
  name ?: string;
  address ?: string;
  tags ?: string[];
  lat ?: string;
  lng ?: string;
  region ?: string;
  bearing ?: string;
  siteId?: string;
  sopIds?: number[];
}

export interface CameraResponse {
  id : string;
  name : string;
  address?: string;
  tags?: string[];
  lat?: string;
  lng?: string;
  region?: string;
  status?: CameraStatus;
  bearing?: string;
  siteId?: string;
  siteName?: string;
  sops?: SopResponse[];
}

export type CameraSyncData = {
  name?: string;
  address?: string;
  lat?: string;
  long?: string;
  isActive?: boolean;
  cameraId: string;
  region?: string;
  bearing?: string;
};

export interface CameraSyncDTO {
  new: CameraSyncData[];
  existing: CameraSyncData[];
  obsolete: string[];
}
