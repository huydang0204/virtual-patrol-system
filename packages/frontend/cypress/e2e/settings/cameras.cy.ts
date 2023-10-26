/**
 * Tests - Settings - Cameras Tab
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display cameras list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 * should display one camera record when searching by specific name and display full list on clearing search text
 * should display 6 camera records when searching by specific site name
 * should display 4 camera records when searching by specific sop name
 * should display the details page of a camera on clicking view action button
 * should be able to update camera info when updating it
 */

import _ from "lodash";

import "../../support/commands";
import * as constants from "../../support/constants";
import {
  COMMON,
  MODAL_SELECTORS,
  TABLE_SELECTORS
} from "../../support/selectors";
import {
  CyHttpMessages, Interception
} from "cypress/types/net-stubbing";
import {
  CamerasListResponse, SOPResponse, SiteResponse, UpdateCameraDetailsResponse
} from "../../support/mockedResponses";

import {
  CameraResponse, SopResponse
} from "@vps/utils/lib/dto";

const SETTINGS_PATH = constants.SETTINGS_PATH;
const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const tableSelector = "cameras-list__table";
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const cameraDetailsPageHeadingSelector = "camera-details-page__heading";
const cameraNameSelector = "camera-details__name";
const cameraIdSelector = "camera-details__id";
const siteNameSelector = "camera-details__site-name";
const sopListSelector = "camera-details__sop-list";
const inputCameraNameSelector = "input__name";
const inputSelectSiteSelector = "input-select__site";
const btnEditSelector = COMMON.btnEditSelector;
const btnSaveSelector = COMMON.btnSaveSelector;
const inputCheckboxListToggleSelector = COMMON.inputCheckboxListToggleSelector;
const inputCheckboxListItemsSelector = COMMON.inputCheckboxListItemsSelector;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;
const notifyModalMessageSelector = MODAL_SELECTORS.nofity.message;
const notifyModalCloseBtnSelector = MODAL_SELECTORS.nofity.btnClose;
const defaultItemsPerPage = 10;

