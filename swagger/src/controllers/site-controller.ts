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
  FindAndCountResponse,
  exampleBoolean,
  exampleCount,
  exampleNumber,
  exampleUUID
} from "types/common";
import {
  SiteRequestBody,
  SiteResponse
} from "types/site";

@Route("site")
@Tags("Site")
export default class SiteController {

  @Get("/list")
  @Security("Authorization")
  public async listSite(@Query() limit?: number, @Query() offset?: number): Promise<FindAndCountResponse<SiteResponse>> {
    return {
      data : [
        {
          id : exampleUUID,
          name : "string",
          description : "string",
          noCameras : exampleNumber,
          deleted : exampleBoolean,
          cameras : [
            {
              id : exampleUUID,
              name : "string"
            }
          ]

        }
      ],
      count : exampleNumber,
      limit : exampleNumber,
      offset : exampleNumber
    };
  }

  @Get("/count")
  @Security("Authorization")
  public async countSite(@Query() searchText?: string): Promise<CountResponse> {
    return { count : exampleCount };
  }

  @Get("{id}")
  @Security("Authorization")
  public async getSiteById(@Path() id: string): Promise<SiteResponse> {
    return {
      id : exampleUUID,
      name : "string",
      description : "string",
      noCameras : exampleNumber,
      deleted : exampleBoolean,
      cameras : [
        {
          id : exampleUUID,
          name : "string"
        }
      ]

    };
  }

  @Delete("{id}")
  @Security("Authorization")
  public async deleteSiteById(@Path() id: string): Promise<SiteResponse> {
    return {
      id : exampleUUID,
      name : "string",
      description : "string",
      noCameras : exampleNumber,
      deleted : exampleBoolean,
      cameras : [
        {
          id : exampleUUID,
          name : "string"
        }
      ]

    };
  }

  @Put("{id}")
  @Security("Authorization")
  public async updateSite(@Path() id: string, @Body() reqBody: SiteRequestBody): Promise<SiteResponse> {
    return {
      id : exampleUUID,
      name : "string",
      description : "string",
      noCameras : exampleNumber,
      deleted : exampleBoolean,
      cameras : [
        {
          id : exampleUUID,
          name : "string"
        }
      ]

    };
  }

  @Post()
  @Security("Authorization")
  public async createSite(@Body() reqBody: SiteRequestBody): Promise<SiteResponse> {
    return {
      id : exampleUUID,
      name : "string",
      description : "string",
      noCameras : exampleNumber,
      deleted : exampleBoolean,
      cameras : [
        {
          id : exampleUUID,
          name : "string"
        }
      ]

    };
  }

}
