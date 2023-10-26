import { DeepPartial } from "typeorm/common/DeepPartial";
import { BaseEntity } from "typeorm";

export type ServiceResponse<T, S extends string> = {
  data ?: T,
  error ?: S
}

export interface FindAndCountResponse<T> {
  data: T[],
  count: number,
  limit?: number,
  offset?: number
}

export interface SuccessResponse {
  success : boolean
}

export interface CountResponse {
  count : number
}

export interface DeleteResponse {
  deletedCount : number
}

// for entity insert
export type PartialEntity<T> = DeepPartial<T>;

export type ExecuteTime = {
  startTime : number,
  endTime: number,
  repeatHours?: number
}

export type CameraStatus = "Recording" | "online" | "offline";

export interface TaskReportRowData {
  camera: CameraData,
  timeCompleted: string, // as Date
  completedUserId: string,
  completedUserName: string,
  faultDetected: boolean, // false for acknowledge/comment only, true for having alert
  alert?: AlertData // define when there is fault detected, otherwise leave it null,
  comment ?: string
}

export interface CameraData {
  id: string,
  name?: string,
  snapshotTimeInEpoch: number, // must have
}

export interface AlertData {
  type : string,
  description : string,
  actionsTaken : string
}

export interface TaskDailyReportData {
  id : string;
  name : string;
  status : string;
  endComment : string;
  reportDataRows : Record<number, TaskReportRowData[]>;
}

export class EntityOverallData<T extends BaseEntity> {
  public id : string;
  public name : string;

  constructor(entity : T) {
    if (!entity) return;

    this.id = entity["id"];
    this.name = entity["name"];
  }

}

export interface UserAuth {
  id: string;
  name: string;
  roleId: string;
  latestLogin?: Date;
}
