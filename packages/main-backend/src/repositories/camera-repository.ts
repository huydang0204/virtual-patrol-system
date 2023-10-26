import {
  AppDataSource,
  Camera
} from "entities";
import {
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike
} from "typeorm";

export const CameraRepository = AppDataSource.getRepository(Camera).extend({

  async findAndCountWithOptions(
    searchText: string,
    siteId: string,
    limit: number,
    offset: number
  ): Promise<[Camera[], number]> {

    const options: FindManyOptions<Camera> = {
      relations : {
        site : true,
        sops : true
      },
      order : { name : "ASC" }
    };
    let whereClauses: FindOptionsWhere<Camera>[] | FindOptionsWhere<Camera> = null;
    if (!!searchText) {
      const searchPattern: FindOperator<string> = ILike(`%${searchText}%`);
      whereClauses = [
        { name : searchPattern },
        { site : { name : searchPattern } },
        { sops : { name : searchPattern } }
      ];
      if (!!siteId) {
        whereClauses = whereClauses.map((aClause: FindOptionsWhere<Camera>) => {
          if (!!aClause.site) return aClause;
          return {
            ...aClause,
            siteId
          };
        });
      }
    } else if (!!siteId) {
      whereClauses = { siteId };
    }

    if (!!whereClauses) {
      options["where"] = whereClauses;
    }
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    return await CameraRepository.findAndCount(options);

  }

});