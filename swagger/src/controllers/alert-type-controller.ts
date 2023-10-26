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
import {
  AlertTypeList,
  AlertTypeRequestBody,
  AlertTypeResponse
} from "types/alert-type";
import {
  CountResponse,
  exampleCount,
  exampleDate,
  exampleUUID
} from "types/common";

@Route("alert-type")
@Tags("Alert Type")
class AlertTypeController {

    @Get("/list")
    @Security("Authorization")
  public async listAlertType(@Query() limit?: number, @Query() offset?: number): Promise<AlertTypeList> {
    return {
      data : [
        {
          id : exampleUUID,
          type : "string",
          priority : "string",
          description : "string",
          actionTaken : ["string"],
          imageUrl : "string",
          deletedAt : exampleDate

        }
      ]
    };
  }

    @Get("/count")
    @Security("Authorization")
    public async countAlertType(): Promise<CountResponse> {
      return { count : exampleCount };
    }

    @Get("{id}")
    @Security("Authorization")
    public async getAlertTypeById(@Path() id: string): Promise<AlertTypeResponse> {
      return {
        id : exampleUUID,
        type : "string",
        priority : "string",
        description : "string",
        actionTaken : ["string"],
        imageUrl : "string",
        deletedAt : exampleDate
      };
    }

    @Delete("{id}")
    @Security("Authorization")
    public async deleteAlertTypeById(@Path() id: string): Promise<AlertTypeResponse> {
      return {
        id : exampleUUID,
        type : "string",
        priority : "string",
        description : "string",
        actionTaken : ["string"],
        imageUrl : "string",
        deletedAt : exampleDate
      };
    }

    @Post()
    @Security("Authorization")
    public async createAlertType(@Body() reqBody: AlertTypeRequestBody): Promise<AlertTypeResponse> {
      return {
        id : exampleUUID,
        type : "string",
        priority : "string",
        description : "string",
        actionTaken : ["string"],
        imageUrl : "string",
        deletedAt : exampleDate
      };
    }

    @Put("{id}")
    @Security("Authorization")
    public async updateAlertType(@Path() id: string, @Body() reqBody: AlertTypeRequestBody): Promise<AlertTypeResponse> {
      return {
        id : exampleUUID,
        type : "string",
        priority : "string",
        description : "string",
        actionTaken : ["string"],
        imageUrl : "string",
        deletedAt : exampleDate
      };
    }

}