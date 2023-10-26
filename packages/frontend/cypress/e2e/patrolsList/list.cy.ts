/**
 * Tests - Patrols List page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should navigate to Virtual Patrol Routes list page
 * should display patrols lists on success api fetch
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 *  - check if data is correctly rendered if clicked on the 2nd pagination item
 *  - check if the 2nd pagination item is active
 *  - check if the data is correctly rendered based on the 'name' column after clicking 2nd pagination item
 *  - check if there are 20 data rows in the table on selecting 20 in page size control
 *  - check if the pagination items become 4 after that
 * should display patrols lists when filtering by date range and display full list on clearing filter values
 * should display one patrol list when searching by specific name and display full list on clearing search text
 * should navigate to Patrol route create page on clicking create button
 * should navigate to Patrol route details page on clicking view more button
 */

import "../../support/commands";
import moment from "moment-timezone";
import * as constants from "../../support/constants";
import { TABLE_SELECTORS } from "../../support/selectors";
import { 
  PatrolsListResponse, 
  PatrolsListResponse20 
} from "../../support/mockedResponses";
import { Interception } from "cypress/types/net-stubbing";

const PATROLS_LIST_PATH = constants.PATROL_LIST_PATH;
const CREATE_PATROL_PATH = constants.CREATE_PATROL_PATH;
const PATROL_MANAGE_PAGE_REGEX = /http:\/\/localhost:3006\/vps\/app\/patrols\/manage\/[a-f\d-]+/;
const pageHeaderTitleSelector = constants.CYPRESS_SELECTORS.pageHeaderTitleSelector;
const appReturnToPrevPage = constants.CYPRESS_SELECTORS.appReturnToPrevPage;
const tableSelector = "patrols-list__table";
const btnCreatePatrolSelector = "patrols-list__btn-create";
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tablePageSizeControlSelector = TABLE_SELECTORS.pageSizeControl;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tableDateRangePickerSelector = TABLE_SELECTORS.dateRangePicker;
const tableDateRangePickerApplyBtn = TABLE_SELECTORS.dateRangePickerApplyBtn;
const tableDateRangePickerClearBtn = TABLE_SELECTORS.dateRangePickerClearBtn;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const tableViewDetailsButtonSelector = TABLE_SELECTORS.viewDetailsButton;
const paginationItemsMaxVisibleCount = 5;
const defaultItemsPerPage = 10;

