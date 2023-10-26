import { NotificationStatus } from "@vps/utils/lib/data";
import {
  AppDataSource,
  AppNotification
} from "entities";
import {
  FindManyOptions,
  FindOptionsWhere
} from "typeorm";

export const NotificationRepository = AppDataSource.getRepository(AppNotification).extend({

  async findAndCountWithOptions(userId: string, limit: number, offset: number): Promise<[AppNotification[], number]> {
    const whereClauses: FindOptionsWhere<AppNotification> = {};

    if (!!userId) {
      whereClauses["alertedUserId"] = userId;
    }
    const options: FindManyOptions<AppNotification> = { where : whereClauses };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    options["order"] = { createdAt : "DESC" };
    return await NotificationRepository.findAndCount(options);
  },
  async countWithOptions(userId:string): Promise<[number, number]> {
    const countNew = await NotificationRepository.countBy({
      alertedUserId : userId,
      status : NotificationStatus.New
    });

    const countRead = await NotificationRepository.countBy({
      alertedUserId : userId,
      status : NotificationStatus.Read
    });
    return [countNew,
      countRead];
  }
});
