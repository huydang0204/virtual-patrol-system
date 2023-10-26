import {
  Route,
  Tags,
  Get,
  Security,
  Query,
  Path,
  Delete,
  Put
} from "tsoa";
import {
  exampleNumber,
  exampleDate,
  FindAndCountResponse,
  exampleUUID,
  exampleCount,
  DeleteResponse
} from "types/common";
import {
  AppNotification,
  NotiCountResponse,
  exampleDetailData,
  exampleNotificationStatus,
  exampleNotificationType
} from "types/notification";

@Route("notification")
@Tags("Notification")
export default class NotificationController {

    @Get("/list")
    @Security("Authorization")
  public async listNotification(@Query() limit?: number, @Query() offset?: number): Promise<FindAndCountResponse<AppNotification>> {
    return {
      data : [
        {
          id : exampleUUID,

          type : exampleNotificationType,

          description : "string",

          alertedUserId : "string",

          createdAt : exampleDate,

          status : exampleNotificationStatus,

          detailData : exampleDetailData

        }
      ],
      count : exampleNumber,
      limit : exampleNumber,
      offset : exampleNumber
    };
  }

    @Get("/count")
    @Security("Authorization")
    public async countNotification(): Promise<NotiCountResponse> {
      return {
        countNew : exampleCount,
        countRead : exampleCount
      };
    }

    @Delete("{id}")
    @Security("Authorization")
    public async deleteNotificationById(@Path() id: string): Promise<boolean> {
      return true;
    }

    @Delete()
    @Security("Authorization")
    public async deleteNotificationList(): Promise<DeleteResponse> {
      return { deletedCount : exampleCount };
    }

    @Put()
    @Security("Authorization")
    public async readNotification(): Promise<unknown> {
      return { data : true };
    }

  @Put("{id}")
    @Security("Authorization")
    public async readNotificationById(@Path() id: string): Promise<unknown> {
      return { data : true };
    }

}

