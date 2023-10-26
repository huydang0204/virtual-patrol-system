import { RouteTaskResponse } from "@vps/utils/lib/dto";
import { DEFAULT_START_ALLOW_TIME_IN_SECOND } from "data/common-data";
import { checkDateTimeisXSecondsAway } from "utils/date-time";
import { TaskStatus } from "@vps/utils/lib/data";

export const getCanStartNowTasks = (todayTasksAssigned : RouteTaskResponse[] = []) : RouteTaskResponse[] => {
  const canStartNowTasks = todayTasksAssigned.filter((task : RouteTaskResponse) => {
    let canStartNow = false;
    if (task.status === TaskStatus.Pending) {
      canStartNow = checkDateTimeisXSecondsAway(new Date(task.occurrenceDate), task.startTime, task?.route.allowStartTime || DEFAULT_START_ALLOW_TIME_IN_SECOND);
    } else if (task.status === TaskStatus.NotStarted || task.status === TaskStatus.Paused) {
      canStartNow = true;
    }

    return canStartNow;
  });

  return canStartNowTasks;
};