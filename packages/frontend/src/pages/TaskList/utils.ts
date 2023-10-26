import _ from "lodash";

import { TaskStatus } from "@vps/utils/lib/data";
import { RouteTaskResponse } from "@vps/utils/lib/dto";

export const getDayNightTasks = (data : RouteTaskResponse[]) : {
  dayShift: RouteTaskResponse[];
  nightShift: RouteTaskResponse[];
} => {
  const transformedTasks = data.map((item : RouteTaskResponse) => {
    if (item.status === TaskStatus.Missed || item.status === TaskStatus.Incomplete) {
      return {
        ...item,
        _isSelectable : true
      };
    }
    return {
      ...item,
      _isSelectable : false
    };
  });

  return getDayAndNightShiftTasks(transformedTasks);
};

export const getDayAndNightShiftTasks = (allTasks : RouteTaskResponse[]) : { dayShift : RouteTaskResponse[]; nightShift : RouteTaskResponse[] } => {
  const dayShiftTasks = _.filter(allTasks, (item : RouteTaskResponse) => {
    const firstWord = item.name.split(" ")[0];
    return !firstWord?.toLowerCase()?.includes("night");
  });

  const nightShiftTasks = _.filter(allTasks, (item : RouteTaskResponse) => {
    const firstWord = item.name.split(" ")[0];
    return firstWord?.toLowerCase()?.includes("night");
  });

  return {
    dayShift : dayShiftTasks,
    nightShift : nightShiftTasks
  };
};

export const AllowStartedStatuses = [
  TaskStatus.Pending,
  TaskStatus.NotStarted,
  TaskStatus.Paused
];