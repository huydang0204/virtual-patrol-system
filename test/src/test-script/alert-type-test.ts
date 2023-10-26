import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";
import { AxiosPromise } from "axios";

const getAlertTypeList = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/alert-type/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getAlertTypeCount = async (jwt: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : "/alert-type/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const createAlertType = async (jwt: string): Promise<AxiosPromise> => {
  const date = new Date().valueOf();
  return await apiInstance.request({
    url : "/alert-type/",
    method : "post",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      type : "Fire" + date,
      description : "This is description",
      actionTaken : ["actionTaken1",
        "actionTaken2"],
      imageUrl : "this is url"

    }
  });
};

const getSingleAlertType = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/alert-type/${id}`,
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const updateSingleAlertType = async (jwt: string, id: string): Promise<AxiosPromise> => {
  const date = new Date().valueOf();
  return await apiInstance.request({
    url : `/alert-type/${id}`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt },
    data : {
      type : "Fire2" + date,
      description : "This is description2",
      actionTaken : ["actionTaken1",
        "actionTaken2"],
      imageUrl : "this is url2"

    }
  });
};

const deleteSingleAlertType = async (jwt: string, id: string): Promise<AxiosPromise> => {
  return await apiInstance.request({
    url : `/alert-type/${id}`,
    method : "delete",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

describe("ALert Type Integration Testing", () => {

  let jwt = "";
  let alertTypeId = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Alert Type list should be produced", async () => {
    const result = await getAlertTypeList(jwt);
    expect(result.status).toEqual(200);

  });

  test("Alert Type count should be produced", async () => {
    const result = await getAlertTypeCount(jwt);
    expect(result.status).toEqual(200);

  });

  test("Alert Type creation should be successful", async () => {
    const result = await createAlertType(jwt);
    alertTypeId = result.data.id;

    expect(result.status).toEqual(200);

  });

  test("Single Alert Type should be selected", async () => {
    const result = await getSingleAlertType(jwt, alertTypeId);
    expect(result.status).toEqual(200);

  });

  test("Single Alert Type should be updated", async () => {
    const result = await updateSingleAlertType(jwt, alertTypeId);
    expect(result.status).toEqual(200);

  });

  test("Single Alert Type should be deleted", async () => {
    const result = await deleteSingleAlertType(jwt, alertTypeId);
    expect(result.status).toEqual(200);

  });

});
