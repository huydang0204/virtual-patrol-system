import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getSiteList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/site/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getSiteCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/site/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const getSingleSite = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/site/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const createSite = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/site/",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "myTestSite",
      description : "my test for site description"

    }
  });
};

const updateSingleSite = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/site/${id}`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "myTestSite2",
      description : "my test for site description2"

    }
  });
};

const deleteSingleSite = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/site/${id}`,
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

describe("Site Integration Testing", () => {

  let jwt = "";
  let siteId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Site list should be produced", async () => {
    const result = await getSiteList(jwt);
    expect(result.status).toEqual(200);

  });

  test("Site count should be produced", async () => {
    const result = await getSiteCount(jwt);

    expect(result.status).toEqual(200);

  });

  test("Site creation should be successful", async () => {
    const result = await createSite(jwt);
    siteId=result.data.id;

    expect(result.status).toEqual(200);

  });

  test("Single site should be seleted", async () => {
    const result = await getSingleSite(jwt, siteId);
    expect(result.status).toEqual(200);

  });

  test("Single site should be updated", async () => {
    const result = await updateSingleSite(jwt, siteId);
    expect(result.status).toEqual(200);

  });

  test("Single site should be deleted", async () => {
    const result = await deleteSingleSite(jwt, siteId);
    expect(result.status).toEqual(200);

  });
});
