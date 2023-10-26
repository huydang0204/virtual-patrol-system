/**
 * Tests - Settings - Special SOPs Tab
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display Special sops list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 * should display one sop record when searching by specific name and display full list on clearing search text
 * should display the details page of a sop on clicking view action button
 * should be able to delete a sop on clicking delete action button
 * should be able to update sop info
 * should create a new special sop
 */

import moment from "moment-timezone";
import "../../support/commands";
import * as constants from "../../support/constants";
import { 
  CyHttpMessages, Interception 
} from "cypress/types/net-stubbing";
import { 
  CreateSpecialSOPResponse,
  SpecialSOPListResponse, 
  UpdateSpecialSOPResponse 
} from "../../support/mockedResponses";
import { 
  COMMON,
  MODAL_SELECTORS, TABLE_SELECTORS 
} from "../../support/selectors";
import { SopResponse } from "@vps/utils/lib/dto";
import { getFormattedDate } from "../../../src/utils/time-format";

const SETTINGS_PATH = constants.SETTINGS_PATH;
const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const tableDeleteBtn = TABLE_SELECTORS.deleteButton;
const tableDatePickerApplyBtn = TABLE_SELECTORS.datePickerApplyBtn;
const confirmModalConfirmBtnSelector = MODAL_SELECTORS.confirm.btnConfirm;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;
const notifyModalMessageSelector = MODAL_SELECTORS.nofity.message;
const notifyModalCloseBtnSelector = MODAL_SELECTORS.nofity.btnClose;
const btnEditSelector = COMMON.btnEditSelector;
const btnSaveSelector = COMMON.btnSaveSelector;
const btnCreateSelector = COMMON.btnCreateSelector;
const tableSelector = "sop-list__table";
const sopDetailsPageHeadingSelector = "sop-details-page__heading";
const sopNameSelector = "sop-details__name";
const sopTypeSelector = "sop-details__type";
const sopStartDateSelector = "sop-details__start-date";
const sopEndDateSelector = "sop-details__end-date";
const sopChecklistsSelector = "sop-details__checklists";
const inputSOPNameSelector = "sop-input__name";
const inputSOPCheckListsSelector = "sop-input__checklist-";
const inputSOPStartDateSelector = "date-input__sop-start-date";
const inputSOPEndDateSelector = "date-input__sop-end-date";
const btnAddNextAction = "sop-input__add-action";
const defaultItemsPerPage = 10;

