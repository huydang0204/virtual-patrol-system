import {
  expect,
  test,
  describe
} from "@jest/globals";

import {
  addDays, format
} from "date-fns";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getTaskList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/task/list?filterStatuses=[\"Pending\"]",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "0",
      limit : "10"
    }
  });
};

const getTaskCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/task/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateTaskStart = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/${id}/start`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : { "startComment" : "This is startComment" }
  }).catch(err => {
    return err.response;
  });
};

const updateTaskEnd = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/${id}/end`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      "endStatus" : "Completed",
      "endComment" : "This is endComment"
    }
  });
};

const updateTaskResume = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/${id}/resume`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateTaskOngoing = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/${id}/ongoing`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateTaskPause = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/${id}/pause`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////

const listMonthlyReports = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/task/monthly-report/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getMonthlyReportById = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/monthly-report/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const listDailyReports = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/task/daily-report/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getDailyReportById = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/task/daily-report/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createRoute = async (jwt: string, loginUserId: string): Promise<AxiosPromise> => {
  const date = new Date().valueOf();
  return await apiInstance.request({
    url : "/route",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "Test Route" + date,
      siteId : 1,
      patrolMode : "LiveImage",
      allowStartTime : 234,
      assignedUserIds : [loginUserId]
    }
  });
};

const createRouteSchedule = async (jwt: string, id: string): Promise<AxiosPromise> => {

  const currentDate = new Date();
  const next7Days = addDays(currentDate, 7);
  const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
  const formattednext7Day = format(next7Days, "yyyy-MM-dd");

  return await apiInstance.request({
    url : `/route/${id}/schedule/list`,
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      schedules : [
        {

          startOccurrenceDate : formattedCurrentDate,
          endOccurrenceDate : formattednext7Day,
          executingDays : [0,
            1,
            2,
            3,
            4,
            5,
            6],
          executingTime : [{
            "startTime" : 46900,
            "endTime" : 47900
          }]
        }
      ]

    }
  });
};

const deleteRouteById = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}`,
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const deleteSchedulesByIds = async (jwt: string, ids: string[]): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/route/schedule/list",
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt },
    data : { "ids" : ids }
  });
};

describe("Task Integration Testing", () => {

  let jwt = "";
  let loginUserId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    loginUserId = apiInstance.userId;
    expect(jwt.length).toBeGreaterThan(0);

  });

  test("Task count should be produced", async () => {
    const result = await getTaskCount(jwt);

    expect(result.status).toEqual(200);

  });
  ////////////////////////////////////////////////////////////////

  let routeId = "";
  let scheduleId = "";
  let taskId = "";
  //let taskStatus = "";
  const scheduleIds: string[] = [];

  test("Route should be created", async () => {
    const result = await createRoute(jwt, loginUserId);
    routeId = result.data.id;
    expect(result.status).toEqual(200);

  });

  test("Schedule should be created successfully", async () => {
    const result = await createRouteSchedule(jwt, routeId);
    scheduleId = result.data[0].id;
    scheduleIds.push(scheduleId);
    expect(result.status).toEqual(200);

  });

  test("Task List should be produced", async () => {
    const result = await getTaskList(jwt);
    taskId = result.data.data[0].id;
    //taskStatus = result.data.data[0].status;
    expect(result.status).toEqual(200);

  });

  test("Task start should be updated", async () => {

    const result = await updateTaskStart(jwt, taskId);

    expect(result.status).toEqual(200);

  });

  test("Task start should be failed", async () => {

    const result = await updateTaskStart(jwt, taskId);

    expect(result.status).toEqual(401);

  });

  test("Task pause should be updated", async () => {

    const result = await updateTaskPause(jwt, taskId);

    expect(result.status).toEqual(200);

  });

  test("Task resume should be updated", async () => {
    const result = await updateTaskResume(jwt, taskId);
    expect(result.status).toEqual(200);

  });

  test("Task end should be updated", async () => {

    const result = await updateTaskEnd(jwt, taskId);

    expect(result.status).toEqual(200);

  });

  test("Schedule should be deleted successfully", async () => {
    const result = await deleteSchedulesByIds(jwt, scheduleIds);

    expect(result.status).toEqual(200);

  });

  test("Route should be deleted successful", async () => {
    const result = await deleteRouteById(jwt, routeId);

    expect(result.status).toEqual(200);

  });

  ////////////////////////////////////////////////////////////////

  let monthlyId = "";
  let dailyId = "";

  test("Task monthly report should be list", async () => {

    const result = await listMonthlyReports(jwt);
    monthlyId = result.data?.data[0]?.id;

    expect(result.status).toEqual(200);

  });

  test("Task monthly report should be select", async () => {

    if (monthlyId) {
      const result = await getMonthlyReportById(jwt, monthlyId);
      expect(result.status).toEqual(200);
    }

  });

  test("Task daily report should be list", async () => {

    const result = await listDailyReports(jwt);
    dailyId = result.data?.data[0]?.id;

    expect(result.status).toEqual(200);

  });

  test("Task daily report should be select", async () => {

    if (dailyId) {
      const result = await getDailyReportById(jwt, dailyId);
      expect(result.status).toEqual(200);
    }

  });

});
