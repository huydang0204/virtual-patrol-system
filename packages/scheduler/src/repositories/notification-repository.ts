import {
  AppDataSource,
  AppNotification 
} from "entities";

export const NotificationRepository = AppDataSource.getRepository(AppNotification).extend({});