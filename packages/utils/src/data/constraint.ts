export enum USER_ROLE {
  Admin = "Admin",
  Officer = "Officer",
  Client = "Client"
}

export const SYSTEM_ROLE_ID : Record<USER_ROLE, string> = {
  [USER_ROLE.Admin] : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
  [USER_ROLE.Officer] : "3579be74-c7d9-4a95-a962-2bd11f99add1",
  [USER_ROLE.Client] : "b5833bfd-ed88-4af7-8a85-718b5828d60a"
};

export const DEFAULT_SECOND = 0;
export const DEFAULT_ID = 0;
export const DEFAULT_BIGINT_ID = "0";
export const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export const REDIS_CACHING_EXPIRATION = 60 * 60 * 24; // 24 hours

export const RECEIVING_REPORT_EMAIL_ROLES = [
  SYSTEM_ROLE_ID.Admin,
  SYSTEM_ROLE_ID.Client
];

export enum TaskShift {
  Day = "Day",
  Night = "Night"
}