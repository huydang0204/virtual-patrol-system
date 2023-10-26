import _ from "lodash";
import moment from "moment-timezone";
import "../../support/commands";
import * as constants from "../../support/constants";
import { 
  COMMON, 
  MODAL_SELECTORS, 
  TABLE_SELECTORS 
} from "../../support/selectors";
import { 
  CyHttpMessages, 
  Interception 
} from "cypress/types/net-stubbing";
import { 
  AllUsersActivities,
  RecentLogins, 
  SingleUserActivities, 
  UsersListResponse 
} from "../../support/mockedResponses";

import { 
  UserActivityResponse, 
  UserResponse 
} from "@vps/utils/lib/dto";
import { 
  ActivityType, 
  FindAndCountResponse 
} from "@vps/utils/lib/data";

const SETTINGS_PATH = constants.SETTINGS_PATH;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const tableDateRangePickerSelector = TABLE_SELECTORS.dateRangePicker;
const tableDateRangePickerApplyBtn = TABLE_SELECTORS.dateRangePickerApplyBtn;
const btnBlockSelector = COMMON.btnUserBlockSelector;
const btnActivateSelector = COMMON.btnUserActivateSelector;
const btnEditSelector = COMMON.btnEditSelector;
const btnSaveSelector = COMMON.btnSaveSelector;
const btnDeleteSelector = COMMON.btnUserDeleteSelector;
const btnCreateSelector = COMMON.btnCreateSelector;
const btnConfirmSelector = MODAL_SELECTORS.confirm.btnConfirm;
const notifyModalMessageSelector = MODAL_SELECTORS.nofity.message;
const notifyModalCloseBtnSelector = MODAL_SELECTORS.nofity.btnClose;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;
const tableSelector = "users-list__table";
const userDetailsPageHeadingSelector = "user-details-page__heading";
const detailsIdSelector = "user-details-page__id";
const detailsNameSelector = "user-details-page__name";
const detailsEmailSelector = "user-details-page__email";
const detailsCallingCodeSelector = "user-details-page__callingCode";
const detailsPhoneSelector = "user-details-page__phone";
const detailsRoleSelector = "user-details-page__role";
const userCreatePageHeadingSelector = "user-create-page__heading";
const defaultItemsPerPage = 10;

