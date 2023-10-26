import {
  AppDataSource,
  Camera
} from "entities";

export const CameraRepository = AppDataSource.getRepository(Camera).extend({});