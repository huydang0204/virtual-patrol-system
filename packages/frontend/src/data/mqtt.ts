import {
  NotificationRelatedDataType,
  NotificationType 
} from "@vps/utils/lib/data";

export enum MqttStatus {
  None = "None",
  Connected = "Connected",
  Lost = "Lost"
}

export type MqttInfo = {
  status : MqttStatus
}

export interface NewNotificationMessage {
  type : NotificationType,
  description : string,
  detailData : Record<NotificationRelatedDataType, unknown>
}
