import { addMinutes } from "date-fns";
import { In } from "typeorm";
import { configuration } from "config";

import { UserRepository } from "repositories";
import { UserStatus } from "@vps/utils/lib/data";

const updateUserStatus = async (executeTime : Date) : Promise<void> => {
  const activeUsers = await UserRepository.findBy({ status : UserStatus.active });
  if (!!activeUsers && activeUsers.length > 0) {
    const inactiveUserIds : string[] = [];
    for (const user of activeUsers) {
      const {
        id,
        latestLogin
      } = user;

      if (!latestLogin || executeTime > addMinutes(latestLogin, parseInt(configuration.jwtExpireMinutes))) {
        inactiveUserIds.push(id);
      }
    }
    if (inactiveUserIds.length > 0) {
      await UserRepository.update({ id : In(inactiveUserIds) }, { status : UserStatus.inactive });
    }
  }
};

export { updateUserStatus };
