import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getSopList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/sop/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getSopCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/sop/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const createSop = async (jwt: string): Promise<AxiosPromise> => {
  const date = new Date().valueOf();
  return await apiInstance.request({
    url : "/sop/",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "myTestSop" + date,
      type : "Special",
      checklists : ["one",
        "two"]

    }
  }).catch(err => {
    return err.response;
  });
};

const getSingleSop = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/sop/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateSingleSop = async (jwt: string, id: string): Promise<AxiosPromise> => {
  const date = new Date().valueOf();
  return await apiInstance.request({
    url : `/sop/${id}`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      name : "SOP updated" + date,
      //type: "Special",
      checklists : ["man",
        "woman"]

    }
  }).catch(err => {
    return err.response;
  });
};

const deleteSingleSop = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/sop/${id}`,
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

describe("Sop Integration Testing", () => {

  let jwt = "";
  let sopId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Sop list should be produced", async () => {
    const result = await getSopList(jwt);
    expect(result.status).toEqual(200);

  });

  test("Sop count should be produced", async () => {
    const result = await getSopCount(jwt);

    expect(result.status).toEqual(200);

  });

  test("Sop creation should be successful", async () => {
    const result = await createSop(jwt);

    sopId = result.data.id;

    expect(result.status).toEqual(200);

  });

  test("Single Sop should be selected", async () => {
    const result = await getSingleSop(jwt, sopId);
    expect(result.status).toEqual(200);

  });

  test("Single Sop should be updated", async () => {
    const result = await updateSingleSop(jwt, sopId);

    expect(result.status).toEqual(200);

  });

  test("Single Sop should be deleted", async () => {
    const result = await deleteSingleSop(jwt, sopId);
    expect(result.status).toEqual(200);

  });

});
