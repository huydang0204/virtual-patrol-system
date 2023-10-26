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
  CountResponse,
  exampleCount,
  exampleDate,
  exampleNumber
} from "types/common";
import {
  SopCreateBody,
  SopList,
  SopResponse,
  SopType,
  SopUpdateBody,
  exampleSopType
} from "types/sop";

@Route("sop")
@Tags("SOP")
export default class SopController {

    @Get("/list")
    @Security("Authorization")
  public async listSop(@Query() searchText?: string, @Query() type?: SopType, @Query() limit?: number, @Query() offset?: number): Promise<SopList> {
    return {
      data : [
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

    @Get("/count")
    @Security("Authorization")
    public async countSop(): Promise<CountResponse> {
      return { count : exampleCount };
    }

    @Get("{id}")
    @Security("Authorization")
    public async getSopById(@Path() id: string): Promise<SopResponse> {
      return {
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

      };
    }

    @Delete("{id}")
    @Security("Authorization")
    public async deleteSopById(@Path() id: string): Promise<SopResponse> {
      return {
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

      };
    }

    @Post()
    @Security("Authorization")
    public async createSop(@Body() reqBody: SopCreateBody): Promise<SopResponse> {
      return {
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

      };
    }

    @Put("{id}")
    @Security("Authorization")
    public async updateSop(@Path() id: string, @Body() reqBody: SopUpdateBody): Promise<SopResponse> {
      return {
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

      };
    }

}

