import { In } from "typeorm";

import {
  Camera,
  transaction
} from "entities";
import {
  CameraRepository,
  SiteRepository,
  SopRepository
} from "repositories";

import {
  CountResponse,
  FindAndCountResponse,
  ServiceResponse
} from "@vps/utils/lib/data";
import {
  CameraError,
  CameraRequest,
  CameraResponse
} from "@vps/utils/lib/dto/camera";

import { getCameraDto } from "services/camera/mapper";
import { getNxWitnessDevices } from "services/thirdparty/nxWitness";
import { NxWitnessDeviceResponse } from "@vps/utils/lib/dto/thirdparty/nxwitness";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { logger } from "services/logger";

export const listCameras = async (
  searchText : string,
  siteId : string,
  limit : number,
  offset : number
) : Promise<FindAndCountResponse<CameraResponse>> => {

  const [
    cameras,
    count
  ] = await CameraRepository.findAndCountWithOptions(
    searchText,
    siteId,
    limit,
    offset
  );

  let results : CameraResponse[] = [];
  if (!!cameras) {
    results = cameras.map(getCameraDto);
  }

  return {
    data : results,
    count,
    limit,
    offset
  };
};

export const countCameras = async () : Promise<CountResponse> => {
  const count = await CameraRepository.count();
  return { count };
};

export const getCamera = async (id : string) : Promise<CameraResponse> => {
  const camera = !id ? null : await CameraRepository.findOne({
    where : { id },
    relations : {
      site : true,
      sops : true
    }
  });
  return getCameraDto(camera);
};

export const deleteCameraById = async (id : string) : Promise<ServiceResponse<Camera, CameraError>> => {
  const checkedCamera = await CameraRepository.findOne({ where : { id } });
  if (!checkedCamera) {
    return { error : CameraError.NotFound };
  }
  const result = await CameraRepository.softRemove(checkedCamera);
  return { data : result };
};

export const updateCamera = async (
  id : string,
  cameraRq : CameraRequest
) : Promise<ServiceResponse<CameraResponse, CameraError>> => {
  const checkedCamera = await CameraRepository.findOne({
    where : { id },
    relations : { site : true }
  });
  if (!checkedCamera) {
    return { error : CameraError.NotFound };
  }

  if (cameraRq.siteId != undefined) {
    const site = await SiteRepository.findOne({
      where : { id : cameraRq.siteId },
      withDeleted : true
    });
    if (!site) {
      return { error : CameraError.SiteNotFound };
    }
    checkedCamera.siteId = cameraRq.siteId;
    checkedCamera.site = site;
  }
  if (cameraRq.sopIds != undefined && cameraRq.sopIds.length > 0) {
    const sops = await SopRepository.findBy({ id : In(cameraRq.sopIds) });
    checkedCamera.sops = sops;

  }
  checkedCamera.address = cameraRq.address ?? checkedCamera.address;
  checkedCamera.lat = cameraRq.lat ?? checkedCamera.lat;
  checkedCamera.lng = cameraRq.lng ?? checkedCamera.lng;
  checkedCamera.name = cameraRq.name ?? checkedCamera.name;
  checkedCamera.region = cameraRq.region ?? checkedCamera.region;
  checkedCamera.tags = cameraRq.tags ?? checkedCamera.tags;
  checkedCamera.bearing = cameraRq.bearing ?? checkedCamera.bearing;

  await checkedCamera.save();

  return { data : getCameraDto(checkedCamera) };
};

export const syncCameras = async (nxToken : string) : Promise<Promise<boolean>> => {
  const { data : witnessDevices } = await getNxWitnessDevices(nxToken, "id,name,status,serverId");

  let success = false;
  if (!!witnessDevices) {
    const witnessCameraMap : Record<string, NxWitnessDeviceResponse> = {};
    const witnessCameraIds = witnessDevices.map((aCamera : NxWitnessDeviceResponse) => {
      witnessCameraMap[aCamera.id] = aCamera;
      return aCamera.id;
    });

    await transaction(async (em : EntityManager) => {
      const cameraRepo = em.getRepository(Camera);
      const allCameras = await cameraRepo.find({ withDeleted : true });

      const existedCameras : Camera[] = [];
      const deletedCameras : Camera[] = [];
      const newCameras : Camera[] = [];
      const restoreCameraIds : string[] = [];

      const allCameraMap : Record<string, Camera> = {};
      const allCameraIds = allCameras.map((currentCamera : Camera) => {
        if (witnessCameraIds.includes(currentCamera.id)) {

          if (currentCamera.deletedAt) {
            restoreCameraIds.push(currentCamera.id);
          } else {
            existedCameras.push(currentCamera);
          }

        } else {
          deletedCameras.push(currentCamera);
        }

        allCameraMap[currentCamera.id] = currentCamera;
        return currentCamera.id;
      });

      //collect new CameraIds
      witnessCameraIds.forEach((id : string) => {
        if (!allCameraIds.includes(id)) {
          const currentWitnessCamera = witnessCameraMap[id];

          newCameras.push({
            id : currentWitnessCamera.id,
            name : currentWitnessCamera.name,
            status : currentWitnessCamera.status,
            siteId : "0"
          } as Camera);

        }
      });
      logger.debug(`[syncCameras] New ${ newCameras.length } - Existed ${ existedCameras.length } - Deleted ${ deletedCameras.length }`);

      if (existedCameras.length > 0) {
        for (const existedCamera of existedCameras) {
          existedCamera.name = witnessCameraMap[existedCamera.id]?.name ?? existedCamera.name;
          existedCamera.status = witnessCameraMap[existedCamera.id]?.status ?? existedCamera.status;
          delete witnessCameraMap[existedCamera.id];
        }
        await cameraRepo.save(existedCameras);
      }
      await cameraRepo.save(newCameras);
      await cameraRepo.update({ id : In(restoreCameraIds) }, { deletedAt : null });
      await cameraRepo.softRemove(deletedCameras);

    });
    success = true;
  }

  return success;
};

export const initFakeCameras = async (): Promise<void> => {

  const cameras: Camera[] = [
    {
      id : "b41ab1ab-8d74-9bf5-a04d-5b1930795e8d",
      name : "FM014 - Balestier Point",
      status : "Recording",
      siteId : "0"
    } as Camera,
    {
      id : "d715a5f9-0c8a-7bd3-b6dc-598a5e01321b",
      name : "FM443-Upper Paya Lebar Rd-2",
      status : "Recording",
      siteId : "0"
    } as Camera,
    {
      id : "e28747a4-6661-e35d-fab4-1a31c7191899",
      name : "FM300 - Lor Gambir",
      status : "Recording",
      siteId : "0"
    } as Camera,
    {
      id : "1f4225f3-cbc8-434b-9bf9-3d427d01f72e",
      name : "FM018 - Harvey Rd",
      status : "Recording",
      siteId : "0"
    } as Camera,
    {
      id : "3e7b3219-562f-f1d9-a4b7-525cc9bde089",
      name : "MOB18-PTZ-Corporation Rd",
      status : "Recording",
      siteId : "0"
    } as Camera
  ];
  await CameraRepository.save(cameras);
};