describe("Settings - Users List Tab", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(SETTINGS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should display users list", () => {
    const mockedResponse = UsersListResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    const API = `${Cypress.env("CYPRESS_API_URL")}/user/list?limit=10&offset=0&withBlockedUsers=true&filterRoles=`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getUsers");

    cy.visit(SETTINGS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getUsers").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;
        const responseData : UserResponse[] = xhr.response.body.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.USERS_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - username column
        responseData.forEach((dataItem : UserResponse, index : number) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });

        // 📌 check pagination has correctly rendered
        cy.getBySelector(tablePaginationSelector).should("exist");
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", Math.ceil(totalCount / itemPerPage));
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .first()
          .should("have.class", "active");
      }
    });
  });

  // search
  it("should display one user record when searching by specific name and display full list on clearing search text", () => {
    const searchText = "newuser1";
    const mockedResponse = UsersListResponse;
    const mockedResponseData = mockedResponse.data;
    const totalCount = mockedResponse.count;

    const searchedData = mockedResponseData.filter((user : UserResponse) => user.name.toLowerCase().includes(searchText.toLowerCase()));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/user/list?searchText=${searchText}&limit=10&offset=0&withBlockedUsers=true&filterRoles=`;
    const API_WITHOUT_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/user/list?limit=10&offset=0&withBlockedUsers=true&filterRoles=`;
    cy.intercept(
      "GET",
      API_WITH_SEARCH,
      {
        statusCode : 200,
        body : {
          count : searchedData.length,
          data : searchedData,
          limit : 10,
          offset : 0
        }
      }
    ).as("getDataBySearching");
    cy.intercept(
      "GET",
      API_WITHOUT_SEARCH,
      {
        statusCode : 200,
        body : {
          count : totalCount,
          data : mockedResponse.data,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    ).as("getDataWithoutSearchValue");

    cy.visit(SETTINGS_PATH);

    cy.getBySelector(tableSearchInputSelector).type(searchText);

    cy.wait("@getDataBySearching").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API_WITH_SEARCH);
        expect(responseData).to.have.lengthOf(searchedData.length);
      }
    });

    // check that the pagination is not displayed as there are only less items of itemsPerPage
    cy.getBySelector(tablePaginationSelector).should("not.exist");

    // click clear button inside search input
    cy.getBySelector(tableSearchInputClearSelector).should("be.visible")
      .click();

    cy.wait("@getDataWithoutSearchValue").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API_WITHOUT_SEARCH);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });
    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  // recent logins
  it("should display a list of Recent logins of all users", () => {
    const mockedResponse = RecentLogins;
    const totalCount = mockedResponse.count;
    const itemPerPage = 100;
    const activityType = [ActivityType.UserLogin];

    const encodedActivityTypes = activityType.map((type : string) => "%22" + type + "%22");
    const API = `${Cypress.env("CYPRESS_API_URL")}/activity/list?types=[${encodedActivityTypes}]&limit=${itemPerPage}&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getRecentLogins");

    cy.visit(SETTINGS_PATH);

    cy.wait("@getRecentLogins").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);
      }
    });
  });

  // recent activities by all users
  it("should display a list of all recent activities of all users", () => {
    const mockedResponse = AllUsersActivities;
    const itemPerPage = 100;

    const activityTypes = _.without(Object.values(ActivityType), ActivityType.UserLogin);
    const encodedActivityTypes = activityTypes.map((type : string) => "%22" + type + "%22");

    const API = `${Cypress.env("CYPRESS_API_URL")}/activity/list?types=[${encodedActivityTypes}]&limit=${itemPerPage}&offset=0`;
    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getAllUsersRecentActivities");

    cy.visit(SETTINGS_PATH);

    cy.wait("@getAllUsersRecentActivities").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(10);
        expect(response.count).to.equal(100);
      }
    });
  });

  // showing a single user
  it("should display a detailed user info, together with his recent activities, and can filter by date", () => {
    fetchUserList().then((data : FindAndCountResponse<UserResponse>) => {
      const userResponse = data;

      // check user details info
      const selectedUser = userResponse.data.filter((user : UserResponse) => user.name === "mr.hpn");
      if (selectedUser.length > 0) {
        const {
          id, name, email
        } = selectedUser[0];
        cy.getBySelector(`${viewDetailsButton}-${id}`).click();
        cy.getBySelector(userDetailsPageHeadingSelector).contains("User Details");
        cy.get(`[data-test="${detailsIdSelector}"]`).should(($input : JQuery<HTMLElement>) => {
          expect($input.val()).to.equal(id);
        });
        cy.get(`[data-test="${detailsNameSelector}"]`).should(($input : JQuery<HTMLElement>) => {
          expect($input.val()).to.equal(name);
        });
        cy.get(`[data-test="${detailsEmailSelector}"]`).should(($input : JQuery<HTMLElement>) => {
          expect($input.val()).to.equal(email);
        });

        // check user activities
        fetchSingleUserActivityList(id).then((activities : FindAndCountResponse<UserActivityResponse>) => {
          expect(activities.data.length).to.equal(SingleUserActivities.count);

          const fromDate = "2023-08-26",
            toDate = "2023-08-29";
          
          // Filter the items within the date range - should output 1 item
          const filteredResponse = activities.data.filter((item : UserActivityResponse) => {
            const createdAt = moment(item.createdAt);
            return createdAt.isSameOrAfter(moment(fromDate), "day") && createdAt.isSameOrBefore(moment(toDate), "day");
          });

          const activityTypes = _.without(Object.values(ActivityType), ActivityType.UserLogin);
          const encodedActivityTypes = activityTypes.map((type : string) => "%22" + type + "%22");
          const API = `${Cypress.env("CYPRESS_API_URL")}/activity/list?types=[${encodedActivityTypes}]&userId=${id}&limit=100&offset=0&from=${fromDate}&to=${toDate}`;

          cy.intercept("GET", API, {
            statusCode : 200,
            body : {
              count : 1,
              data : filteredResponse,
              limit : 100,
              offset : 0
            }
          }).as("getActivitiesByUserByfilter");

          cy.getBySelector(tableDateRangePickerSelector).click();
          // getting Calendar controls
          cy.get(".-shown > .Calendar__monthText").click();
          cy.get(" :nth-child(8) > .Calendar__monthSelectorItemText").click(); // Select August
          cy.get("[aria-label=\"Saturday, 26 August 2023\"]").click();
          cy.get("[aria-label=\"Tuesday, 29 August 2023\"]").click();
          cy.getBySelector(tableDateRangePickerApplyBtn).click();

          cy.wait("@getActivitiesByUserByfilter").then((xhr: Interception) => {
            if (xhr.response) {
              const response = xhr.response.body;
      
              expect(xhr.response.statusCode).to.equal(200);
              expect(xhr.request.url).to.eq(API);
              expect(response.count).to.equal(1);
            }
          });
        });
      }
    });
  });

  // block & activate user
  it("should be able to block and activate user", () => {
    fetchUserList().then((data : FindAndCountResponse<UserResponse>) => {
      const userResponse = data;

      // check user details info
      const selectedUser = userResponse.data.filter((user : UserResponse) => user.name === "mr.hpn");
      if (selectedUser.length > 0) {
        const { id } = selectedUser[0];
        cy.getBySelector(`${viewDetailsButton}-${id}`).click();
        cy.getBySelector(userDetailsPageHeadingSelector).contains("User Details");
        
        cy.getBySelector(btnBlockSelector).click();

        // block user
        const BLOCK_API = `${Cypress.env("CYPRESS_API_URL")}/user/block?id=${id}`;
        cy.intercept("PUT", BLOCK_API, {
          statusCode : 200,
          body : {
            "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
            "nxWitnessId" : null,
            "avatar" : null,
            "name" : "huydang",
            "email" : "admin@vps.com",
            "callingCode" : "",
            "phoneNumber" : "",
            "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
            "status" : "blocked",
            "isVerified" : true,
            "blockingReason" : null
          }
        }).as("blockUser");

        cy.getBySelector(btnConfirmSelector).click();

        cy.wait("@blockUser").then((xhr : Interception) => {
          if (xhr.response) {
            const response = xhr.response.body;

            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.url).to.eq(BLOCK_API);
            expect(response.status).to.equal("blocked");
            cy.getBySelector(notifyModalMessageSelector).should("contain", "User blocked successfully");
            cy.getBySelector(notifyModalCloseBtnSelector).click();
          }
        });

        // activate user
        cy.getBySelector(btnActivateSelector).click();

        const ACTIVATE_API = `${Cypress.env("CYPRESS_API_URL")}/user/activate?id=${id}`;
        cy.intercept("PUT", ACTIVATE_API, {
          statusCode : 200,
          body : {
            "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
            "nxWitnessId" : null,
            "avatar" : null,
            "name" : "huydang",
            "email" : "admin@vps.com",
            "callingCode" : "",
            "phoneNumber" : "",
            "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
            "status" : "active",
            "isVerified" : true,
            "blockingReason" : null
          }
        }).as("activateUser");

        cy.getBySelector(btnConfirmSelector).click();

        cy.wait("@activateUser").then((xhr : Interception) => {
          if (xhr.response) {
            const response = xhr.response.body;

            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.url).to.eq(ACTIVATE_API);
            expect(response.status).to.equal("active");
            cy.getBySelector(notifyModalMessageSelector).should("contain", "User activated successfully");
            cy.getBySelector(notifyModalCloseBtnSelector).click();
          }
        });
      }
    });
  });

  // edit
  it("should be able to update user details", () => {
    fetchUserList().then((data : FindAndCountResponse<UserResponse>) => {
      const userResponse = data;

      // check user details info
      const selectedUser = userResponse.data.filter((user : UserResponse) => user.name === "mr.hpn");
      if (selectedUser.length > 0) {
        const { id } = selectedUser[0];
        cy.getBySelector(`${viewDetailsButton}-${id}`).click();
        cy.getBySelector(userDetailsPageHeadingSelector).contains("User Details");
        
        cy.getBySelector(btnEditSelector).click();
        
        const appendingTextToName = " (updated)";
        const updatingPhoneNumber = "999999999";
        const updatingRole = "Officer";
        cy.getBySelector(detailsNameSelector).type(appendingTextToName);
        cy.getBySelector(detailsPhoneSelector).type(updatingPhoneNumber);
        cy.getBySelector(detailsRoleSelector).select(updatingRole);

        const UPDATE_USER_API = `${Cypress.env("CYPRESS_API_URL")}/user/${id}`;
        cy.intercept("PUT", UPDATE_USER_API, (req : CyHttpMessages.IncomingHttpRequest) => {
          req.reply({
            statusCode : 200,
            body : {
              "id" : "7fc40fc4-f901-4a96-b56b-ce0af94c2f9d",
              "nxWitnessId" : null,
              "avatar" : null,
              "name" : "huydang (updated)",
              "email" : "admin@vps.com",
              "callingCode" : "+65",
              "phoneNumber" : updatingPhoneNumber,
              "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
              "status" : "active",
              "isVerified" : true,
              "blockingReason" : null,
              "role" : updatingRole
            }
          });
        }).as("updateUser");
    
        // click save button and calls api
        cy.getBySelector(btnSaveSelector).click();

        cy.wait("@updateUser").then((xhr : Interception) => {
          if (xhr.response) {
            // check payload
            const {
              name : reqName,
              phoneNumber : reqPhoneNumber
            } = xhr.request.body;
            expect(reqName).to.include(appendingTextToName);
            expect(reqPhoneNumber).to.include(updatingPhoneNumber);
    
            // check response
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.url).to.eq(UPDATE_USER_API);
    
            const {
              name,
              phoneNumber,
              role
            } = xhr.response.body;
            expect(name).to.include(appendingTextToName);
            expect(phoneNumber).to.include(phoneNumber);
            expect(role).to.eq(updatingRole);
    
            cy.getBySelector(notifyModalSelector).should("exist");
            cy.getBySelector(notifyModalMessageSelector).should("contain", "User has been updated");
            cy.getBySelector(notifyModalCloseBtnSelector).click();
          }
        });
      }
    });
  });

  // delete
  it("should be able to delete user", () => {
    fetchUserList().then((data : FindAndCountResponse<UserResponse>) => {
      const userResponse = data;

      // check user details info
      const selectedUser = userResponse.data.filter((user : UserResponse) => user.name === "mr.hpn");
      if (selectedUser.length > 0) {
        const { id } = selectedUser[0];
        cy.getBySelector(`${viewDetailsButton}-${id}`).click();
        cy.getBySelector(userDetailsPageHeadingSelector).contains("User Details");
        
        cy.getBySelector(btnDeleteSelector).click();

        // delete user
        const DELETE_API = `${Cypress.env("CYPRESS_API_URL")}/user/${id}`;
        cy.intercept("DELETE", DELETE_API, {
          statusCode : 200,
          body : {
            "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
            "nxWitnessId" : null,
            "avatar" : null,
            "name" : "huydang",
            "email" : "admin@vps.com",
            "callingCode" : "",
            "phoneNumber" : "",
            "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
            "status" : "inactive",
            "isVerified" : true,
            "blockingReason" : null
          }
        }).as("deleteUser");

        cy.getBySelector(btnConfirmSelector).click();

        cy.wait("@deleteUser").then((xhr : Interception) => {
          if (xhr.response) {
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.url).to.eq(DELETE_API);
            cy.getBySelector(notifyModalMessageSelector).should("contain", "User deleted successfully");
            cy.getBySelector(notifyModalCloseBtnSelector).click();
          }
        });
      }
    });
  });

  // create
  it("should be able to create user", () => {
    cy.getBySelector(btnCreateSelector).click();

    cy.getBySelector(userCreatePageHeadingSelector).contains("Create new user");

    const newUser = {
      name : "new",
      email : "agc@gmail.com",
      callingCode : "+65",
      phoneNumber : "999999999"
    };
    cy.getBySelector(detailsNameSelector).type(newUser.name);
    cy.getBySelector(detailsEmailSelector).type(newUser.email);
    cy.getBySelector(detailsCallingCodeSelector).type(newUser.callingCode);
    cy.getBySelector(detailsPhoneSelector).type(newUser.phoneNumber);

    const CREATE_API = `${Cypress.env("CYPRESS_API_URL")}/user`;
    cy.intercept("POST", CREATE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      const requestPayload = req.body;

      if (requestPayload && requestPayload.name && requestPayload.name.includes("preventCreate")) {
        req.reply({
          statusCode : 400,
          body : { message : "Creation prevented due to payload condition" }
        });
      } else {
        req.reply({
          statusCode : 200,
          body : {
            "id" : "1",
            "avatar" : null,
            "name" : newUser.name,
            "email" : newUser.email,
            "callingCode" : newUser.callingCode,
            "phoneNumber" : newUser.phoneNumber,
            "roleId" : "1",
            "status" : "inactive",
            "password" : "se8bpyq2"
          }
        });
      }
    }).as("createUser");

    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@createUser").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const requestPayload = xhr.request.body;
        expect(requestPayload.name).to.equal(newUser.name);
        expect(requestPayload.email).to.equal(newUser.email);
        expect(requestPayload.callingCode).to.equal(newUser.callingCode);
        expect(requestPayload.phoneNumber).to.equal(newUser.phoneNumber);

        // check response
        const response = xhr.response.body;
        expect(response.name).to.equal(newUser.name);
        expect(response.email).to.equal(newUser.email);
        expect(response.callingCode).to.equal(newUser.callingCode);
        expect(response.phoneNumber).to.equal(newUser.phoneNumber);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "User has been created");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });
});

// functions
const fetchUserList = (): Cypress.Chainable<FindAndCountResponse<UserResponse>> => {
  const userMockedResponse = UsersListResponse;
  const totalCount = userMockedResponse.count;
  const itemPerPage = defaultItemsPerPage;

  const API = `${Cypress.env("CYPRESS_API_URL")}/user/list?limit=10&offset=0&withBlockedUsers=true&filterRoles=`;

  cy.intercept("GET", API, {
    statusCode : 200,
    body : userMockedResponse
  }).as("getUsers");

  return cy.wrap(new Promise<FindAndCountResponse<UserResponse>>((resolve : (value: FindAndCountResponse<UserResponse>) => void) => {
    cy.visit(SETTINGS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector).should("not.exist");

    cy.wait("@getUsers").then((xhr: Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        resolve(response);
      }
    });
  }));
};

const fetchSingleUserActivityList = (userId : string): Cypress.Chainable<FindAndCountResponse<UserActivityResponse>> => {
  const SingleUserActivitiesMockedResponse = SingleUserActivities;
  const totalCount = SingleUserActivitiesMockedResponse.count;
  const itemPerPage = 100;

  const activityTypes = _.without(Object.values(ActivityType), ActivityType.UserLogin);
  const encodedActivityTypes = activityTypes.map((type : string) => "%22" + type + "%22");

  const API = `${Cypress.env("CYPRESS_API_URL")}/activity/list?types=[${encodedActivityTypes}]&userId=${userId}&limit=${itemPerPage}&offset=0`;

  cy.intercept("GET", API, {
    statusCode : 200,
    body : SingleUserActivitiesMockedResponse
  }).as("getActivitiesByUser");

  return cy.wrap(new Promise<FindAndCountResponse<UserActivityResponse>>((resolve : (value: FindAndCountResponse<UserActivityResponse>) => void) => {
    // cy.visit(SETTINGS_PATH);

    cy.wait("@getActivitiesByUser").then((xhr: Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.count).to.equal(totalCount);

        resolve(response);
      }
    });
  }));
};
