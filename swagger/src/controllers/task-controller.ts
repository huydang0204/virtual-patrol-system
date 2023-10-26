import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Security,
  Tags
} from "tsoa";
import {
  CountResponse,
  FindAndCountResponse,
  exampleCount
} from "types/common";
import {
  Entity,
  RouteResponse,
  exampleRouteResponse
} from "types/route";
import {
  AcknowledgeRequestBody,
  CommentRequestBody,
  RaiseAlertRequestBody,
  RouteTaskResponse,
  TaskMonthlyReportDetailResponse,
  TaskSummaryReportResponse,
  exampleRouteTask,
  exampleTaskMonthlyReport,
  exampleTaskSummaryReportResponse
} from "types/task";

@Route("task")
@Tags("Task")
export default class TaskController {

    @Get("/list")
    @Security("Authorization")
  public async listTasks(
@Query() limit?: number, @Query() offset?: number,
        @Query() fromDate?: string, @Query() toDate?: string,
        @Query() filterStatuses?: string, @Query() searchText?: string, @Query() siteId?: string,
        @Query() filterShift?: string
  ): Promise<FindAndCountResponse<RouteTaskResponse>> {
    return {
      data : [
        exampleRouteTask
      ],
      count : exampleCount
    };
  }

    @Get("/count")
    @Security("Authorization")
    public async countTask(
@Query() fromDate?: string, @Query() toDate?: string,
        @Query() filterStatuses?: string
    ): Promise<CountResponse> {
      return { count : exampleCount };
    }

    @Get("{id}")
    @Security("Authorization")
    public async getTaskById(@Path() id: string): Promise<RouteTaskResponse> {
      return exampleRouteTask;
    }

    @Get("monthly-report/list")
    @Security("Authorization")
    public async listMonthlyReportById(
        @Query() siteId?: number,
        @Query() month?: string,
        @Query() limit?: number,
        @Query() offset?: number
    ): Promise<FindAndCountResponse< TaskSummaryReportResponse>> {
      return {
        data : [
          exampleTaskSummaryReportResponse
        ],
        count : exampleCount
      };
    }

    @Get("daily-report/list")
    @Security("Authorization")
    public async listDailyReportById(
        @Query() siteId?:number,
        @Query() day?:string,
        @Query() limit?: number,
        @Query() offset?: number
    ): Promise<FindAndCountResponse<TaskSummaryReportResponse> > {
      return {
        data : [
          exampleTaskSummaryReportResponse
        ],
        count : exampleCount
      };
    }

    @Get("monthly-report/{id}")
    @Security("Authorization")
    public async getMonthlyReportById(@Path() id: string): Promise<TaskMonthlyReportDetailResponse> {
      return exampleTaskMonthlyReport;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////

  @Post("{id}/raise-alert")
    @Security("Authorization")
    public async raiseAlert(@Path() id: string, @Body() req: RaiseAlertRequestBody ): Promise<Entity> {
      return { data : "TaskReport Entity Data" };
    }

  @Post("{id}/acknowledge")
  @Security("Authorization")
  public async acknowledge(@Path() id: string, @Body() req: AcknowledgeRequestBody): Promise<Entity> {
    return { data : "TaskReport Entity Data" };
  }

  @Post("{id}/comment")
  @Security("Authorization")
  public async comment(@Path() id: string, @Body() req: CommentRequestBody): Promise<Entity> {
    return { data : "TaskReport Entity Data" };
  }

  ////////////////////////////////////////////////////////////////

  @Post("{id}/start")
  @Security("Authorization")
  public async start(@Path() id: string, @Body() req: RaiseAlertRequestBody): Promise<RouteResponse> {
    return exampleRouteResponse;
  }

  @Post("{id}/end")
  @Security("Authorization")
  public async end(@Path() id: string, @Body() req: AcknowledgeRequestBody): Promise<RouteResponse> {
    return exampleRouteResponse;
  }

  @Post("{id}/resume")
  @Security("Authorization")
  public async resume(@Path() id: string, @Body() req: CommentRequestBody): Promise<RouteResponse> {
    return exampleRouteResponse;
  }

  @Post("{id}/ongoing")
  @Security("Authorization")
  public async ongoing(@Path() id: string, @Body() req: RaiseAlertRequestBody): Promise<RouteResponse> {
    return exampleRouteResponse;
  }

  @Post("{id}/pause")
  @Security("Authorization")
  public async pause(@Path() id: string, @Body() req: AcknowledgeRequestBody): Promise<RouteResponse> {
    return exampleRouteResponse;
  }

}

