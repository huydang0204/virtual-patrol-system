import React from "react";

import DashboardIcon from "components/icons/AppMenuIcons/DashboardIcon";
import VirtualPatrolIcon from "components/icons/AppMenuIcons/VirtualPatrolIcon";
import PatrolListIcon from "components/icons/AppMenuIcons/PatrolListIcon";
import TaskListIcon from "components/icons/AppMenuIcons/TaskListIcon";
import SettingsIcon from "components/icons/AppMenuIcons/SettingsIcon";
import ReportIcon from "components/icons/AppMenuIcons/ReportIcon";

import { USER_ROLE } from "@vps/utils/lib/data";

export const VPS_PREFIX_PATH = "/vps";
export const TEMPLATE_PREFIX_PATH = VPS_PREFIX_PATH + "/app";

export const USER_PREFIX_PATH = VPS_PREFIX_PATH + "/user";
export const LOGIN_PATH = USER_PREFIX_PATH + "/login";
export const REGISTRATION_PATH = USER_PREFIX_PATH + "/register";
export const FORGOT_PASSWORD_PATH = USER_PREFIX_PATH + "/forgot-password";
export const FORGOT_PASSWORD_EMAIL_REQ_SUCCESS_PATH = USER_PREFIX_PATH + "/forgot-password-email-requested";
export const RESET_PASSWORD_PATH = USER_PREFIX_PATH + "/reset-password";

export const DASHBOARD_PATH = TEMPLATE_PREFIX_PATH + "/dashboard";
export const VIRTUAL_PATROL_PATH = TEMPLATE_PREFIX_PATH + "/virtual-patrol";

export const PATROL_LIST_PATH = TEMPLATE_PREFIX_PATH + "/patrols";
export const PATROL_CREATE_PATH = PATROL_LIST_PATH + "/create";
export const PATROL_MANAGE_PATH = PATROL_LIST_PATH + "/manage/:routeId";

export const TASK_LIST_PATH = TEMPLATE_PREFIX_PATH + "/tasks";

export const MANAGEMENT_USER_PATH = TEMPLATE_PREFIX_PATH + "/user";
export const USER_PROFILE_PATH = MANAGEMENT_USER_PATH + "/:id";
export const USER_LOGOUT_PATH = MANAGEMENT_USER_PATH + "/logout";

export const SETTINGS_PATH = TEMPLATE_PREFIX_PATH + "/settings";

export const REPORT_PATH = TEMPLATE_PREFIX_PATH + "/reports";
export const REPORT_MONTHLY_DETAIL_PATH = REPORT_PATH + "/monthly-report/:id";
export const REPORT_DAILY_DETAIL_PATH = REPORT_PATH + "/daily-report/:id";
export const REPORT_TASK_DETAIL_PATH = REPORT_PATH + "/:taskId";

export const PAGE_NOT_FOUND_PATH = USER_PREFIX_PATH + "/error";

export const LEFT_MAIN_MENU: Record<USER_ROLE, string[]> = {
  [USER_ROLE.Admin] : [
    DASHBOARD_PATH,
    TASK_LIST_PATH,
    VIRTUAL_PATROL_PATH,
    PATROL_LIST_PATH,
    REPORT_PATH,
    SETTINGS_PATH
  ],
  [USER_ROLE.Officer] : [
    TASK_LIST_PATH,
    VIRTUAL_PATROL_PATH,
    PATROL_LIST_PATH
  ],
  [USER_ROLE.Client] : [
    DASHBOARD_PATH,
    REPORT_PATH
  ]
};

export type RouteInfo = {
  path: string;
  title: string;
  Icon: JSX.Element;
};

export const ROUTE_PATH_INFO: Record<string, RouteInfo> = {
  [DASHBOARD_PATH] : {
    path : DASHBOARD_PATH,
    title : "Analytics",
    Icon : <DashboardIcon />
  },
  [VIRTUAL_PATROL_PATH] : {
    path : VIRTUAL_PATROL_PATH,
    title : "Virtual Patrol",
    Icon : <VirtualPatrolIcon />
  },
  [PATROL_LIST_PATH] : {
    path : PATROL_LIST_PATH,
    title : "Patrol List",
    Icon : <PatrolListIcon />
  },
  [TASK_LIST_PATH] : {
    path : TASK_LIST_PATH,
    title : "Task List",
    Icon : <TaskListIcon />
  },
  [REPORT_PATH] : {
    path : REPORT_PATH,
    title : "Reports",
    Icon : <ReportIcon />
  },
  [SETTINGS_PATH] : {
    path : SETTINGS_PATH,
    title : "Settings",
    Icon : <SettingsIcon />
  }
};

/**
 * Inital Selected Icons from iconsmind
 * ====================================
 * Dashboard - iconsmind-Dashboard
 * Virtual Patrol - iconsmind-Video-Tripod
 * Patrol List - iconsmind-Folder
 * Task List - iconsmind-Bookmark
 * Settings - iconsmind-Gear
 * Routes - iconsmind-Digital-Drawing
 */
