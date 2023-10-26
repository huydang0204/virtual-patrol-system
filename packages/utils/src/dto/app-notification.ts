import {
  NotificationRelatedDataType, NotificationStatus, NotificationType
} from "../data";

enum NotificationError {
  InvalidId = "InvalidId"
}

interface NotificationCountResponse {
  countNew : number;
  countRead : number;
}

 interface NewNotificationMessage {
  type: NotificationType,
  description: string,
  detailData: Record<NotificationRelatedDataType, unknown>
}

 interface RouteTaskNotificationData {
  id: string;
  name: string;
  occurrenceDate: Date;
  startTime: number;
  endTime: number;
}

 interface SiteNotificationData {
  id: string,
  name: string,
  reportId?: string
 }

 interface AppNotificationResponse {
  id: string,
  type: NotificationType,
  description: string,
  alertedUserId: string,
  createdAt: Date | string,
  status: NotificationStatus,
  detailData: Record<NotificationRelatedDataType, unknown>
}

export {
  NotificationError,
  NotificationCountResponse,
  SiteNotificationData,
  RouteTaskNotificationData,
  NewNotificationMessage,
  AppNotificationResponse
};

