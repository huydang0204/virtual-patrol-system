import { NotificationRepository } from "repositories";
import { AppNotification } from "entities";
import {
  NotificationCountResponse,
  NotificationError
} from "@vps/utils/lib/dto/app-notification";
import {
  DeleteResponse,
  FindAndCountResponse,
  ServiceResponse,
  NotificationStatus
} from "@vps/utils/lib/data";

import {
  FindManyOptions,
  FindOptionsWhere
} from "typeorm";

const listNotifications = async (userId: string, limit: number, offset: number): Promise<FindAndCountResponse<AppNotification>> => {

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
  const [
    notifications,
    count
  ] = await NotificationRepository.findAndCount(options);
  return {
    data : notifications,
    count : count
  };
};
const readNotificationById = async (id: string, userId : string): Promise<ServiceResponse<boolean, NotificationError>> => {
  const checkedNotification = await NotificationRepository.findOneBy({
    id : id,
    alertedUserId : userId
  });

  if (!checkedNotification) {
    return { error : NotificationError.InvalidId };
  }
  checkedNotification.status= NotificationStatus.Read;
  await checkedNotification.save();
  return { data : true };
};

const readNotification = async (userId : string) : Promise<boolean> => {
  await NotificationRepository.update({
    alertedUserId : userId,
    status : NotificationStatus.New
  }, { status : NotificationStatus.Read });
  return true;
};

const countNotification = async (userId: string): Promise<NotificationCountResponse> => {
  const [countNew,
    countRead] = await NotificationRepository.countWithOptions(userId);

  return {
    countNew : countNew,
    countRead : countRead
  };
};

const deleteNotificationById = async (
  id : string,
  userId : string
) : Promise<ServiceResponse<boolean, NotificationError>> => {
  const checkedNotification = await AppNotification.findOneBy({ id });
  if (!checkedNotification || checkedNotification.alertedUserId != userId) {
    return { error : NotificationError.InvalidId };
  }

  await NotificationRepository.delete({ id });
  return { data : true };
};

const deleteAllNotifications = async (userId : string) : Promise<DeleteResponse> => {
  const result = await NotificationRepository.delete({ alertedUserId : userId });
  return { deletedCount : result.affected };
};
export {
  listNotifications,
  readNotification,
  readNotificationById,
  deleteNotificationById,
  deleteAllNotifications,
  countNotification
};
