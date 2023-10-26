import { DataSource } from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { configuration } from "config";
import { logger } from "services/logger";

import {
  Camera,
  Tag,
  Activity,
  AlertType,
  User,
  Role,
  ForgetPassword,
  Route,
  RouteCheckpoint,
  TaskReport,
  RouteSchedule,
  RouteTask,
  Site,
  Sop,
  TaskDailyReport,
  TaskMonthlyReport,
  AppNotification,
  DashboardAnalytics
} from "@vps/utils/lib/entities";

const prodMode = configuration.productionMode || configuration.testMode;
const AppDataSource = new DataSource({
  type : "postgres",
  host : configuration.dbConnection,
  port : parseInt(configuration.dbPort as string),
  username : configuration.dbUsername,
  password : configuration.dbPassword,
  database : configuration.dbName,
  synchronize : !prodMode,
  logging : !prodMode,
  migrationsRun : prodMode,
  migrations : (prodMode) ? ["dist/migrations/*.js"] : ["src/migrations/*.ts"],
  entities : [
    Camera,
    Tag,
    Activity,
    AlertType,
    User,
    Role,
    ForgetPassword,
    Route,
    RouteCheckpoint,
    TaskReport,
    RouteSchedule,
    RouteTask,
    Site,
    Sop,
    TaskDailyReport,
    TaskMonthlyReport,
    AppNotification,
    DashboardAnalytics
  ]
});

type TransactionCallback<T> = (entityManager : EntityManager) => Promise<T>;

const transaction = async <T>(callback : TransactionCallback<T>) : Promise<T> => {
  let result : T = null;
  try {
    result = await AppDataSource.transaction(callback);
  } catch (e) {
    logger.error("[entities] Transaction failed:", e);
  }
  return result;
};

export {
  AppDataSource,
  transaction,
  Camera,
  Tag,
  Activity,
  AlertType,
  User,
  Role,
  ForgetPassword,
  Route,
  RouteCheckpoint,
  TaskReport,
  RouteSchedule,
  RouteTask,
  Site,
  Sop,
  TaskDailyReport,
  TaskMonthlyReport,
  AppNotification,
  DashboardAnalytics
};
