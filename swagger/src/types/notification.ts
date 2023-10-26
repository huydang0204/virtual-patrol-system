
/**
 * Response for count related to Notification
 */
export interface NotiCountResponse {
    countNew: number;
    countRead: number;
}

/**
 * Response Record for notification
 */
export interface AppNotification {

     id?: string;

      type?: NotificationType;

     description?: string;

     alertedUserId?: string;

     createdAt?: Date;

     status?: NotificationStatus;

     detailData?: Record<NotificationRelatedDataType, unknown>;

}

/**
 * Notification Status
 */
export enum NotificationStatus {
    New = "New",
    Read = "Read"
}

/**
 * Notification Type (InComingTask, DailyReportReady, MonthlyReportReady)
 */
export enum NotificationType {
    InComingTask = "InComingTask",
    DailyReportReady = "DailyReportReady",
    MonthlyReportReady = "MonthlyReportReady"
}

/**
 * Notification Data Type (RouteTask, Report, Site) for detail data of a notification record.
 */
export enum NotificationRelatedDataType {
    RouteTask = "RouteTask",
    Report = "Report",
    Site = "Site"
}

export const exampleNotificationStatus = NotificationStatus.New;
export const exampleNotificationType = NotificationType.DailyReportReady;
export const exampleNotificationRelatedDataType = NotificationRelatedDataType.Report;
export const exampleDetailData: Record<NotificationRelatedDataType, unknown> = {
  [NotificationRelatedDataType.RouteTask] : { /**  Your value for RouteTask */ },
  [NotificationRelatedDataType.Report] : { /**  Your value for Report */ },
  [NotificationRelatedDataType.Site] : { /**  Your value for Site */ }
};