import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getCameraList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/camera/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getCameraCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/camera/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getSingleCamera = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/camera/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateSingleCamera = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/camera/${id}`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {}
  });
};

describe("Camera Integration Testing", () => {

  let jwt = "";
  let id = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Camera list should be produced", async () => {
    const result = await getCameraList(jwt);

    id = result.data.data[0].id;
    expect(result.status).toEqual(200);

  });

  test("Camera count should be produced", async () => {
    const result = await getCameraCount(jwt);
    expect(result.status).toEqual(200);

  });

  test("Single camera should be seleted", async () => {
    const result = await getSingleCamera(jwt, id);
    expect(result.status).toEqual(200);

  });

  test("Single camera should be updated", async () => {
    const result = await updateSingleCamera(jwt, id);
    expect(result.status).toEqual(200);

  });
});
