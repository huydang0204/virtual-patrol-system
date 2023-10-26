import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  Tags
} from "tsoa";
import { exampleCameraStatus } from "types/camera";
import {
  CountResponse,
  DeleteResponse,
  FindAndCountResponse,
  exampleBoolean,
  exampleCount,
  exampleDate,
  exampleNumber,
  exampleUUID
} from "types/common";
import {
  DateOfWeek,
  Entity,
  EntityList,
  RouteCheckpointRequest,
  RouteCheckpointResponse,
  RouteDeleteResult,
  RouteDetailResponse,
  RouteRequestBody,
  RouteResponse,
  RouteScheduleRequest,
  RouteScheduleResponse
} from "types/route";

import { exampleSopType } from "types/sop";

@Route("route")
@Tags("Route")
export default class RouteController {

    @Get("/list")
    @Security("Authorization")
  public async listRoutes(@Query() limit?: number, @Query() offset?: number): Promise<FindAndCountResponse<RouteResponse>> {
    return {
      data : [
        {
          id : exampleUUID,
          name : "string",
          createdAt : exampleDate,
          siteId : exampleNumber,
          allowStartTime : exampleNumber,
          patrolMode : "string",
          site : {
            id : "string",
            name : "string"
          },
          createdUserId : exampleUUID,
          createdUserName : "string",
          assignedUsers : [
            {
              id : exampleUUID,
              name : "string"
            }
          ],
          reminderTime : exampleNumber,
          deleted : exampleBoolean
        }
      ],
      count : exampleNumber,
      limit : exampleNumber,
      offset : exampleNumber
    };
  }

    @Get("/count")
    @Security("Authorization")
    public async countRoute(@Query() searchText?: string): Promise<CountResponse> {
      return { count : exampleCount };
    }

    @Get("{id}")
    @Security("Authorization")
    public async getRouteById(@Path() id?: string): Promise<RouteResponse> {
      return {
        id : exampleUUID,
        name : "string",
        createdAt : exampleDate,
        siteId : exampleNumber,
        allowStartTime : exampleNumber,
        patrolMode : "string",
        site : {
          id : "string",
          name : "string"
        },
        createdUserId : exampleUUID,
        createdUserName : "string",
        assignedUsers : [
          {
            id : exampleUUID,
            name : "string"
          }
        ],
        reminderTime : exampleNumber,
        deleted : exampleBoolean
      };
    }

    @Delete("{id}")
    @Security("Authorization")
    public async deleteRouteById(@Path() id?: string): Promise<RouteDeleteResult> {
      return {
        checkpointsDeleteCount : exampleNumber,
        schedulesDeleteCount : exampleNumber,
        routeDeleteCount : exampleNumber,
        routeName : "string"
      };
    }

    @Post("")
    @Security("Authorization")
    public async createRoute(@Body() req?: RouteRequestBody): Promise<RouteDetailResponse> {
      return {
        id : exampleUUID,
        name : "string",
        createdAt : exampleDate,
        siteId : exampleNumber,
        allowStartTime : exampleNumber,
        patrolMode : "string",
        site : {
          id : "string",
          name : "string"
        },
        createdUserId : exampleUUID,
        createdUserName : "string",
        assignedUsers : [
          {
            id : "string",
            name : "string"
          }
        ],
        reminderTime : exampleNumber,
        deleted : exampleBoolean
      };
    }

    @Put("{id}")
    @Security("Authorization")
    public async updateRoute(@Path() id?: string): Promise<RouteDetailResponse> {
      return {
        id : exampleUUID,
        name : "string",
        createdAt : exampleDate,
        siteId : exampleNumber,
        allowStartTime : exampleNumber,
        patrolMode : "string",
        site : {
          id : "string",
          name : "string"
        },
        createdUserId : exampleUUID,
        createdUserName : "string",
        assignedUsers : [
          {
            id : "string",
            name : "string"
          }
        ],
        reminderTime : exampleNumber,
        deleted : exampleBoolean
      };
    }
  ////////////////////////////////////////////////////////////////
  @Get("{routeId}/checkpoint/list")
  @Security("Authorization")
    public async listCheckpoints(@Path() routeId: string ): Promise<EntityList> {
      return {
        entities : [
          { data : "entity data itself" }
        ]
      };
    }

  @Get("checkpoint/{id}")
  @Security("Authorization")
  public async getCheckpointById(@Path() id: string): Promise<Entity> {
    return { data : "entity data itself" };
  }

  @Get("checkpoint/list")
  @Security("Authorization")
  public async deleteCheckpoints(@Query() ids: string): Promise<DeleteResponse> {
    return { deletedCount : exampleNumber };
  }

  @Post("{routeId}/checkpoint/list")
  @Security("Authorization")
  public async createCheckpointByRouteId(@Path() routeId: string, @Body() reqBody?: RouteCheckpointRequest): Promise<RouteCheckpointResponse> {
    return {
      id : exampleUUID,
      setOrder : exampleNumber,
      layoutRow : exampleNumber,
      layoutCol : exampleNumber,
      cameras : [
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

  @Put("{routeId}/checkpoint/list")
  @Security("Authorization")
  public async updateCheckpointByRouteId(@Path() routeId: string, @Body() reqBody?: RouteCheckpointRequest): Promise<RouteCheckpointResponse> {
    return {
      id : exampleUUID,
      setOrder : exampleNumber,
      layoutRow : exampleNumber,
      layoutCol : exampleNumber,
      cameras : [
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

  ////////////////////////////////////////////////////////////////////////////////////////////////

  @Get("{routeId}/schedule/list")
  @Security("Authorization")
  public async listSchedules(@Path() routeId: string): Promise<EntityList> {
    return {
      entities : [
        { data : "entity data itself" }
      ]
    };
  }

  @Get("schedule/{id}")
  @Security("Authorization")
  public async getScheduleById(@Path() id: string): Promise<Entity> {
    return { data : "entity data itself" };
  }

  @Get("schedule/list")
  @Security("Authorization")
  public async deleteSchedules(@Query() ids: string): Promise<DeleteResponse> {
    return { deletedCount : exampleNumber };
  }

  @Post("{routeId}/schedule/list")
  @Security("Authorization")
  public async createScheduleByRouteId(@Path() routeId: string, @Body() reqBody?: RouteScheduleRequest): Promise<RouteScheduleResponse> {
    return {
      id : exampleUUID,
      startOccurrenceDate : exampleDate,
      endOccurrenceDate : exampleDate,
      executingDays : [DateOfWeek.Fri],
      executingTime : [{
        startTime : exampleNumber,
        endTime : exampleNumber
      }]
    };
  }

  @Put("{routeId}/schedule/list")
  @Security("Authorization")
  public async updateScheduleByRouteId(@Path() routeId: string, @Body() reqBody?: RouteScheduleRequest): Promise<RouteScheduleResponse> {
    return {
      id : exampleUUID,
      startOccurrenceDate : exampleDate,
      endOccurrenceDate : exampleDate,
      executingDays : [DateOfWeek.Fri],
      executingTime : [{
        startTime : exampleNumber,
        endTime : exampleNumber
      }]
    };
  }

}
