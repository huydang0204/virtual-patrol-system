import {
  apiDeleteAllNotis,
  apiDeleteNotiById,
  apiGetNotifications, apiGetNotificationsCount, apiReadNotiById, apiReadNotifications
} from "apis/notification-api";
import {
  AppNotificationResponse, NotificationCountResponse
} from "@vps/utils/lib/dto";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import { ServiceResponse } from "model-type/service";

export enum NotiError {
  InvalidId = "InvalidId",
  Unknown = "Unknown",
}

export const fetchNotifications = async (): Promise<FindAndCountResponse<AppNotificationResponse>> => {
  const {
    data,
    error
  } = await apiGetNotifications();

  if (!error && data) return data;
};

export const fetchNotificationsCount = async (): Promise<NotificationCountResponse> => {
  const {
    data, error
  } = await apiGetNotificationsCount();

  if (!error && data) return data;
};

export const readNotifications = async () : Promise<ServiceResponse<boolean, NotiError>> => {
  let errors = {} as Record<NotiError, boolean>;
  const {
    data,
    error
  } = await apiReadNotifications();

  let result = false;
  if (data && !error) {
    errors = null;
    result = true;
  }

  return {
    data : result,
    errors
  };
};

export const readNotiById = async (notiId : string) : Promise<ServiceResponse<boolean, NotiError>> => {
  let errors = {} as Record<NotiError, boolean>;
  const invalidId = !notiId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiReadNotiById(notiId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[NotiError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const deleteNotiById = async (notiId : string) : Promise<ServiceResponse<boolean, NotiError>> => {
  let errors = {} as Record<NotiError, boolean>;
  const invalidId = !notiId;

  let result = false;
  if (!invalidId) {
    const {
      data,
      error
    } = await apiDeleteNotiById(notiId);
    if (data && !error) {
      errors = null;
      result = true;
    }
  } else {
    errors[NotiError.InvalidId] = invalidId;
  }

  return {
    data : result,
    errors
  };
};

export const deleteAllNotis = async () : Promise<ServiceResponse<boolean, NotiError>> => {
  let errors = {} as Record<NotiError, boolean>;

  let result = false;
  const {
    data,
    error
  } = await apiDeleteAllNotis();

  if (data && !error) {
    errors = null;
    result = true;
  }

  return {
    data : result,
    errors
  };
};