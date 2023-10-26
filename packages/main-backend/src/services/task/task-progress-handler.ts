import { In } from "typeorm";

import { RouteTaskRepository } from "repositories";

import { TaskStatus } from "@vps/utils/lib/data";
import { logger } from "services/logger";
import { RouteTask } from "entities";

class TaskProgressHandler {
  private readonly onGoingTaskIdsMap : Record<string, number>;
  private handleTaskTimer : NodeJS.Timer;

  // key: task id, value: last updated milli that ongoing tasks are updated
  constructor() {
    logger.info("TaskProgressHandler constructed");
    this.onGoingTaskIdsMap = {};
  }

  public upsertOnGoingTask = (id : string, updatedMilli ?: number) : void => {
    this.onGoingTaskIdsMap[id] = updatedMilli || new Date().valueOf();
  };

  public deleteOnGoingTask = (id : string) : void => {
    if (!!this.onGoingTaskIdsMap[id]) {
      delete this.onGoingTaskIdsMap[id];
    }
  };

  private checkOnGoingTaskStatus = async () : Promise<void> => {
    const taskIds = Object.keys(this.onGoingTaskIdsMap);
    if (taskIds.length == 0) {
      return;
    }

    const nowMilli = new Date().valueOf();
    const pauseTaskIds : string[] = [];
    for (const taskId of taskIds) {
      const lastUpdatedMilli = this.onGoingTaskIdsMap[taskId];
      // if last updated was 5 minutes ago, mark this task as Paused
      if (nowMilli - lastUpdatedMilli >= 1000 * 60 * 5) {
        pauseTaskIds.push(taskId);
        delete this.onGoingTaskIdsMap[taskId];
      }
    }

    if (pauseTaskIds.length > 0) {
      await RouteTaskRepository.update({ id : In(pauseTaskIds) }, { status : TaskStatus.Paused });
    }
  };

  public initOnGoingTaskMap = () : void => {
    RouteTaskRepository.findBy({ status : TaskStatus.OnGoing }).then((ongoingTasks: RouteTask[]) => {
      if (!!ongoingTasks && ongoingTasks.length > 0) {
        const nowMilli = new Date().valueOf();
        ongoingTasks.forEach((aTask : RouteTask) => this.upsertOnGoingTask(aTask.id, nowMilli));
      }
    });

    this.handleTaskTimer = setInterval(() => {
      this.checkOnGoingTaskStatus();
    }, 1000 * 60);
  };
}

export default new TaskProgressHandler();
