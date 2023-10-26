import {
  AppDataSource,
  Sop
} from "entities";
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike
} from "typeorm";
import { SopType } from "@vps/utils/lib/data";

export const SopRepository = AppDataSource.getRepository(Sop).extend({
  async findAndCountWithOptions(
    limit : number,
    offset : number,
    searchText : string,
    type : SopType
  ) : Promise<[Sop[], number]> {
    const whereClauses : FindOptionsWhere<Sop> = {};
    if (!!searchText) {
      const searchPattern = ILike(`%${ searchText }%`);
      whereClauses["name"] = searchPattern;
    }
    if (!!type) {
      whereClauses["type"] = type;
    }
    const options : FindManyOptions<Sop> = { where : whereClauses };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }

    return await SopRepository.findAndCount(options);
  },

  async countByType() : Promise<Record<SopType, number>> {
    const [
      general,
      special
    ] = await Promise.all([
      SopRepository.count({ where : { type : SopType.General } }),
      SopRepository.count({ where : { type : SopType.Special } })
    ]);

    return {
      [SopType.General] : general,
      [SopType.Special] : special
    };
  }
});
