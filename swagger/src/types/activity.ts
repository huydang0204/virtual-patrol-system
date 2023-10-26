import {
  exampleDate,
  exampleEmail,
  exampleUUID
} from "./common";

/**
 * response of activity apis
 */
export interface ActivityResponse {
    id: string;
    type: ActivityType;
    userId: string;
    description: string;
    createdAt: Date;
    user: UserActivityData;
}

/**
 * user activity data used at activity response
 */
export interface UserActivityData {
    id: string;
    avatar: string;
    name: string;
    email: string;
    status: string;
    role: string;
    latestLogin: Date;
}

/**
 * activity type
 */
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

/**
 * request body when creating activity
 */
export interface ActivityCreateBody {

    type: string;
    targetName: string;

}

export const exampleUserActivityData: UserActivityData = {
  id : exampleUUID,
  avatar : "string",
  name : "string",
  email : exampleEmail,
  status : "string",
  role : "string",
  latestLogin : exampleDate
};

export const exampleActivityType = ActivityType.ActivateUser;