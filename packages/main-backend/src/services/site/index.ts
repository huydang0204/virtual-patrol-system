import {
  CountResponse,
  FindAndCountResponse,
  ServiceResponse,
  DEFAULT_BIGINT_ID
} from "@vps/utils/lib/data";
import { In } from "typeorm";

import {
  CameraRepository,
  SiteRepository
} from "repositories";
import {
  Camera,
  Site
} from "entities";

import {
  SiteError,
  SiteResponse
} from "@vps/utils/lib/dto/site";
import { getSiteDto } from "services/site/mapper";
import { deleteRouteBySiteId } from "services/routes";

const listSites = async (
  limit : number,
  offset : number,
  searchText : string
) : Promise<FindAndCountResponse<SiteResponse>> => {

  const [
    sites,
    count
  ] = await SiteRepository.findAndCountWithOptions(
    limit,
    offset,
    searchText
  );

  let result : SiteResponse[] = [];
  if (!!sites) {
    result = sites.map((site : Site) => getSiteDto(site));
  }

  return {
    data : result,
    count,
    limit,
    offset
  };
};

const countSites = async (searchText : string) : Promise<CountResponse> => {

  const count = await SiteRepository.countWithOption(searchText);
  return { count };
};

const getSite = async (id : string) : Promise<SiteResponse> => {
  const site = await SiteRepository.findOne({
    where : { id },
    relations : { cameras : true }
  });
  return getSiteDto(site, undefined, true);
};

const createSite = async (
  name : string,
  description : string,
  cameraIds : string[]
) : Promise<SiteResponse> => {
  const site = await SiteRepository.save({
    name,
    description
  });
  let noCameras = 0;
  if (!!cameraIds) {

    if (cameraIds.length > 0) {
      const updateResult = await CameraRepository.update({ id : In(cameraIds) }, { siteId : site.id });
      noCameras = updateResult?.affected;
    }

  }
  return getSiteDto(site, noCameras);
};

const updateSite = async (
  id : string,
  name : string,
  description : string,
  cameraIds : string[]
) : Promise<ServiceResponse<SiteResponse, SiteError>> => {
  const site = await SiteRepository.findOne({
    where : { id },
    relations : { cameras : true }
  });
  if (!site || site.deleted) {
    return { error : SiteError.InvalidId };
  }

  site.name = name;
  site.description = description;
  const result = await SiteRepository.save(site);

  let noCameras = 0;
  if (!!cameraIds) {
    const prevAssignedCameraIds = site.cameras.map((camera : Camera) => camera.id);
    const unAssignedCameraIds = prevAssignedCameraIds.filter((id : string) => !cameraIds.includes(id));

    if (cameraIds.length > 0) {
      const updateResult = await CameraRepository.update({ id : In(cameraIds) }, { siteId : id });
      noCameras = updateResult?.affected;
    }
    if (unAssignedCameraIds.length > 0) {
      await CameraRepository.update({ id : In(unAssignedCameraIds) }, { siteId : DEFAULT_BIGINT_ID });
    }
  }

  return { data : getSiteDto(result, noCameras) };
};

const deleteSite = async (id : string) : Promise<ServiceResponse<SiteResponse, SiteError>> => {
  const site = await SiteRepository.findOneBy({ id });
  if (!site || site.deleted) {
    return { error : SiteError.InvalidId };
  }

  site.deletedAt = new Date();
  site.deleted = true;
  site.name = site.name + " (deleted)";

  await SiteRepository.save(site);
  await CameraRepository.update({ siteId : id }, { siteId : DEFAULT_BIGINT_ID });

  deleteRouteBySiteId(id);
  return { data : getSiteDto(site) };
};

const initFakeSite = async () : Promise<void> => {
  await SiteRepository.save({
    id : "1",
    name : "name",
    description : "description"
  } as Site);
};

export {
  listSites,
  countSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  initFakeSite
};