describe("Patrols List Page", () => {  
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(PATROLS_LIST_PATH);
    cy.wait(2000);
  });
  
  after(() => cy.logout());

  it("should navigate to Virtual Patrol Routes list page", () => {
    cy.getBySelector(pageHeaderTitleSelector).contains("Virtual Patrol Routes")
      .should("exist");
    cy.getBySelector(btnCreatePatrolSelector).contains("Create Patrol Route")
      .should("exist");
  });

  it("should display patrols lists on success api fetch", () => {
    const mockedResponse = PatrolsListResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    cy.intercept("GET", "list?offset=0&limit=10&createdDateFrom=&createdDateTo=", {
      statusCode : 200,
      body : mockedResponse
    }).as("getData200");

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getData200").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;
        
        expect(xhr.response.statusCode).to.equal(200);

        // 📌 check table columns are correctly rendered
        constants.PATROL_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));
        
        expect(responseData).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - name column
        responseData.forEach((dataItem, index) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });

        // 📌 check pagination has correctly rendered
        if (response.count > 50) {
          cy.getBySelector(tablePaginationSelector).should("exist");
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", paginationItemsMaxVisibleCount);
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
            .first()
            .should("have.class", "active");
        }
      }
    });

    // clicking 2nd pagination item
    cy.intercept("GET", "list?offset=10&limit=10&createdDateFrom=&createdDateTo=", {
      statusCode : 200,
      body : mockedResponse
    }).as("getData200Offset10");

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
      .eq(1)
      .scrollIntoView()
      .click();

    cy.wait("@getData200Offset10").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        expect(xhr.response.statusCode).to.equal(200);

        // 📌 check if the 2nd pagination item is active
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .eq(1)
          .should("have.class", "active");

        // 📌 check if the data is correctly rendered based on the 'name' column after clicking 2nd pagination item
        const secondPageData = mockedResponse.data.slice(itemPerPage, itemPerPage * 2);
        secondPageData.forEach((dataItem, index) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });
      }
    });

    // choosing page size from 10 to 20
    cy.intercept("GET", "list?offset=0&limit=20&createdDateFrom=&createdDateTo=", {
      statusCode : 200,
      body : PatrolsListResponse20
    }).as("getData200ByLimit20");

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tablePageSizeControlSelector).select("20"); 

    cy.wait("@getData200ByLimit20").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        // 📌 check if there are 20 data rows in the table on selecting 20 in page size control
        cy.getBySelector(tableLoadingSpinnerSelector).should("not.exist");
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", 20);
      }
    });
  });

  it("should display patrols lists when filtering by date range and display full list on clearing filter values", () => {
    const mockedResponse = PatrolsListResponse;
    const totalCount = mockedResponse.count;

    const createdDateFrom = "2023-09-04", 
      createdDateTo = "2023-09-06";
    
    // Filter the items within the date range - should output 2 items
    const filteredResponse = mockedResponse.data.filter(item => {
      const createdAt = moment(item.createdAt);
      return createdAt.isSameOrAfter(moment(createdDateFrom), "day") && createdAt.isSameOrBefore(moment(createdDateTo), "day");
    });

    cy.intercept("GET", "list?offset=0&limit=10&createdDateFrom=2023-09-04&createdDateTo=2023-09-06", {
      statusCode : 200,
      body : {
        count : 2,
        data : filteredResponse,
        limit : defaultItemsPerPage,
        offset : 0
      }
    }).as("getDataWithFilter");
    cy.intercept(
      "GET",
      "list?offset=0&limit=10&createdDateFrom=&createdDateTo=",
      {
        statusCode : 200,
        body : {
          count : totalCount,
          data : mockedResponse.data,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    ).as("getDataWithoutFilter");

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");
    
    cy.getBySelector(tableDateRangePickerSelector).click();
    // getting Calendar controls
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(":nth-child(9) > .Calendar__monthSelectorItemText").click(); // Select September
    cy.get("[aria-label=\"Monday, 4 September 2023\"]").click();
    cy.get("[aria-label=\"Wednesday, 6 September 2023\"]").click();
    cy.getBySelector(tableDateRangePickerApplyBtn).click();

    cy.wait("@getDataWithFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;
        
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/route/list?offset=0&limit=10&createdDateFrom=${createdDateFrom}&createdDateTo=${createdDateTo}`);
        expect(responseData).to.have.lengthOf(2);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // check 10-rows-data is display on clicking the "Clear" button
    cy.getBySelector(tableDateRangePickerSelector).click();
    cy.getBySelector(tableDateRangePickerClearBtn).click();

    cy.wait("@getDataWithoutFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/route/list?offset=0&limit=10&createdDateFrom=&createdDateTo=`);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });

    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  it("should display one patrol list when searching by specific name and display full list on clearing search text", () => {
    const searchText = "hpn-";
    const mockedResponse = PatrolsListResponse;
    const totalCount = mockedResponse.count;
    const searchedData = mockedResponse.data.filter(taskList => taskList.name.toLowerCase().includes(searchText.toLowerCase()));

    cy.intercept("GET", `list?offset=0&limit=10&searchText=${searchText}&createdDateFrom=&createdDateTo=`, {
      statusCode : 200,
      body : {
        count : 3,
        data : searchedData,
        limit : 10,
        offset : 0
      }
    }).as("getDataBySearching");
    cy.intercept(
      "GET",
      "list?offset=0&limit=10&createdDateFrom=&createdDateTo=",
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

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableSearchInputSelector).type(searchText);

    cy.wait("@getDataBySearching").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/route/list?offset=0&limit=10&searchText=${searchText}&createdDateFrom=&createdDateTo=`);
        expect(responseData).to.have.lengthOf(3);
      }
    });
    // check that the pagination is not displayed as there are only less items of itemsPerPage
    cy.getBySelector(tablePaginationSelector).should("not.exist");

    // click clear button inside search input
    cy.getBySelector(tableSearchInputClearSelector).should("be.visible")
      .click();

    cy.wait("@getDataWithoutSearchValue").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/route/list?offset=0&limit=10&createdDateFrom=&createdDateTo=`);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });
    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  it("should navigate to Patrol route create page on clicking create button", () => {
    cy.getBySelector(btnCreatePatrolSelector).click();
    cy.url().should("eq", CREATE_PATROL_PATH);
    cy.getBySelector(pageHeaderTitleSelector).contains("Create Patrol Route")
      .should("exist");
  });

  it("should navigate to Patrol route details page on clicking view more button", () => {
    const mockedResponse = PatrolsListResponse;

    cy.intercept("GET", "list?offset=0&limit=10&createdDateFrom=&createdDateTo=", {
      statusCode : 200,
      body : mockedResponse
    }).as("getData200");

    cy.visit(PATROLS_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getData200").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const responseData = xhr.response.body.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });

    cy.getBySelector(tableSelector)
      .find("tbody > tr")
      .first()
      .find(`[data-test="${tableViewDetailsButtonSelector}"]`)
      .click();
    cy.url().should("match", PATROL_MANAGE_PAGE_REGEX);
    cy.getBySelector(pageHeaderTitleSelector).contains("Manage Patrol Route")
      .should("exist");
    cy.wait(1000);

    cy.getBySelector(appReturnToPrevPage).click();
    cy.url().should("eq", PATROLS_LIST_PATH);
    cy.getBySelector(pageHeaderTitleSelector).contains("Virtual Patrol Routes")
      .should("exist");
  });
});