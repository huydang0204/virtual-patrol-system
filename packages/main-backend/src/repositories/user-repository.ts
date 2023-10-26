import {
  AppDataSource,
  ForgetPassword,
  User
} from "entities";
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  In,
  Not
} from "typeorm";
import {
  UserRole,
  UserStatus
} from "@vps/utils/lib/data";

export const UserRepository = AppDataSource.getRepository(User).extend({
  getUserByNxWitness(nxWitnessId : string, withRole : boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("user.nxWitnessId = :nxWitnessId", { nxWitnessId });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getOne();
  },
  getUserByName(name : string, withRole : boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("name ILIKE :name", { name : `%${ name }%` });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getOne();
  },
  getUsersByName(name : string, withRole : boolean) {
    const queryBuilder = this.createQueryBuilder("user")
      .where("name ILIKE :name", { name : `%${ name }%` });
    if (withRole) {
      queryBuilder.leftJoinAndSelect("user.role", "role");
    }

    return queryBuilder.getMany();
  },
  async findAndCountWithOptions(
    ids : string,
    searchText : string,
    limit : number,
    offset : number,
    reqFilterRoles : UserRole[],
    withBlockedUsers : boolean
  ) {

    const whereClauses : FindOptionsWhere<User> = {};
    if (!!ids) {
      const idList = ids.split(",");
      whereClauses["id"] = In(idList);
    }
    if (!!reqFilterRoles && reqFilterRoles.length > 0) {
      whereClauses["role"] = { name : In(Object.values(reqFilterRoles)) };
    }
    if (!withBlockedUsers) {
      whereClauses["status"] = Not(UserStatus.blocked);
    }

    let where : FindOptionsWhere<User> | FindOptionsWhere<User>[];
    if (!!searchText) {
      where = new Array(2);

      const searchPattern = ILike(`%${ searchText }%`);
      where[0] = {
        ...whereClauses,
        name : searchPattern
      };
      where[1] = {
        ...whereClauses,
        email : searchPattern
      };
    } else {
      where = { ...whereClauses };
    }

    const options : FindManyOptions<User> = {
      where,
      relations : { role : true },
      order : { createdAt : "DESC" }
    };

    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }

    return await UserRepository.findAndCount(options);
  }
});

export const ForgetPasswordRepository = AppDataSource.getRepository(ForgetPassword).extend({});
