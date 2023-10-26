import {
  AppDataSource,
  Role
} from "entities";

export const RoleRepository = AppDataSource.getRepository(Role).extend({});