describe("Settings - Special SOPs List Tab", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(SETTINGS_PATH);
    cy.wait(2000);
  });
  
  after(() => cy.logout());

  // list
  it("should display Special sops list", () => {
    const mockedResponse = SpecialSOPListResponse;
    const totalCount = mockedResponse.count;

    const API = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSpecialSOPs");

    cy.visit(SETTINGS_PATH);
    clickSopTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.get(".tabs .a-tab:contains('Special SOP')").should("exist");
    cy.get(".tabs .a-tab:contains('Special SOP')")
      .should("have.class", "bg-primary")
      .then(() : void => {
        cy.wait("@getSpecialSOPs").then((xhr : Interception) => {
          if (xhr.response) {
            const response = xhr.response.body;
            const responseData : SopResponse[] = xhr.response.body.data;
    
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.url).to.eq(API);
            expect(response.data).to.have.lengthOf(defaultItemsPerPage);
            expect(response.count).to.equal(totalCount);
    
            // 📌 check table columns are correctly rendered
            constants.SPECIAL_SOP_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
              .should("exist"));
    
            // 📌 check if the table is rendered with the correct number of rows
            cy.getBySelector(tableSelector)
              .find("tbody > tr")
              .should("have.length", defaultItemsPerPage);
            
            // 📌 check if the data in the table matches the fetched data - name column
            responseData.forEach((dataItem : SopResponse, index : number) => {
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
  });

  // search
  it("should display one sop record when searching by specific name and display full list on clearing search text", () => {
    const searchText = "s-sop1";
    const mockedResponse = SpecialSOPListResponse;
    const mockedResponseData : SopResponse[] = mockedResponse.data;
    const totalCount = mockedResponse.count;

    const searchedData = mockedResponseData.filter((sop : SopResponse) => sop.name.toLowerCase().includes(searchText.toLowerCase()));

    const API_WITH_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&searchText=${searchText}&limit=10&offset=0`;
    const API_WITHOUT_SEARCH = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&limit=10&offset=0`;
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
    clickSopTab();
    cy.wait(2000);

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

  // view details
  it("should display the details page of a sop on clicking view action button", () => {
    const mockedResponse = SpecialSOPListResponse;
    const API = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSpecialSOPs");

    cy.visit(SETTINGS_PATH);
    clickSopTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");
    
    cy.wait("@getSpecialSOPs").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    const firstRowSOP = mockedResponse.data[0];
    const { 
      id, name, type, startDate, endDate, checklists
    } = firstRowSOP;
    cy.getBySelector(`${viewDetailsButton}-${id}`).click();
    cy.getBySelector(sopDetailsPageHeadingSelector).contains("SOP Detail");
    
    cy.getBySelector(sopNameSelector)
      .should("contain", name);
    cy.getBySelector(sopTypeSelector).invoke("text")
      .should("contain", type);
    cy.getBySelector(sopStartDateSelector)
      .should("contain", getFormattedDate(new Date(startDate)));
    cy.getBySelector(sopEndDateSelector)
      .should("contain", getFormattedDate(new Date(endDate)));
    checklists.forEach((checklist : string) => cy.getBySelector(sopChecklistsSelector).should("include.text", checklist));
  });

  // delete
  it("should be able to delete a sop on clicking delete action button", () => {
    const mockedResponse = SpecialSOPListResponse;
    const API = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSpecialSOPs");

    cy.visit(SETTINGS_PATH);
    clickSopTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");
    
    cy.wait("@getSpecialSOPs").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    const deletingSOP : SopResponse = mockedResponse.data[0];
    const { 
      id, name, startDate, endDate, checklists
    } = deletingSOP;

    cy.getBySelector(`${tableDeleteBtn}${id}`).click();
    
    const DELETE_SOP_API = `${Cypress.env("CYPRESS_API_URL")}/sop/${id}`;
    cy.intercept("DELETE", DELETE_SOP_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : {
          "id" : id,
          "name" : name,
          "type" : "Special",
          "startDate" : "2023-06-23T17:30:00.000Z",
          "endDate" : "2023-06-28T17:30:00.000Z",
          "checklists" : checklists,
          "createdAt" : "2023-08-24T08:14:21.941Z",
          "deletedAt" : "2023-10-03T07:02:04.194Z"
        }
      });
    }).as("deleteSOP");

    cy.getBySelector(confirmModalConfirmBtnSelector).should("be.visible")
      .click();
    
    cy.wait("@deleteSOP").then((xhr : Interception) => {
      if (xhr.response) {
        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(DELETE_SOP_API);

        const { body } = xhr.response;
        expect(body.id).eq(id);
        expect(body.name).eq(name);
        expect(body.startDate).eq(startDate);
        expect(body.endDate).eq(endDate);
        expect(body.deletedAt).not.to.be.null;
    
        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "SOP has been deleted");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });

  // update
  it("should be able to update sop info", () => {
    const mockedResponse = SpecialSOPListResponse;
    const API = `${Cypress.env("CYPRESS_API_URL")}/sop/list?type=Special&limit=10&offset=0`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSpecialSOPs");

    cy.visit(SETTINGS_PATH);
    clickSopTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");
    
    cy.wait("@getSpecialSOPs").then((xhr : Interception) => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);
      }
    });

    const updatingSOP : SopResponse = mockedResponse.data[0];
    const { 
      id, checklists
    } = updatingSOP;
    
    // go to first row sop details page
    cy.getBySelector(`${viewDetailsButton}-${id}`).click();
    cy.getBySelector(sopDetailsPageHeadingSelector).contains("SOP Detail");

    // click Edit button
    cy.getBySelector(btnEditSelector).click();

    // edit details
    const updatingText = " (updated)";
    const newChecklistText = "new checklist";

    const today = moment();
    const thisMonth = today.month() + 1;
    const startDateFormatted = moment().format("dddd, D MMMM YYYY");
    const fiveDaysFromToday = today.add(5, "days");
    const endDateFormatted = fiveDaysFromToday.format("dddd, D MMMM YYYY");

    // Start Date
    cy.getBySelector(inputSOPStartDateSelector).click();
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(`:nth-child(${thisMonth}) > .Calendar__monthSelectorItemText`).click(); // Select this month
    cy.get(`[aria-label="${startDateFormatted}"]`).click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    // End Date
    cy.getBySelector(inputSOPEndDateSelector).click();
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(`:nth-child(${thisMonth}) > .Calendar__monthSelectorItemText`).click(); // Select this month
    cy.get(`[aria-label="${endDateFormatted}"]`).click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    cy.getBySelector(inputSOPNameSelector).type(updatingText);
    if (checklists.length > 0) {
      // update on first check-list
      cy.getBySelector(`${inputSOPCheckListsSelector}0`).type(updatingText);
    }
    // add new check list
    cy.getBySelector(btnAddNextAction).click();
    cy.getBySelector(`${inputSOPCheckListsSelector}${checklists.length}`).type(newChecklistText);

    const UPDATE_SOP_API = `${Cypress.env("CYPRESS_API_URL")}/sop/${id}`;
    cy.intercept("PUT", UPDATE_SOP_API, (req : CyHttpMessages.IncomingHttpRequest) => {
      req.reply({
        statusCode : 200,
        body : UpdateSpecialSOPResponse
      });
    }).as("updateSOP");

    // click save button and calls api
    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@updateSOP").then((xhr : Interception) => {
      if (xhr.response) {
        // check payload
        const { 
          name : reqName, 
          startDate : reqStartDate,
          endDate : reqEndDate,
          checklists : reqChecklists 
        } = xhr.request.body;
        expect(reqName).to.include(updatingText);
        assert.equal(reqStartDate, `${moment().format("YYYY-MM-DD")}`);
        assert.equal(reqEndDate, `${fiveDaysFromToday.format("YYYY-MM-DD")}`);
        if (!!reqChecklists && reqChecklists.length > 0) expect(reqChecklists).to.include(newChecklistText);

        // check response
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(UPDATE_SOP_API);

        const {
          id : resId,
          name : resName,
          startDate : resStartDate,
          endDate : resEndDate,
          checklists : resChecklists
        } = xhr.response.body;
        expect(resId).eq(id);
        expect(resName).to.include(updatingText);
        assert.equal(resStartDate, UpdateSpecialSOPResponse.startDate);
        assert.equal(resEndDate, UpdateSpecialSOPResponse.endDate);
        if (!!resChecklists && resChecklists.length > 0) expect(resChecklists).to.include(newChecklistText);
    
        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "SOP has been updated");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });

  // create
  it("should create a new special sop", () => {
    cy.visit(SETTINGS_PATH);
    clickSopTab();

    cy.getBySelector(btnCreateSelector).click();

    const sopName = "New-Special-Sop";
    const checkList1 = "check-list-1";
    const checkList2 = "check-list-2";
    cy.getBySelector(inputSOPNameSelector).type(sopName);
    
    const today = moment();
    const thisMonth = today.month() + 1;
    const startDateFormatted = moment().format("dddd, D MMMM YYYY");
    const fiveDaysFromToday = today.add(5, "days");
    const endDateFormatted = fiveDaysFromToday.format("dddd, D MMMM YYYY");

    // Start Date
    cy.getBySelector(inputSOPStartDateSelector).click();
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(`:nth-child(${thisMonth}) > .Calendar__monthSelectorItemText`).click(); // Select this month
    cy.get(`[aria-label="${startDateFormatted}"]`).click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    // End Date
    cy.getBySelector(inputSOPEndDateSelector).click();
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(`:nth-child(${thisMonth}) > .Calendar__monthSelectorItemText`).click(); // Select this month
    cy.get(`[aria-label="${endDateFormatted}"]`).click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    cy.getBySelector(`${inputSOPCheckListsSelector}0`).type(checkList1);
    cy.getBySelector(btnAddNextAction).click();
    cy.getBySelector(`${inputSOPCheckListsSelector}1`).type(checkList2);

    const CREATE_SOP_API = `${Cypress.env("CYPRESS_API_URL")}/sop`;
    cy.intercept("POST", CREATE_SOP_API, {
      statusCode : 200,
      body : CreateSpecialSOPResponse
    }).as("createSOP");

    cy.getBySelector(btnSaveSelector).click();

    cy.wait("@createSOP").then((xhr : Interception) => {
      const request = xhr.request;
      const response = xhr.response;

      expect(request.url).to.eq(CREATE_SOP_API);
      const { 
        name : reqName,
        startDate : reqStartDate,
        endDate : reqEndDate,
        checklists : reqChecklists 
      } = xhr.request.body;
      expect(reqName).to.include(sopName);
      assert.equal(reqStartDate, `${moment().format("YYYY-MM-DD")}`);
      assert.equal(reqEndDate, `${fiveDaysFromToday.format("YYYY-MM-DD")}`);
      if (!!reqChecklists && reqChecklists.length > 0) {
        expect(reqChecklists).to.include(checkList1);
        expect(reqChecklists).to.include(checkList2);
      }

      if (response) {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.deep.equal(CreateSpecialSOPResponse);

        cy.getBySelector(notifyModalSelector).should("exist");
        cy.getBySelector(notifyModalMessageSelector).should("contain", "SOP has been created");
        cy.getBySelector(notifyModalCloseBtnSelector).click();
      }
    });
  });
});

const clickSopTab = () : void => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`) 
    .find(".a-tab")
    .eq(1)
    .click();
  
  cy.getBySelector(tableSelector).within(() => {
    cy.get(".table-section .tabs .a-tab.bg-gray-999").click();
  });
};