describe("Settings - Cameras List Tab", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(SETTINGS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should display cameras list", () => {
    const mockedResponse = CamerasListResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    const API = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getCameras");

    cy.visit(SETTINGS_PATH);
    clickCamerasTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getCameras").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;
        const responseData : CameraResponse[] = xhr.response.body.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.CAMERAS_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - camera name column
        responseData.forEach((dataItem : CameraResponse, index : number) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });

        // 📌 check pagination has correctly rendered
        cy.getBySelector(tablePaginationSelector).should("exist");
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", 5);
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .first()
          .should("have.class", "active");
      }
    });
  });

  it("should display one camera record when searching by specific name and display full list on clearing search text", () => {
    const searchText = "DI01 - Wimborne PS L1";
    const mockedResponse = CamerasListResponse;
    const mockedResponseData : CameraResponse[] = CamerasListResponse.data;
    const totalCount = mockedResponse.count;
    const searchedData = mockedResponseData.filter((camera : CameraResponse) : boolean => camera.name.toLowerCase().includes(searchText.toLowerCase()));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0&searchText=${_.replace(searchText, /\s/g, "+")}`;
    const API_WITHOUT_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0`;
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
    clickCamerasTab();

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

  it("should display 6 camera records when searching by specific site name", () => {
    const searchText = "20 sites";
    const mockedResponseData : CameraResponse[] = CamerasListResponse.data;
    const searchedData = mockedResponseData.filter((camera : CameraResponse) : boolean => camera.siteName ? camera.siteName.toLowerCase().includes(searchText.toLowerCase()) : false);

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0&searchText=${_.replace(searchText, /\s/g, "+")}`;
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

    cy.visit(SETTINGS_PATH);
    clickCamerasTab();

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
  });

  it("should display 4 camera records when searching by specific sop name", () => {
    const searchText = "s-sop1";
    const mockedResponseData : CameraResponse[] = CamerasListResponse.data;
    const searchedData = _.filter(mockedResponseData, (obj : CameraResponse) : boolean => _.some(obj.sops, { name : searchText }));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0&searchText=${_.replace(searchText, /\s/g, "+")}`;
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

    cy.visit(SETTINGS_PATH);
    clickCamerasTab();

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
  });

  // camera details page
  it("should display the details page of a camera on clicking view action button", () => {
    const mockedResponse = CamerasListResponse;

    const API = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getCameras");

    cy.visit(SETTINGS_PATH);
    clickCamerasTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getCameras").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    const firstRowCamera = mockedResponse.data[0];
    const {
      id, name, siteName, sops
    } = firstRowCamera;
    cy.getBySelector(`${viewDetailsButton}-${id}`).click();
    cy.getBySelector(cameraDetailsPageHeadingSelector).contains("Camera Detail");

    cy.getBySelector(cameraNameSelector)
      .should("contain", name);
    cy.getBySelector(cameraIdSelector).invoke("text")
      .should("contain", id);
    cy.getBySelector(siteNameSelector).invoke("text")
      .should("contain", siteName);
    sops.forEach((sop : SopResponse) => cy.getBySelector(sopListSelector).contains(sop.name));
  });

  // updating camera info
  // - fetch site api
  // - fetch sop api
  // - update details
  it("should be able to update camera info when updating it", () => {
    // first calls site api to fill mocked site data
    const siteMockedResponse = SiteResponse;
    const siteTotalCount = siteMockedResponse.count;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/site/list`, {
      statusCode : 200,
      body : siteMockedResponse
    }).as("getSites");

    // first calls sop api to fill mocked spo data
    const sopMockedResponse = SOPResponse;
    const sopTotalCount = sopMockedResponse.count;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/sop/list`, {
      statusCode : 200,
      body : sopMockedResponse
    }).as("getSOPs");

    // update starts
    const mockedResponse = CamerasListResponse;
    const updatingCamera = mockedResponse.data[0];

    const API = `${Cypress.env("CYPRESS_API_URL")}/camera/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getCameras");

    cy.visit(SETTINGS_PATH);
    clickCamerasTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getCameras").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    // go to first row camera details page
    cy.getBySelector(`${viewDetailsButton}-${updatingCamera.id}`).click();

    cy.wait("@getSites").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/site/list`);
        expect(responseData).to.have.lengthOf(siteTotalCount);
      }
    });

    cy.wait("@getSOPs").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/sop/list`);
        expect(responseData).to.have.lengthOf(sopTotalCount);
      }
    });

    // click Edit button
    cy.getBySelector(btnEditSelector).click();

    // edit details
    const appendingText = " updated";
    const updatingSiteName = "abc";
    cy.getBySelector(inputCameraNameSelector).type(appendingText);
    cy.getBySelector(inputSelectSiteSelector).select(updatingSiteName);
    cy.getBySelector(inputCheckboxListToggleSelector).click();
    cy.get(`[data-test="${inputCheckboxListItemsSelector}"]`)
      .find(".option")
      .eq(3)
      .click();
    cy.getBySelector(inputCheckboxListToggleSelector).click();

    const UPDATE_CAMERA_API = `${Cypress.env("CYPRESS_API_URL")}/camera/${updatingCamera.id}`;
    cy.intercept("PUT", UPDATE_CAMERA_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : UpdateCameraDetailsResponse
      });
    }).as("updateCameraDetails");

    // click Save button and call api
    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@updateCameraDetails").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const requestPayload = xhr.request.body;
        expect(requestPayload.name).to.include(appendingText);

        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(UPDATE_CAMERA_API);

        expect(xhr.response.body.name).to.include(appendingText);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Camera has been updated");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });
});

const clickCamerasTab = () : void => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`)
    .find(".a-tab")
    .eq(2)
    .click();
};