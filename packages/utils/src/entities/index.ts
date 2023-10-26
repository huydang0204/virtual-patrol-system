import { DataSource } from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";

import { Camera } from "./Camera";
import { Role } from "./Role";
import { User } from "./User";
import { Activity } from "./Activity";
import { AlertType } from "./AlertType";
import { ForgetPassword } from "./ForgetPassword";
import { Tag } from "./Tag";
import { TaskReport } from "./TaskReport";
import { Route } from "./Route";
import { RouteCheckpoint } from "./RouteCheckpoint";
import { RouteSchedule } from "./RouteSchedule";
import { RouteTask } from "./RouteTask";
import { Site } from "./Site";
import { Sop } from "./Sop";
import { TaskDailyReport } from "./TaskDailyReport";
import { TaskMonthlyReport } from "./TaskMonthlyReport";
import { AppNotification } from "./AppNotification";
import { DashboardAnalytics } from "./DashboardAnalytics";

type TransactionCallback<T> = (entityManager: EntityManager) => Promise<T>;

const transaction = async <T>(datasource : DataSource, callback : TransactionCallback<T>) : Promise<T> => {
  let result : T = null;
  try {
    result = await datasource.transaction(callback);
  } catch (e) {
    console.log("[vps-utils] DataSource transaction failed", e);
  }
  return result;
};

export {
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
