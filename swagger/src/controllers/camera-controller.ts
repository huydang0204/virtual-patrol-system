import {
  Route,
  Tags,
  Body,
  Security,
  Get,
  Path,
  Put,
  Delete,
  Query
} from "tsoa";

import {
  CountResponse,
  exampleCount,
  exampleDate,
  exampleNumber,
  exampleUUID
} from "types/common";
import {
  CameraList,
  CameraResponse,
  CameraUpdateBody,
  exampleCameraStatus
} from "types/camera";
import { exampleSopType } from "types/sop";

@Route("camera")
@Tags("Camera")
export default class CameraController {

    @Get("/list")
    @Security("Authorization")
  public async listCamera(@Query() searchText?: string, @Query() siteId?: number, @Query() limit?: number, @Query() offset?: number): Promise<CameraList> {
    return {
      data : [
        {
          id : exampleUUID,
          name : "string",
          address : "string",
          tags : ["string",
            "string",
            "string"],
          lat : "string",
          lng : "string",
          status : exampleCameraStatus,
          bearing : "string",
          siteId : exampleNumber,
          siteName : "string",
          sops : [
            {
              id : exampleNumber,
              name : "string",
              type : exampleSopType,
              startDate : exampleDate,
              endDate : exampleDate,
              checklists : ["string",
                "string",
                "string"],
              createdAt : exampleDate,
              deletedAt : exampleDate

            }
          ]
        }
      ]
    };
  }

    @Get("/count")
    @Security("Authorization")
    public async countCamera(): Promise<CountResponse> {
      return { count : exampleCount };
    }

    @Get("{id}")
    @Security("Authorization")
    public async getCameraById(@Path() id: string): Promise<CameraResponse> {
      return {
        id : exampleUUID,
        name : "string",
        address : "string",
        tags : ["string",
          "string",
          "string"],
        lat : "string",
        lng : "string",
        status : exampleCameraStatus,
        bearing : "string",
        siteId : exampleNumber,
        siteName : "string",
        sops : [
          {
            id : exampleNumber,
            name : "string",
            type : exampleSopType,
            startDate : exampleDate,
            endDate : exampleDate,
            checklists : ["string",
              "string",
              "string"],
            createdAt : exampleDate,
            deletedAt : exampleDate

          }
        ]
      };
    }

    @Delete("{id}")
    @Security("Authorization")
    public async deleteCameraById(@Path() id: string): Promise<CameraResponse> {
      return {
        id : exampleUUID,
        name : "string",
        address : "string",
        tags : ["string",
          "string",
          "string"],
        lat : "string",
        lng : "string",
        status : exampleCameraStatus,
        bearing : "string",
        siteId : exampleNumber,
        siteName : "string",
        sops : [
          {
            id : exampleNumber,
            name : "string",
            type : exampleSopType,
            startDate : exampleDate,
            endDate : exampleDate,
            checklists : ["string",
              "string",
              "string"],
            createdAt : exampleDate,
            deletedAt : exampleDate

          }
        ]
      };
    }

    @Put("{id}")
    @Security("Authorization")
    public async updateCameraById(@Path() id: string, @Body() requestCameraBody: CameraUpdateBody): Promise<CameraResponse> {
      return {
        id : exampleUUID,
        name : "string",
        address : "string",
        tags : ["string",
          "string",
          "string"],
        lat : "string",
        lng : "string",
        status : exampleCameraStatus,
        bearing : "string",
        siteId : exampleNumber,
        siteName : "string",
        sops : [
          {
            id : exampleNumber,
            name : "string",
            type : exampleSopType,
            startDate : exampleDate,
            endDate : exampleDate,
            checklists : ["string",
              "string",
              "string"],
            createdAt : exampleDate,
            deletedAt : exampleDate

          }
        ]
      };
    }

}
