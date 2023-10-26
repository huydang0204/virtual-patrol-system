import { EntityManager } from "typeorm/entity-manager/EntityManager";

import {
  Camera,
  transaction
} from "entities";

import { getNxWitnessDevices } from "services/thirdparty/nxWitness";
import { NxWitnessDeviceResponse } from "@vps/utils/lib/dto/thirdparty/nxwitness";
import { In } from "typeorm";

export const syncCameras = async (nxToken: string): Promise<Promise<boolean>> => {
  const { data : witnessDevices } = await getNxWitnessDevices(nxToken, "id,name,status,serverId");

  let success = false;
  if (!!witnessDevices) {
    const witnessCameraMap: Record<string, NxWitnessDeviceResponse> = {};
    const witnessCameraIds = witnessDevices.map((aCamera: NxWitnessDeviceResponse) => {
      witnessCameraMap[aCamera.id] = aCamera;
      return aCamera.id;
    });

    await transaction(async (em: EntityManager) => {
      const cameraRepo = em.getRepository(Camera);
      const allCameras = await cameraRepo.find({ withDeleted : true });

      const existedCameras: Camera[] = [];
      const deletedCameras: Camera[] = [];
      const newCameras: Camera[] = [];
      const restoreCameraIds: string[] = [];

      const allCameraMap: Record<string, Camera> = {};
      const allCameraIds = allCameras.map((currentCamera: Camera) => {

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
      witnessCameraIds.forEach((id: string) => {
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
