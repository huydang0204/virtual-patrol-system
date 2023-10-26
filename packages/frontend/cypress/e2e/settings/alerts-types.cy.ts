/**
 * Tests - Settings - Alert Types Tab
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display alert types list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 * should display the details page of an alert type on clicking view action button
 * should display one alert-type record when searching by specific name and display full list on clearing search text
 * should be able to delete alert-type on clicking delete action button
 * should be able to update alert type info (TODO: updating image left)
 * should be able to create new alert type (TODO:)
 */

import _ from "lodash";

import "../../support/commands";
import * as constants from "../../support/constants";
import {
  CyHttpMessages, Interception
} from "cypress/types/net-stubbing";
import {
  AlertTypesListResponse, UpdateAlertTypeResponse
} from "../../support/mockedResponses";
import {
  COMMON,
  MODAL_SELECTORS, TABLE_SELECTORS
} from "../../support/selectors";
import { AlertTypeResponse } from "@vps/utils/lib/dto";

const SETTINGS_PATH = constants.SETTINGS_PATH;
const tableSelector = "alert-type-list__table";
const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const tableDeleteBtn = TABLE_SELECTORS.deleteButton;
const confirmModalConfirmBtnSelector = MODAL_SELECTORS.confirm.btnConfirm;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;
const notifyModalMessageSelector = MODAL_SELECTORS.nofity.message;
const notifyModalCloseBtnSelector = MODAL_SELECTORS.nofity.btnClose;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const btnEditSelector = COMMON.btnEditSelector;
const btnSaveSelector = COMMON.btnSaveSelector;
const alertTypeDetailsPageHeadingSelector = "alert-type-details-page__heading";
const alertTypeNameSelector = "alert-type-details__name";
const alertTypeDescriptionSelector = "alert-type-details__description";
const alertTypeActionTakenSelector = "alert-type-details__action-taken";
const inputAlertTypeTypeSelector = "alert-type-input__type";
const inputAlertTypeDescriptionSelector = "alert-type-input__description";
const inputAlertTypeCheckListsSelector = "alert-type-input__check-list-";
const btnAddNextAction = "alert-type-input__add-action";

