
import {
  AppDataSource,
  Sop
} from "entities";

export const SopRepository = AppDataSource.getRepository(Sop).extend({});