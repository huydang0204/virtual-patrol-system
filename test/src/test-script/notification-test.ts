import {
  expect,
  test,
  describe
} from "@jest/globals";
import apiInstance from "./api-instance";

const getNotificationList = async (jwt: string) => {
  return await apiInstance.request({
    url : "/notification/list",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt },
    params : {
      offset : "1",
      limit : "10"
    }
  });
};

const getNotificationCount = async (jwt: string) => {
  return await apiInstance.request({
    url : "/notification/count",
    method : "get",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const readNotifications = async (jwt: string) => {
  return await apiInstance.request({
    url : "/notification/read",
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

const readSingleNotification = async (jwt: string, id: string) => {
  return await apiInstance.request({
    url : `/notification/${id}`,
    method : "put",
    headers : { "Authorization" : "Bearer " + jwt }
  });
};

describe(" Integration Testing", () => {

  let jwt = "";
  let id = "";

  test("User should be able to login ", async () => {
    await apiInstance.login();
    jwt = apiInstance.jwtToken;
    expect(jwt.length).toBeGreaterThan(0);
  });

  test("Notification list should be produced", async () => {
    const result = await getNotificationList(jwt);

    id = result.data.data.length > 0 ? result.data.data[0]!.id : "";
    expect(result.status).toEqual(200);

  });

  test("Notification count should be produced", async () => {
    const result = await getNotificationCount(jwt);

    expect(result.status).toEqual(200);

  });

  test("Notifications should be read", async () => {
    const result = await readNotifications(jwt);
    expect(result.status).toEqual(200);

  });

  if (id) {
    test("Single notification should be read", async () => {
      const result = await readSingleNotification(jwt, id);
      expect(result.status).toEqual(200);

    });
  }

});
