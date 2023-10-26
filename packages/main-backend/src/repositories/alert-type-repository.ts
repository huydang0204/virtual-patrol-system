import {
  AppDataSource,
  AlertType
} from "entities";
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike
} from "typeorm";

export const AlertTypeRepository = AppDataSource.getRepository(AlertType).extend({

  async findAndCountWithOptions(
    limit : number,
    offset : number,
    searchText : string
  ) : Promise<[AlertType[], number]> {
    const whereClauses : FindOptionsWhere<AlertType> = {};
    if (!!searchText) {
      whereClauses["type"] = ILike(`%${ searchText }%`);
    }
    const options : FindManyOptions<AlertType> = {
      where : whereClauses,
      order : { createdAt : "DESC" }
    };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    return await AlertTypeRepository.findAndCount(options);
  },
  async countWithOption(searchText : string) : Promise<number> {
    const whereClauses : FindOptionsWhere<AlertType> = {};
    if (!!searchText) {
      whereClauses["type"] = ILike(`%${ searchText }%`);
    }
    const options : FindManyOptions<AlertType> = { where : whereClauses };
    return await AlertTypeRepository.count(options);
  }
});
