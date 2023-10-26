import {
  startOfDay,
  endOfDay
} from "date-fns";
import {
  AppDataSource,
  Route,
  RouteCheckpoint,
  RouteSchedule
} from "entities";
import {
  FindOptionsWhere,
  ILike,
  Between,
  FindManyOptions
} from "typeorm";
import { SiteRepository } from "./site-repository";

export const RouteRepository = AppDataSource.getRepository(Route).extend({
  async findAndCountWithOptions(
    limit: number,
    offset: number,
    createdDateFrom: string,
    createdDateTo: string,
    searchText: string,
    exactSearch: boolean
  ): Promise<[Route[], number]> {
    const whereClauses: FindOptionsWhere<Route> = { deleted : false };
    if (!!searchText) {
      const site = await SiteRepository.findOneBy({ name : ILike(`%${searchText}%`) });
      if (site) {
        whereClauses["siteId"] = site.id;
      } else {
        whereClauses["name"] = exactSearch ? searchText : ILike(`%${searchText}%`);
      }

    }
    if (!!createdDateFrom) {
      const from = new Date(createdDateFrom);
      const to = !!createdDateTo ? new Date(createdDateTo) : new Date();
      whereClauses["createdAt"] = Between(startOfDay(from), endOfDay(to));
    }
    const options: FindManyOptions<Route> = {
      where : whereClauses,
      relations : {
        site : true,
        assignedUsers : true,
        createdUser : true
      }
    };
    if (limit != undefined && offset != undefined) {
      options["skip"] = offset;
      options["take"] = limit;
    }
    options["order"] = { createdAt : "DESC" };

    return await RouteRepository.findAndCount(options);
  },
  async countWithOptions(
    createdDateFrom: string,
    createdDateTo: string,
    searchText: string,
    exactSearch: boolean
  ): Promise<number> {
    const whereClauses: FindOptionsWhere<Route> = { deleted : false };
    if (!!createdDateFrom) {
      const from = new Date(createdDateFrom);
      const to = !!createdDateTo ? new Date(createdDateTo) : new Date();
      whereClauses["createdAt"] = Between(startOfDay(from), endOfDay(to));
    }
    if (!!searchText) {
      whereClauses["name"] = exactSearch ? searchText : ILike(`%${searchText}%`);
    }
    const options: FindManyOptions<Route> = { where : whereClauses };
    return await RouteRepository.count(options);
  }
});
export const RouteCheckpointRepository = AppDataSource.getRepository(RouteCheckpoint).extend({});
export const RouteScheduleRepository = AppDataSource.getRepository(RouteSchedule).extend({});
