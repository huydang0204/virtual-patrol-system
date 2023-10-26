import {
  AppDataSource,
  Site
} from "entities";

export const SiteRepository = AppDataSource.getRepository(Site).extend({});