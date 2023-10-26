import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getActivityList = async (jwt : string) : Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/activity/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getActivityForSpecificUser = async (jwt: string, userId: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/activity/list?userId=${ userId }`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

describe("Activity Integration Testing", () => {

  let jwt = "";
  let userId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    userId = apiInstance.userId;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Activity list should be produced", async () => {
    const result = await getActivityList(jwt);
    expect(result.status).toEqual(200);

  });

  test("Activity list should be produced with specific id", async () => {
    const result = await getActivityForSpecificUser(jwt, userId);
    expect(result.status).toEqual(200);

  });

});
