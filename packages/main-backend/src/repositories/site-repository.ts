import {
  AppDataSource,
  Site
} from "entities";
import {
  FindManyOptions,
  FindOptionsWhere,
  ILike
} from "typeorm";

export const SiteRepository = AppDataSource.getRepository(Site).extend({

  async findAndCountWithOptions(
    limit: number,
    offset: number,
    searchText: string
  ): Promise<[Site[], number]> {
    const whereClauses: FindOptionsWhere<Site> = { deleted : false };
    if (!!searchText) {
      whereClauses["name"] = ILike(`%${searchText}%`);
    }
    const options: FindManyOptions<Site> = {
      where : whereClauses,
      relations : { cameras : true },
      order : { createdAt : "DESC" }
    };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    return await SiteRepository.findAndCount(options);
  },
  async countWithOption(searchText:string): Promise<number> {

    const whereClauses: FindOptionsWhere<Site> = { deleted : false };
    if (!!searchText) {
      whereClauses["name"] = ILike(`%${searchText}%`);
    }
    const options: FindManyOptions<Site> = { where : whereClauses };
    return await SiteRepository.count(options);
  }
});