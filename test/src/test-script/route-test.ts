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

const currentDate = new Date();
const endDay = addDays(currentDate, 5);
const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");
const formattedEndDay = format(endDay, "yyyy-MM-dd");

const listRoutes = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/route/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getRouteCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/route/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const createRoute = async (jwt: string, loggedInUserId: string): Promise<AxiosPromise> => {

  const date= new Date().valueOf();
  return await apiInstance.request({
    url : "/route",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "Test Route" + date,
      //NOTE: by using if from initFakeSite service
      siteId : 1,
      patrolMode : "LiveImage",
      allowStartTime : 234,
      assignedUserIds : [loggedInUserId]
    }
  }).catch(err => {
    return err.response;
  });
};

const getRouteById = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getCheckpointById = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/checkpoint/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const createRouteCheckpoint = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}/checkpoint/list`,
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      // NOTE: Camera ids are based on fakeInitData from camera service
      checkpoints : [
        {
          setOrder : 1,
          layoutRow : 3,
          layoutCol : 2,
          cameraIds : ["b41ab1ab-8d74-9bf5-a04d-5b1930795e8d",
            "d715a5f9-0c8a-7bd3-b6dc-598a5e01321b"]
        },
        {
          setOrder : 2,
          layoutRow : 1,
          layoutCol : 3,
          cameraIds : ["e28747a4-6661-e35d-fab4-1a31c7191899",
            "1f4225f3-cbc8-434b-9bf9-3d427d01f72e",
            "3e7b3219-562f-f1d9-a4b7-525cc9bde089"]
        }
      ]

    }
  });
};

const updateRouteCheckpoint = async (jwt: string, id: string, checkpointId: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}/checkpoint/list`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      checkpoints : [
        {
          id : checkpointId,
          setOrder : 1,
          layoutRow : 3,
          layoutCol : 2,
          cameraIds : ["e28747a4-6661-e35d-fab4-1a31c7191899"]
        }
      ]

    }
  });
};

const createRouteSchedule = async (jwt: string, id: string): Promise<AxiosPromise> => {

  return await apiInstance.request({
    url : `/route/${id}/schedule/list`,
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      schedules : [
        {

          startOccurrenceDate : formattedCurrentDate,
          endOccurrenceDate : formattedCurrentDate,
          executingDays : [1,
            3],
          executingTime : [{
            "startTime" : 46900,
            "endTime" : 47900
          },
          {
            "startTime" : 46800,
            "endTime" : 47500
          }]
        },
        {

          startOccurrenceDate : formattedCurrentDate,
          endOccurrenceDate : formattedEndDay,
          executingDays : [2,
            4],
          executingTime : [{
            "startTime" : 46920,
            "endTime" : 47901
          },
          {
            "startTime" : 46800,
            "endTime" : 49700
          }]
        }
      ]

    }
  }).catch(err => {
    return err.response;
  });
};

const updateRouteSchedule = async (jwt: string, id: string, scheduleId: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}/schedule/list`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      schedules : [
        {
          id : scheduleId,
          startOccurrenceDate : formattedCurrentDate,
          endOccurrenceDate : formattedEndDay,
          executingDays : [1,
            3],
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

const listCheckpointsByRouteId = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}/checkpoint/list`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const listSchedulesByRouteId = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/route/${id}/schedule/list`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const deleteCheckpointsByIds = async (jwt: string, ids: string[]): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/route/checkpoint/list",
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt },
    data : { "ids" : ids }
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

describe("Route Integration Testing", () => {

  let jwt = "";
  let routeId = "";
  let checkpointId = "";
  let scheduleId = "";

  let loginUserId = "";

  const checkpointIds: string[] = [];
  const scheduleIds: string[] = [];

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    loginUserId = apiInstance.userId;
    expect(jwt.length).toBeGreaterThan(0);

  });

  test("Route should be created", async () => {
    const result = await createRoute(jwt, loginUserId);

    routeId = result.data.id;
    expect(result.status).toEqual(200);

  });

  test("Route list should be produced", async () => {
    const result = await listRoutes(jwt);
    expect(result.status).toEqual(200);

  });

  test("Route count should be produced", async () => {
    const result = await getRouteCount(jwt);

    expect(result.data.count).toBeGreaterThanOrEqual(1);

  });

  test("Single route should be produced", async () => {
    const result = await getRouteById(jwt, routeId);

    expect(result.status).toEqual(200);

  });

  test("Checkpoint should be created successfully", async () => {
    const result = await createRouteCheckpoint(jwt, routeId);

    checkpointId = result.data[0].id;

    checkpointIds.push(result.data[0].id);
    checkpointIds.push(result.data[1].id);

    expect(result.data.length).toEqual(2);

  });

  test("Schedule should be created successfully", async () => {
    const result = await createRouteSchedule(jwt, routeId);

    scheduleId = result.data[0].id;
    scheduleIds.push(result.data[0].id);
    scheduleIds.push(result.data[1].id);
    expect(result.data.length).toEqual(2);

  });

  test("Checkpoint should be listed by route Id successfully", async () => {
    const result = await listCheckpointsByRouteId(jwt, routeId);

    expect(result.data.count).toEqual(2);

  });

  test("Schedule should be listed by route Id successfully", async () => {
    const result = await listSchedulesByRouteId(jwt, routeId);

    expect(result.data.count).toEqual(2);

  });

  test("Checkpoint should be selected by Id successfully", async () => {
    const result = await getCheckpointById(jwt, checkpointId);

    expect(result.status).toEqual(200);

  });

  test("Checkpoint should be updated successfully", async () => {
    const result = await updateRouteCheckpoint(jwt, routeId, checkpointId);

    expect(result.data.length).toEqual(1);

  });

  test("Schedule should be updated successfully", async () => {
    const result = await updateRouteSchedule(jwt, routeId, scheduleId);

    expect(result.data.length).toEqual(1);

  });

  test("Checkpoint should be deleted successfully", async () => {
    const result = await deleteCheckpointsByIds(jwt, checkpointIds);

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
});