describe("Settings - Alert Types List Tab", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(SETTINGS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  // list
  it("should display alert types list", () => {
    const mockedResponse = AlertTypesListResponse;
    const totalCount = mockedResponse.count;

    const API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getAlertTypes");

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getAlertTypes").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;
        const responseData : AlertTypeResponse[] = xhr.response.body.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(3);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.ALERT_TYPES_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", 3);

        // 📌 check if the data in the table matches the fetched data - type column
        responseData.forEach((dataItem : AlertTypeResponse, index : number) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.type);
        });

        // 📌 check pagination has correctly rendered
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  // details page
  it("should display the details page of an alert type on clicking view action button", () => {
    // first alert-type api call to mock data
    const alertTypeMockedResponse = AlertTypesListResponse;

    const API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : alertTypeMockedResponse
    }).as("getAlertTypes");

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getAlertTypes").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(3);
      }
    });

    const firstRowAlertType = alertTypeMockedResponse.data[0];
    const {
      id, type, description, actionTaken
    } = firstRowAlertType;

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(`${viewDetailsButton}-${id}`).click();
    cy.getBySelector(alertTypeDetailsPageHeadingSelector).contains("Alert Type Detail");

    cy.getBySelector(alertTypeNameSelector)
      .should("contain", type);
    cy.getBySelector(alertTypeDescriptionSelector).invoke("text")
      .should("contain", description);

    actionTaken.forEach((checklist : string) => cy.getBySelector(alertTypeActionTakenSelector).contains(checklist));
  });

  // search
  it("should display one alert-type record when searching by specific name and display full list on clearing search text", () => {
    const searchText = "fire";
    const mockedResponse = AlertTypesListResponse;
    const mockedResponseData : AlertTypeResponse[] = AlertTypesListResponse.data;
    const totalCount = mockedResponse.count;
    const searchedData = mockedResponseData.filter((alertType : AlertTypeResponse) : boolean => alertType.type.toLowerCase().includes(searchText.toLowerCase()));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?searchText=${_.replace(searchText, /\s/g, "+")}&limit=10&offset=0`;
    const API_WITHOUT_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?limit=10&offset=0`;
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
          limit : 10,
          offset : 0
        }
      }
    ).as("getDataWithoutSearchValue");

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

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
        expect(responseData).to.have.lengthOf(3);
      }
    });
  });

  // delete
  it("should be able to delete alert-type on clicking delete action button", () => {
    // first alert-type api call to mock data
    const alertTypeMockedResponse = AlertTypesListResponse;

    const API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : alertTypeMockedResponse
    }).as("getAlertTypes");

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getAlertTypes").then((xhr : Interception) => {
      if (xhr.response) {
        const response = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
        expect(response.data).to.have.lengthOf(3);
      }
    });

    // delete starts
    const deletingAlertType = alertTypeMockedResponse.data[0];
    const {
      id : alertTypeId, type, description, actionTaken
    } = deletingAlertType;

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(`${tableDeleteBtn}${alertTypeId}`).click();

    const DELETE_ALERT_TYPE_API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/${alertTypeId}`;
    cy.intercept("DELETE", DELETE_ALERT_TYPE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : {
          "id" : alertTypeId,
          "type" : type,
          "priority" : "Medium",
          "description" : description,
          "actionTaken" : actionTaken,
          "imageUrl" : "/uploads/image-1689580000483.jpg",
          "deletedAt" : "2023-10-01T18:18:13.889Z"
        }
      });
    }).as("deleteAlertType");

    cy.getBySelector(confirmModalConfirmBtnSelector).should("be.visible")
      .click();

    cy.wait("@deleteAlertType").then((xhr : Interception) => {
      if (xhr.response) {
        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(DELETE_ALERT_TYPE_API);

        expect(xhr.response.body.id).to.include(alertTypeId);
        expect(xhr.response.body.type).to.include(type);
        expect(xhr.response.body.deletedAt).not.to.be.null;

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Alert Type has been deleted");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });

  // update
  it("should be able to update alert type info", () => {
    const mockedResponse = AlertTypesListResponse;
    const API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/list?limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getAlertTypes");

    cy.visit(SETTINGS_PATH);
    clickAlertTypeTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getAlertTypes").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    const updatingAlertType = mockedResponse.data[0];
    const {
      id, actionTaken
    } = updatingAlertType;

    // go to first row alert type details page
    cy.getBySelector(`${viewDetailsButton}-${id}`).click();
    cy.getBySelector(alertTypeDetailsPageHeadingSelector).contains("Alert Type Detail");

    // click Edit button
    cy.getBySelector(btnEditSelector).click();

    // edit details
    const updatingText = " (updated)";
    const newActionTakenText = "new action taken";
    cy.getBySelector(inputAlertTypeTypeSelector).type(updatingText);
    cy.getBySelector(inputAlertTypeDescriptionSelector).type(updatingText);
    if (actionTaken.length > 0) {
      // update on first check-list
      cy.getBySelector(`${inputAlertTypeCheckListsSelector}0`).type(updatingText);
    }
    // add new check list
    cy.getBySelector(btnAddNextAction).click();
    cy.getBySelector(`${inputAlertTypeCheckListsSelector}${actionTaken.length}`).type(newActionTakenText);

    const UPDATE_ALERT_TYPE_API = `${Cypress.env("CYPRESS_API_URL")}/alert-type/${id}`;
    cy.intercept("PUT", UPDATE_ALERT_TYPE_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : UpdateAlertTypeResponse
      });
    }).as("updateAlertType");

    // click save button and calls api
    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@updateAlertType").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const {
          type : reqType,
          description : reqDescription,
          actionTaken : reqActionTaken
        } = xhr.request.body;
        expect(reqType).to.include(updatingText);
        expect(reqDescription).to.include(updatingText);
        if (!!reqActionTaken && reqActionTaken.length > 0) expect(reqActionTaken).to.include(newActionTakenText);

        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(UPDATE_ALERT_TYPE_API);

        const {
          type,
          description,
          actionTaken
        } = xhr.response.body;
        expect(type).to.include(updatingText);
        expect(description).to.include(updatingText);
        if (!!actionTaken && actionTaken.length > 0) expect(actionTaken).to.include(newActionTakenText);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "Alert Type has been updated");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });
});

const clickAlertTypeTab = () : void => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`)
    .find(".a-tab")
    .eq(4)
    .click();
};