import {
  AppDataSource,
  ForgetPassword,
  User
} from "entities/index";
import {
  In,
  SelectQueryBuilder
} from "typeorm";

export const UserRepository = AppDataSource.getRepository(User).extend({
  getUserByNxWitness(nxWitnessId : string, withRole : boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("user.nxWitnessId = :nxWitnessId", { nxWitnessId });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getOne();
  },
  getUserByName(name: string, withRole: boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("concat(\"firstName\", ' ', \"lastName\") ILIKE :name", { name : `%${name}%` });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getOne();
  },
  getUsersByName(name: string, withRole: boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("concat(\"firstName\", ' ', \"lastName\") ILIKE :name", { name : `%${name}%` });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getMany();
  },
  getUsers(
    ids: string,
    searchText: string,
    limit: number,
    offset: number
  ) {
    let queryBuilder: SelectQueryBuilder<User> = this.SelectQueryBuilder("user");

    if (!!ids) {
      const idList = ids.split(",");
      //logger.info("in ids block");
      queryBuilder = queryBuilder.where({ id : In(idList) });

    }

    if (!!searchText) {
      queryBuilder.where("concat(\"firstName\", ' ', \"lastName\") ILIKE :searchText", { searchText : `%${searchText}%` })
        .orWhere("\"user\".id::text ILIKE :searchText ", { searchText : `%${searchText}%` });
    }

    if (!!limit) {
      queryBuilder.take(limit);
    }

    if (!!offset) {
      queryBuilder.skip(offset);
    }

    queryBuilder = queryBuilder.leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.position", "position")
      .leftJoinAndSelect("user.department", "department");

    return queryBuilder.getManyAndCount();
  }
});

export const ForgetPasswordRepository = AppDataSource.getRepository(ForgetPassword).extend({});
