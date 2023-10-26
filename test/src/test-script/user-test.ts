import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getLogout = async (jwt: string): Promise<AxiosPromise> => {

  return await apiInstance.request({
    url : "/user/logout",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt }

  });
};

const getUserList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/user/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "0",
      limit : "10"
    }
  });
};

const getUserCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/user/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getSingleUser = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/user/${ id }`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

describe("User Integration Testing", () => {

  let jwt = "";
  let userId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("User count should be produced", async () => {
    const result = await getUserCount(jwt);

    expect(result.status).toEqual(200);

  });

  test("User list should be produced", async () => {
    const result = await getUserList(jwt);
    userId = result.data.data[0].id;
    expect(result.status).toEqual(200);

  });

  test("Single user should be produced", async () => {
    const result = await getSingleUser(jwt, userId);
    expect(result.status).toEqual(200);

  });

  test("User should be logout", async () => {
    const result = await getLogout(jwt);
    expect(result.status).toEqual(200);

  });
});
