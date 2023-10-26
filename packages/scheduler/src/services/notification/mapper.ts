import {
  RouteTask,
  Site
} from "entities";
import {
  RouteTaskNotificationData,
  SiteNotificationData
} from "@vps/utils/lib/dto/app-notification";

export const getRouteTaskNotificationData = (task : RouteTask) : RouteTaskNotificationData => {
  if (!task) return null;
  const {
    id,
    name,
    occurrenceDate,
    startTime,
    endTime
  } = task;

  return {
    id,
    name,
    occurrenceDate,
    startTime,
    endTime
  };
};

export const getSiteNotificationData = (site : Site) : SiteNotificationData => {
  if (!site) return null;
  const {
    id,
    name
  } = site;

  return {
    id,
    name
  };
};

