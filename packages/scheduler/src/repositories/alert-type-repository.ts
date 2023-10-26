
import {
  AppDataSource,
  AlertType
} from "entities";

export const AlertTypeRepository = AppDataSource.getRepository(AlertType).extend({});