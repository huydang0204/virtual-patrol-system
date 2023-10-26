import {
  AppDataSource,
  Route,
  RouteCheckpoint,
  RouteSchedule
} from "entities";
import {
  LessThanOrEqual,
  MoreThan,
  Not
} from "typeorm";

export const RouteRepository = AppDataSource.getRepository(Route).extend({});

export const RouteCheckpointRepository = AppDataSource.getRepository(RouteCheckpoint).extend({});

export const RouteScheduleRepository = AppDataSource.getRepository(RouteSchedule).extend({
  async getSchedulesOfDate(occurrenceDate : Date) {
    return await RouteSchedule.find({
      where : [
        {
          startOccurrenceDate : LessThanOrEqual(occurrenceDate),
          endOccurrenceDate : Not(MoreThan(occurrenceDate))
        },
        {
          startOccurrenceDate : LessThanOrEqual(occurrenceDate),
          endOccurrenceDate : null
        }
      ],
      relations : { route : true }
    });
  }
});