export enum UserRole {
  Admin = "Admin",
  Officer = "Officer",
  Client = "Client"
}

export enum UserPermissionRight {
  CreateCamera = "CreateCamera",
  ReadCamera = "ReadCamera",
  UpdateCamera = "UpdateCamera",
  DeleteCamera = "DeleteCamera"
}

export enum AlertTypePriority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export enum ActivityType {
  // user
  UserLogin = "UserLogin",
  UserLogout = "UserLogout",
  CreateUser = "CreateUser",
  BlockUser = "BlockUser",
  ActivateUser = "ActivateUser",
  DeleteUser = "DeleteUser",
  // dashboard
  DownloadAnalyticsReport = "DownloadAnalyticsReport",
  // task
  StartTask = "StartPatrolTask",
  DownloadTaskReport = "DownloadTaskReport",
  DownloadDailyReport = "DownloadDailyReport",
  DownloadMonthlyReport = "DownloadMonthlyReport",
  // route
  CreateRoute = "CreateRoute",
  UpdateRoute = "UpdateRoute",
  DeleteRoute = "DeleteRoute",
  // sop
  CreateSop = "CreateSop",
  UpdateSop = "UpdateSop",
  DeleteSop = "DeleteSop",
  // site
  CreateSite = "CreateSite",
  UpdateSite = "UpdateSite",
  DeleteSite = "DeleteSite",
  // alert type
  CreateAlertType = "CreateAlertType",
  UpdateAlertType = "UpdateAlertType",
  DeleteAlertType = "DeleteAlertType",
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  blocked = "blocked"
}

export enum AttachmentType {
  Common = "Common"
}

export enum DateOfWeek {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

//don't change this order. It can break code at somewhere else.
export enum TaskStatus {
  Pending = "Pending",
  OnGoing = "OnGoing",
  NotStarted = "NotStarted",
  Paused = "Paused",
  Completed = "Completed",
  Incomplete = "Incomplete",
  Missed = "Missed"
}

export enum SopType {
  General = "General",
  Special = "Special"
}

export enum PatrolMode {
  LiveImage = "LiveImage",
  LiveVideoFeed = "LiveVideoFeed"
}

export enum TaskStatusRecord {
  NotGenerated = 0,
  Completed = 1,
  Missed = 2,
  Incomplete = 3
}

export enum NotificationType {
  InComingTask = "InComingTask",
  DailyReportReady = "DailyReportReady",
  MonthlyReportReady = "MonthlyReportReady"
}

export enum NotificationStatus {
  New = "New",
  Read = "Read"
}

export enum NotificationRelatedDataType {
  RouteTask = "RouteTask",
  Report = "Report",
  Site = "Site"
}

export enum DashboardAnalyticsType {
  Monthly = "Monthly",
  Weekly = "Weekly"
}