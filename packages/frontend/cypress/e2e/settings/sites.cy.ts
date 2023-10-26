/**
 * Tests - Settings - Sites Tab
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display sites list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 * should display one site record when searching by specific name and display full list on clearing search text
 * should be able to delete site on clicking delete action button
 * should be able to update site info when updating it
 * should be able to create a new site
 */

import _ from "lodash";

import "../../support/commands";
import * as constants from "../../support/constants";
import {
  CyHttpMessages, Interception
} from "cypress/types/net-stubbing";
import {
  COMMON,
  MODAL_SELECTORS, TABLE_SELECTORS
} from "../../support/selectors";
import {
  CamerasListResponse, SitesListResponse, UpdateSiteDetailsResponse
} from "../../support/mockedResponses";
import { SiteResponse } from "@vps/utils/lib/dto";

const SETTINGS_PATH = constants.SETTINGS_PATH;
const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const tableSelector = "site-list__table";
const siteDetailsPageHeadingSelector = "site-edit-page__heading";
const siteCreatePageHeadingSelector = "site-create-page__heading";
const inputSiteNameSelector = "input__name";
const inputSiteDescriptionSelector = "input__description";
const addCamerasModalConfirmBtn = "add-cameras-modal__confirm-btn";
const btnCreateSiteSelector = "btn-create-site";
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const tableEditBtn = TABLE_SELECTORS.editButton;
const tableDeleteBtn = TABLE_SELECTORS.deleteButton;
const tableCheckboxSelector = TABLE_SELECTORS.checkbox;
const confirmModalConfirmBtnSelector = MODAL_SELECTORS.confirm.btnConfirm;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;
const notifyModalMessageSelector = MODAL_SELECTORS.nofity.message;
const notifyModalCloseBtnSelector = MODAL_SELECTORS.nofity.btnClose;
const btnSaveSelector = COMMON.btnSaveSelector;
const inputCheckboxListToggleSelector = COMMON.inputCheckboxListToggleSelector;
const defaultItemsPerPage = 10;

