import { subDays } from "date-fns";
import { AlertTypeRepository } from "repositories/alert-type-repository";
import {
  RouteCheckpointRepository,
  RouteRepository,
  RouteScheduleRepository
} from "repositories/route-repository";
import { SopRepository } from "repositories/sop-repository";
import { UserRepository } from "repositories/user-repository";
import {
  In,
  LessThan
} from "typeorm";
import fs from "fs";
import {
  User,
  AlertType,
  Route,
  RouteTask,
  Site
} from "entities";
import {
  RouteTaskRepository,
  TaskReportRepository,
  SiteRepository,
  CameraRepository
} from "repositories";
import { configuration } from "config";

export const cleanUpOldData = async () : Promise<void> => {
  const now = new Date();
  const ninetyDays = subDays(now, 90);

  const routes = await RouteRepository.find({
    where : { deletedAt : LessThan(ninetyDays) },
    withDeleted : true
  });
  const routeIds = routes.map((route : Route) => route.id);
  await RouteCheckpointRepository.delete({ routeId : In(routeIds) });
  await RouteScheduleRepository.delete({ routeId : In(routeIds) });

  const tasks = await RouteTaskRepository.find({ where : { routeId : In(routeIds) } });
  const taskIds = tasks.map((task: RouteTask) => task.id);
  await TaskReportRepository.delete({ task : { id : In(taskIds) } });
  await RouteTaskRepository.delete({ id : In(taskIds) });

  await RouteRepository.delete({ id : In(routeIds) });

  const sites = await SiteRepository.find({
    where : { deletedAt : LessThan(ninetyDays) },
    withDeleted : true
  });
  const siteIds = sites.map((site : Site) => site.id);
  await CameraRepository.update({ siteId : In(siteIds) }, { siteId : "0" });
  await SiteRepository.delete({ id : In(siteIds) });

  const alertTypes = await AlertTypeRepository.find({
    where : { deletedAt : LessThan(ninetyDays) },
    withDeleted : true
  });
  const users = await UserRepository.find({
    where : { deletedAt : LessThan(ninetyDays) },
    withDeleted : true
  });
  await SopRepository.delete({ deletedAt : LessThan(ninetyDays) });

  const directoryPath = "/uploads/";
  users.forEach((user : User) => {
    const currentUrl = configuration.uploadFilePath + directoryPath + user.avatar;
    if (fs.existsSync(currentUrl)) {
      fs.unlinkSync(currentUrl);
    }
  });

  alertTypes.forEach((alertTypes : AlertType) => {
    const currentUrl = configuration.uploadFilePath + directoryPath + alertTypes.imageUrl;
    if (fs.existsSync(currentUrl)) {
      fs.unlinkSync(currentUrl);
    }
  });

  await AlertTypeRepository.delete({ deletedAt : LessThan(ninetyDays) });
  await UserRepository.delete({ deletedAt : LessThan(ninetyDays) });

  /* TODO:
      A. find records that have been DELETED for over 90 days (3 months)
        1. route
        2. site
        3. alert types
        4. users
        5. avatars/images of 3, 4, 5
        6. sops
      B. (confirm later) find AppNotification, Activity that have been CREATED for over 90 days (3 months)
  */
};
