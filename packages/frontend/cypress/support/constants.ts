const LOCAL_STORAGE_AUTH_KEY = "auth_info";

const APP_BASE_URL = "http://localhost:3006/vps";
const API_BASE_URL = "http://localhost:9000/apis";
const LOGIN_PATH = `${APP_BASE_URL}/user/login`;
const LOGOUT_PATH = `${APP_BASE_URL}/app/user/logout`;
const ANALYTICS_PATH = `${APP_BASE_URL}/app/dashboard`;
const TASK_LIST_PATH = `${APP_BASE_URL}/app/tasks`;
const VIRTUAL_PATROL_PATH = `${APP_BASE_URL}/app/virtual-patrol`;
const PATROL_LIST_PATH = `${APP_BASE_URL}/app/patrols`;
const CREATE_PATROL_PATH = `${APP_BASE_URL}/app/patrols/create`;
const REPORTS_PATH = `${APP_BASE_URL}/app/reports`;
const REPORT_PATROL_DETAILS_PATH = (id : string) : string => `${APP_BASE_URL}/app/reports/${id}`;
const REPORT_DAILY_DETAILS_PATH = (id : string) : string => `${APP_BASE_URL}/app/reports/daily-report/${id}`;
const REPORT_MONTHLY_DETAILS_PATH = (id : string) : string => `${APP_BASE_URL}/app/reports/monthly-report/${id}`;
const SETTINGS_PATH = `${APP_BASE_URL}/app/settings`;

const CYPRESS_SELECTORS = {
  pageHeaderTitleSelector : "page-header-title",
  appReturnToPrevPage : "app__btn-return-prev-page",
  appHeaderTabs : "page-header-tabs",
  tableDateRangePickerSelector : "table__date-range-picker"
};

const USER_CONSTANTS = {
  crendentials : {
    admin : {
      username : "huydang@vps.com",
      password : "admin"
    },
    officer : {
      username : "officer@gmail.com",
      password : "admin"
    },
    client : {
      username : "client@gmail.com",
      password : "admin"
    }
  },
  sidebar : {
    admin : [
      {
        label : "Analytics",
        path : ANALYTICS_PATH
      },
      {
        label : "Task List",
        path : TASK_LIST_PATH
      },
      {
        label : "Virtual Patrol",
        path : VIRTUAL_PATROL_PATH
      },
      {
        label : "Patrol List",
        path : PATROL_LIST_PATH
      },
      {
        label : "Reports",
        path : REPORTS_PATH
      },
      {
        label : "Settings",
        path : SETTINGS_PATH
      }
    ],
    officer : [
      {
        label : "Task List",
        path : TASK_LIST_PATH
      },
      {
        label : "Virtual Patrol",
        path : VIRTUAL_PATROL_PATH
      },
      {
        label : "Patrol List",
        path : PATROL_LIST_PATH
      }
    ],
    client : [
      {
        label : "Analytics",
        path : ANALYTICS_PATH
      },
      {
        label : "Reports",
        path : REPORTS_PATH
      }
    ]
  }
};

// Task list
const TASK_LIST_DAILY_COLUMNS = ["Start—End Time",
  "Patrol Name",
  "Assignees",
  "Site Name",
  "Status",
  "Record Reason"];
const TASK_LIST_MONTHLY_COLUMNS = ["Start—End Time",
  "Patrol Name",
  "Assignees",
  "Site Name",
  "Status"];
const VIRTUAL_PATROL_COLUMNS = ["Start — End time",
  "Name",
  "Site",
  "Status",
  "Action"];
const PATROL_LIST_COLUMNS = ["Patrol Name",
  "Site Name",
  "Created by",
  "Created On",
  "Assignees",
  "Action"];
const REPORT_PATROL_LIST_COLUMNS = ["Date Completed",
  "Patrol Route Name",
  "Site",
  "Start",
  "Shift",
  "Assignees",
  "Status",
  "View Report"];
const REPORT_DAILY_COLUMNS = ["Date",
  "Site Name",
  "View Report"];
const REPORT_MONTHLY_COLUMNS = ["Month",
  "Site Name",
  "View Report"];
const REPORT_COMPLETE_PATROL_COLUMNS = [
  "S/N",
  "Camera",
  "Fault Detected ?",
  "Screenshot",
  "Alert/Cmt",
  "Action taken",
  "Time completed",
  "Completed by"
];
const USERS_LIST_COLUMNS = [
  "Username",
  "Last Active",
  "Role",
  "Status",
  "Action"
];
const CAMERAS_LIST_COLUMNS = [
  "Camera",
  "ID",
  "Site",
  "SOP",
  "Action"
];
const SITES_LIST_COLUMNS = [
  "Site No.",
  "Site Name",
  "Description",
  "No. of cameras",
  "Action"
];
const ALERT_TYPES_LIST_COLUMNS = [
  "Alert Type",
  "Description",
  "Action Taken",
  "Action"
];
const GENERAL_SOP_LIST_COLUMNS = [
  "SOP Name",
  "SOP Checklists",
  "Date Created",
  "Action"
];
const SPECIAL_SOP_LIST_COLUMNS = [
  "SOP Name",
  "Start Date",
  "End Date",
  "SOP Checklists",
  "Date Created",
  "Action"
];

export {
  CYPRESS_SELECTORS,

  API_BASE_URL,

  LOGIN_PATH,
  LOGOUT_PATH,
  ANALYTICS_PATH,
  TASK_LIST_PATH,
  VIRTUAL_PATROL_PATH,
  PATROL_LIST_PATH,
  CREATE_PATROL_PATH,
  REPORTS_PATH,
  REPORT_PATROL_DETAILS_PATH,
  REPORT_DAILY_DETAILS_PATH,
  REPORT_MONTHLY_DETAILS_PATH,
  SETTINGS_PATH,
  LOCAL_STORAGE_AUTH_KEY,
  USER_CONSTANTS,

  // Task list
  TASK_LIST_DAILY_COLUMNS,
  TASK_LIST_MONTHLY_COLUMNS,

  // Patrolling
  VIRTUAL_PATROL_COLUMNS,

  // Patrols List
  PATROL_LIST_COLUMNS,

  // Report
  REPORT_PATROL_LIST_COLUMNS,
  REPORT_DAILY_COLUMNS,
  REPORT_MONTHLY_COLUMNS,
  REPORT_COMPLETE_PATROL_COLUMNS,

  // Settings
  USERS_LIST_COLUMNS,
  CAMERAS_LIST_COLUMNS,
  SITES_LIST_COLUMNS,
  ALERT_TYPES_LIST_COLUMNS,
  GENERAL_SOP_LIST_COLUMNS,
  SPECIAL_SOP_LIST_COLUMNS
};
