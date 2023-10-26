import {
  apiGetUserActivities,
  apiNewActivity
} from "apis/activity-api";
import { 
  FindAndCountResponse,
  ActivityType 
} from "@vps/utils/lib/data";
import { UserActivityResponse } from "@vps/utils/lib/dto";
import { CalendarDateRange } from "model-type/component-style";
import { parseCalendarDateObjToISOTime } from "utils/time-format";

export const fetchRecentActivities = async (activityTypes ?: string[], limit ?: number, offset ?: number, dateRange ?: CalendarDateRange, userId ?: string) : Promise<FindAndCountResponse<UserActivityResponse>> => {
  const filteredDateRange = {
    from : "",
    to : ""
  };
  if (!!dateRange && dateRange.from && dateRange.to) {
    const _fromDate = dateRange.from;
    const _toDate = dateRange.to;
    filteredDateRange.from = parseCalendarDateObjToISOTime({
      day : _fromDate.day,
      month : _fromDate.month + 1,
      year : _fromDate.year
    });
    filteredDateRange.to = parseCalendarDateObjToISOTime({
      day : _toDate.day,
      month : _toDate.month + 1,
      year : _toDate.year
    });
  }

  const {
    data,
    error
  } = await apiGetUserActivities(activityTypes, limit, offset, userId, filteredDateRange);

  if (!error && data) return data;
};

export const logActivity = (type : ActivityType, targetName ?: string) : void => {
  apiNewActivity(type, targetName);
};