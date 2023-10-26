import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getDashboardAnalytics = async (jwt: string, type:string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/dashboard-analytics?type=${type}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  }).catch(err => {
    return err.response;
  });
};

describe("Dashboard Analytics Integration Testing", () => {

  let jwt = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Weekly Dashboard analytics list should be produced", async () => {
    const result = await getDashboardAnalytics(jwt, "Weekly");
    const statusCheck = result.status == 200 || result.status == 404;
    expect(statusCheck).toEqual(true);

  });

  test("Monthly Dashboard analytics list should be produced", async () => {
    const result = await getDashboardAnalytics(jwt, "Monthly");
    const statusCheck = result.status == 200 || result.status == 404;
    expect(statusCheck).toEqual(true);

  });

});
