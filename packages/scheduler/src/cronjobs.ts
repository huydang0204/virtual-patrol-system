import Cron from "node-cron";
import {
  addDays,
  endOfDay,
  startOfDay,
  subDays
} from "date-fns";
import { configuration } from "config";
import { AppDataSource } from "entities";

import mqttService from "services/mqtt";
import { logger } from "services/logger";
import { loginNxWitness } from "services/thirdparty/nxWitness";
import { redisClient } from "services/thirdparty/redis";
import { syncCameras } from "services/camera";
import {
  generateTask,
  updateTaskStatus,
  generateTaskDailyReport,
  generateTaskMonthlyReport,
  generateInComingTaskNotification
} from "services/task";
import { generateDashboardAnalytics } from "services/dashboard-analytics";
import { updateUserStatus } from "services/user";
import { cleanUpOldData } from "services/system";
import { DashboardAnalyticsType } from "@vps/utils/lib/data";

export class CronJobs {
  public nxToken : string;

  constructor() {
    this.nxToken = "";
  }

  async updateNxToken() : Promise<void> {
    // call login nx api and store it
    const username = configuration.nxWitnessUsername as string;
    const password = configuration.nxWitnessPassword as string;
    const loginResponse = await loginNxWitness(username, password);
    if (!!loginResponse.data) {
      const nowMillis = new Date().valueOf();
      const nowSeconds = Math.floor(nowMillis / 1000);
      this.nxToken = loginResponse.data.token;

      // cache for main backend usage
      const redisTokenKey = configuration.redisKeyNxToken;
      await redisClient.set(redisTokenKey, this.nxToken);
      await redisClient.expire(redisTokenKey, nowSeconds + 60 * 60 * 24);
    } else {
      logger.error("[CronJobs] Retrieve Token failed");
    }
  }

  async syncCamerasFromVMS() : Promise<void> {
    if (!this.nxToken) {
      await this.updateNxToken();
    }
    await syncCameras(this.nxToken);
  }

  public async start() : Promise<void> {
    await AppDataSource.initialize();
    await mqttService.connect();
    logger.info(`[CronJobs-${ configuration.env }] VPS Scheduler is running.`);

    // run at the beginning of application
    await this.updateNxToken();
    const _0amJob = Cron.schedule("0 0 * * *", async () => {
      await this.updateNxToken();
    });
    _0amJob.start();

    await this.syncCamerasFromVMS();
    const _30minutesJobExp = "0,15,30,45 * * * *";
    const _30minutesJob = Cron.schedule(_30minutesJobExp, async () => {
      await this.syncCamerasFromVMS();
    });
    _30minutesJob.start();

    const _5minutesJobExp = "0,5,10,15,20,25,30,35,40,45,50,55 * * * *";
    const _5minutesJob = Cron.schedule(_5minutesJobExp, async () => {
      const executeTime = new Date();
      await updateTaskStatus(executeTime);
      await generateInComingTaskNotification(executeTime);
    });
    _5minutesJob.start();

    const _1hourJobExp = "1 * * * *";
    const _1hourJob = Cron.schedule(_1hourJobExp, async () => {
      const executeTime = new Date();
      await updateUserStatus(executeTime);
    });
    _1hourJob.start();

    const _11pmJobExp = "59 22 * * *";
    const _11pmJob = Cron.schedule(_11pmJobExp, async () => {
      const nextDate = startOfDay(addDays(new Date(), 1));
      await generateTask(nextDate);
    });
    _11pmJob.start();

    const _endDayJob = Cron.schedule("59 23 * * *", async () => {
      const reportGeneratedDate = new Date(); // end of day
      await generateTaskDailyReport(reportGeneratedDate);
    });
    _endDayJob.start();

    const _firstDayOfMonthJob = Cron.schedule("0 0 1 * *", async () => {
      const generatedDate = endOfDay(subDays(new Date(), 1)); // end of last month

      await generateTaskMonthlyReport(generatedDate);
      await generateDashboardAnalytics(generatedDate, DashboardAnalyticsType.Monthly);

      await cleanUpOldData();
    });
    _firstDayOfMonthJob.start();

    const _endOfSaturdayJob = Cron.schedule("59 23 * * 6", async () => {
      // Your code to run at the start of every Sunday goes here
      const generatedDate = new Date();
      await generateDashboardAnalytics(generatedDate, DashboardAnalyticsType.Weekly);
    });
    _endOfSaturdayJob.start();
  }
}

export default new CronJobs();
