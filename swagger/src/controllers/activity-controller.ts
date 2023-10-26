import {
  Body,
  Get,
  Post,
  Query,
  Route,
  Security,
  Tags
} from "tsoa";
import {
  ActivityCreateBody,
  ActivityResponse,
  exampleActivityType,
  exampleUserActivityData
} from "types/activity";
import {
  exampleDate,
  exampleUUID
} from "types/common";

@Route("activity")
@Tags("Activity")
export default class ActivityController {

    @Get("/list")
    @Security("Authorization")
  public async listActivity(
        @Query() limit?: number, @Query() offset?: number, @Query() userId?: string,
        @Query() types?: string, @Query() from?: string, @Query() to?: string
  ): Promise<ActivityResponse> {
    return {
      id : exampleUUID,
      type : exampleActivityType,
      userId : exampleUUID,
      description : "string",
      createdAt : exampleDate,
      user : exampleUserActivityData
    };
  }

    @Post()
    @Security("Authorization")
    public async createNewActivity(@Body() reqBody: ActivityCreateBody): Promise<ActivityResponse> {
      return {
        id : exampleUUID,
        type : exampleActivityType,
        userId : exampleUUID,
        description : "string",
        createdAt : exampleDate,
        user : exampleUserActivityData
      };
    }

}