describe("Settings - Site List Tab", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(SETTINGS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  // list
  it("should display sites list", () => {
    const mockedResponse = SitesListResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    const API = `${Cypress.env("CYPRESS_API_URL")}/site/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSites");

    cy.visit(SETTINGS_PATH);
    clickSiteTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getSites").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;
        const responseData : SiteResponse[] = xhr.response.body.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.SITES_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - camera name column
        responseData.forEach((dataItem : SiteResponse, index : number) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });

        // 📌 check pagination has correctly rendered
        cy.getBySelector(tablePaginationSelector).should("exist");
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", 2);
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .first()
          .should("have.class", "active");
      }
    });
  });

  // search
  it("should display one site record when searching by specific name and display full list on clearing search text", () => {
    const searchText = "abc";
    const mockedResponse = SitesListResponse;
    const mockedResponseData : SiteResponse[] = SitesListResponse.data;
    const totalCount = mockedResponse.count;
    const searchedData = mockedResponseData.filter((site : SiteResponse) : boolean => site.name.toLowerCase().includes(searchText.toLowerCase()));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/site/list?searchText=${_.replace(searchText, /\s/g, "+")}&limit=10&offset=0`;
    const API_WITHOUT_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/site/list?limit=10&offset=0`;
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
    clickSiteTab();

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

  // delete
  it("should be able to delete site on clicking delete action button", () => {
    const siteMockedResponse = SitesListResponse;
    const deletingSite = siteMockedResponse.data[0];
    const {
      id : siteId, name, description
    } = deletingSite;

    const mockedResponse = SitesListResponse;
    const DELETE_API = `${Cypress.env("CYPRESS_API_URL")}/site/list?limit=10&offset=0`;
    cy.intercept("GET", DELETE_API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSites");

    cy.visit(SETTINGS_PATH);
    clickSiteTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getSites").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(DELETE_API);
      }
    });

    cy.getBySelector(`${tableDeleteBtn}${siteId}`).click();

    const DELETE_SITE_API = `${Cypress.env("CYPRESS_API_URL")}/site/${siteId}`;
    cy.intercept("DELETE", DELETE_SITE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : {
          "deleted" : true,
          "description" : description,
          "id" : siteId,
          "name" : `${name} (deleted)`,
          "noCameras" : 0
        }
      });
    }).as("deleteSite");

    cy.getBySelector(confirmModalConfirmBtnSelector).should("be.visible")
      .click();

    cy.wait("@deleteSite").then((xhr : Interception) => {
      if (xhr.response) {
        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(DELETE_SITE_API);

        expect(xhr.response.body.id).to.include(siteId);
        expect(xhr.response.body.name).to.include(name);
        expect(xhr.response.body.deleted).to.be.true;

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Site has been deleted");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });

  // update
  it("should be able to update site info when updating it", () => {
    const mockedResponse = SitesListResponse;

    const LIST_API = `${Cypress.env("CYPRESS_API_URL")}/site/list?limit=10&offset=0`;

    cy.intercept("GET", LIST_API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSites");

    cy.visit(SETTINGS_PATH);
    clickSiteTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getSites").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(LIST_API);
      }
    });

    const updatingSite = mockedResponse.data[2];
    const { id : siteId } = updatingSite;

    // call site api
    const SITE_SINGLE_API = `${Cypress.env("CYPRESS_API_URL")}/site/${siteId}`;

    cy.intercept("GET", SITE_SINGLE_API, {
      statusCode : 200,
      body : updatingSite
    }).as("getSingleSite");

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    // call camera api
    const cameraMockedResponse = CamerasListResponse;
    const API = `${Cypress.env("CYPRESS_API_URL")}/camera/list`;
    cy.intercept("GET", API, {
      statusCode : 200,
      body : {
        count : 50,
        data : cameraMockedResponse.data
      }
    }).as("getCameras");

    cy.getBySelector(`${tableEditBtn}${siteId}`).click();
    cy.getBySelector(siteDetailsPageHeadingSelector).contains("Site Detail");

    cy.wait("@getSingleSite").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(SITE_SINGLE_API);
      }
    });

    cy.wait("@getCameras").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    // edit details
    const appendingTextName = " (updated)";
    const appendingTextDescription = " (updated)";
    cy.getBySelector(inputSiteNameSelector).type(appendingTextName);
    cy.getBySelector(inputSiteDescriptionSelector).type(appendingTextDescription);

    cy.getBySelector(inputCheckboxListToggleSelector).click();
    cy.getBySelector(`${tableCheckboxSelector}${cameraMockedResponse.data[0].id}`).click();
    cy.getBySelector(addCamerasModalConfirmBtn).click();

    const UPDATE_SITE_API = `${Cypress.env("CYPRESS_API_URL")}/site/${updatingSite.id}`;
    cy.intercept("PUT", UPDATE_SITE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : UpdateSiteDetailsResponse
      });
    }).as("updateSiteDetails");

    // click Save button and call api
    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@updateSiteDetails").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const requestPayload = xhr.request.body;
        expect(requestPayload.name).to.include(appendingTextName);
        expect(requestPayload.description).to.include(appendingTextDescription);
        expect(requestPayload.cameraIds).to.include(cameraMockedResponse.data[0].id);

        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(UPDATE_SITE_API);

        expect(xhr.response.body.name).to.include(appendingTextName);
        expect(xhr.response.body.description).to.include(appendingTextDescription);
        expect(xhr.response.body.cameraIds).to.include(cameraMockedResponse.data[0].id);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Site has been updated");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });

  // create
  it("should be able to create a new site", () => {
    cy.visit(SETTINGS_PATH);
    clickSiteTab();

    const cameraMockedResponse = CamerasListResponse;
    const siteName = "new-site-12345";
    const siteDescription = "new site description";
    const cameraId = cameraMockedResponse.data[0].id;

    // cameras mocking
    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/camera/list`, {
      statusCode : 200,
      body : cameraMockedResponse
    }).as("getCameras");

    cy.getBySelector(btnCreateSiteSelector).click();
    cy.getBySelector(siteCreatePageHeadingSelector).contains("Create Site");

    cy.wait("@getCameras").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
      }
    });
    
    cy.getBySelector(inputSiteNameSelector).type(siteName);
    cy.getBySelector(inputSiteDescriptionSelector).type(siteDescription);

    cy.getBySelector(inputCheckboxListToggleSelector).click();
    cy.getBySelector(`${tableCheckboxSelector}${cameraId}`).click();
    cy.getBySelector(addCamerasModalConfirmBtn).click();

    const CREATE_SITE_API = `${Cypress.env("CYPRESS_API_URL")}/site`;
    cy.intercept("POST", CREATE_SITE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
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
            "name" : siteName,
            "description" : siteDescription,
            "cameraIds" : ["54f709d2-c0c7-2bea-fdc8-ac13b74a6882"]
          }
        });
      }
    }).as("createSite");

    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@createSite").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const requestPayload = xhr.request.body;
        expect(requestPayload.name).to.equal(siteName);
        expect(requestPayload.description).to.equal(siteDescription);
        expect(requestPayload.cameraIds).to.include(cameraId);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Site has been created");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });
});

const clickSiteTab = () : void => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`)
    .find(".a-tab")
    .eq(3)
    .click();
};