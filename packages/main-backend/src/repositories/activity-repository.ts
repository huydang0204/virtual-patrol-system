import { ActivityType } from "@vps/utils/lib/data";
import {
  endOfDay,
  startOfDay
} from "date-fns";
import {
  Activity,
  AppDataSource
} from "entities";
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  In
} from "typeorm";

export const ActivityRepository = AppDataSource.getRepository(Activity).extend({

  async findAndCountWithOptions(
    limit: number,
    offset: number,
    userId: string,
    types: ActivityType[],
    from: Date,
    to: Date
  ): Promise<[Activity[], number]> {
    const whereClauses: FindOptionsWhere<Activity> = {};
    if (!!userId) {
      whereClauses["userId"] = userId;
    }
    if (!!from && !!to) {
      whereClauses["createdAt"] = Between(startOfDay(from), endOfDay(to));
    }
    if (!!types && types.length > 0) {
      whereClauses["type"] = In(types);
    }
    const options: FindManyOptions<Activity> = {
      where : whereClauses,
      order : { createdAt : "DESC" }
    };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    options["relations"] = { user : { role : true } };
    return await ActivityRepository.findAndCount(options);
  }
});
