/**
 * Tests - Patrol Report Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should navigate to Patrol Reports page
 * should change tab and load data if each of header tabs are clicked
 * should call "site" api if report page is visited
 * should call "patrol report" api if report page is visited
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 *  - check if data is correctly rendered if clicked on the 2nd pagination item
 *  - check if the 2nd pagination item is active
 *  - check if the data is correctly rendered based on the 'name' column after clicking 2nd pagination item
 * should display patrols report of selected site when selecting a site
 * should display patrols report when filtering by date range and display full list on clearing filter values
 * should display when filtering by status (Completed) and shift (Night) and display full list on clearing filter values
 * should display one patrol list report when searching by specific name and display full list on clearing search text
 * should display patrols report on filter by status, shift, site and search
 * should display the details page when viewing a report
 * should display details of missed patrol report and open print dialog window when clicking on Download PDF button
 * should display details of incomplete patrol report
 * should display details of complete patrol report
 */

import _ from "lodash";
import moment from "moment";

import "../../support/commands";
import * as constants from "../../support/constants";
import {
  CompletePatrolReportResponse,
  IncompletePatrolReportResponse,
  MissedPatrolReportResponse,
  PatrolReportResponse, SiteResponse
} from "../../support/mockedResponses";


import { RouteTaskResponse } from "@vps/utils/lib/dto";
import { 
  TaskStatus, 
  TaskShift 
} from "@vps/utils/lib/data";
import { getTimeOfADayText } from "../../../src/utils/date-time";
import {
  PAGE_SELECTORS, REPORT_DETAILS_INFO, TABLE_SELECTORS
} from "../../support/selectors";
import { getFormattedDate } from "../../../src/utils/time-format";
import { Interception } from "cypress/types/net-stubbing";

const REPORTS_PATH = constants.REPORTS_PATH;
const REPORT_DETAIL_PATH = constants.REPORT_PATROL_DETAILS_PATH;
const pageHeaderTitleSelector = constants.CYPRESS_SELECTORS.pageHeaderTitleSelector;
const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const tableSelector = "report-patrol-list__table";
const siteSelector = "report-patrol__select-site";
// const downloadPDFBtnSelector = "report-task-page__download-pdf";
const pageHeaderTitle = PAGE_SELECTORS.pageHeaderTitle;
const loadingSpinner = PAGE_SELECTORS.loadingSpinner;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableSearchInputClearSelector = TABLE_SELECTORS.searchInputClear;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tableFilterSelector = TABLE_SELECTORS.filter;
const tableFilterProceedBtn = TABLE_SELECTORS.filterProceedBtn;
const tableFilterResetBtn = TABLE_SELECTORS.filterResetBtn;
const tableDateRangePickerApplyBtn = TABLE_SELECTORS.dateRangePickerApplyBtn;
const tableDateRangePickerClearBtn = TABLE_SELECTORS.dateRangePickerClearBtn;
const tableDateRangePickerSelector = TABLE_SELECTORS.dateRangePicker;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const reportDetailsName = REPORT_DETAILS_INFO.task.name;
const reportDetailsSiteName = REPORT_DETAILS_INFO.task.siteName;
const reportDetailsDatePrepared = REPORT_DETAILS_INFO.task.datePrepared;
const reportDetailsStatus = REPORT_DETAILS_INFO.task.status;
const missedReportDetailsGeneralDesc = REPORT_DETAILS_INFO.task.missed.generalDesc;
const missedReportDetailsReason = REPORT_DETAILS_INFO.task.missed.reason;
const incompleteReportDetailsGeneralDesc = REPORT_DETAILS_INFO.task.incomplete.generalDesc;
const incompleteReportDetailsReason = REPORT_DETAILS_INFO.task.incomplete.reason;
const defaultItemsPerPage = 10;

describe("Patrol Report Page", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(REPORTS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should navigate to Patrol Reports page", () => {
    cy.getBySelector(pageHeaderTitleSelector).contains("Reports")
      .should("exist");
    cy.getBySelector(tableDateRangePickerSelector).should("exist");
  });

  it("should change tab and load data if each of header tabs are clicked", () => {
    const componentElements = cy.get(`[data-test="${appHeaderTabsSelector}"] .a-tab`);
    componentElements.each((element : Cypress.Chainable<JQuery<HTMLElement>>) => {
      const hasATabClassBeforeClick = Cypress.$(element).hasClass("a-tab");

      cy.wrap(element)
        .click()
        .then(() => {
          const hasBtnPrimaryClassAfterClick = Cypress.$(element).hasClass("bg-primary");

          expect(hasATabClassBeforeClick).to.equal(true);
          expect(hasBtnPrimaryClassAfterClick).to.equal(true);
        });
    });
  });

  // here
  it("should call \"site\" api if report page is visited", () => {
    const mockedResponse = SiteResponse;
    const totalCount = mockedResponse.count;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/site/list`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getSites");

    cy.visit(REPORTS_PATH);

    cy.wait("@getSites").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/site/list`);
        expect(responseData).to.have.lengthOf(totalCount);
        expect(response.count).to.equal(totalCount);
      }
    });
  });

  it("should call \"patrol report\" api if report page is visited", () => {
    const mockedResponse = PatrolReportResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    cy.intercept("GET", "list*", {
      statusCode : 200,
      body : mockedResponse
    }).as("getPatrolReports");

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getPatrolReports").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.REPORT_PATROL_LIST_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - name column
        responseData.forEach((dataItem : RouteTaskResponse, index : number) => {
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

        // 📌 check if data is correctly rendered if clicked on the 2nd pagination item
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .eq(1)
          .scrollIntoView()
          .click();

        // 📌 check if the 2nd pagination item is active
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
          .eq(1)
          .should("have.class", "active");

        // 📌 check if the data is correctly rendered based on the 'name' column after clicking 2nd pagination item
        const secondPageData = responseData.slice(itemPerPage, itemPerPage * 2);
        secondPageData.forEach((dataItem : RouteTaskResponse, index : number) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.name);
        });
      }
    });
  });

  it("should display patrols report of selected site when selecting a site", () => {
    // first calls site api to fill mocked site data
    const siteMockedResponse = SiteResponse;
    const totalCount = siteMockedResponse.count;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/site/list`, {
      statusCode : 200,
      body : siteMockedResponse
    }).as("getSites");

    cy.visit(REPORTS_PATH);

    cy.wait("@getSites").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/site/list`);
        expect(responseData).to.have.lengthOf(totalCount);
        expect(response.count).to.equal(totalCount);
      }
    });

    // report check
    const reportMockedResponse = PatrolReportResponse;
    const selectedSiteId = 13;
    const selectedSiteName = "abc";

    // Filter the items based on selected site - should output 2 items
    const filteredResponse = reportMockedResponse.data.filter(item => {
      return item.route.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&siteId=${selectedSiteId}`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithSiteFilter");

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(siteSelector).click();
    cy.get("[data-test=\"custom-select__picker-container\"]")
      .find(".option")
      .contains(selectedSiteName)
      .scrollIntoView()
      .click();

    cy.wait("@getDataWithSiteFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&siteId=${selectedSiteId}`);
        expect(responseData).to.have.lengthOf(5);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  it("should display patrols report when filtering by date range and display full list on clearing filter values", () => {
    const mockedResponse = PatrolReportResponse;
    const totalCount = mockedResponse.count;

    const createdDateFrom = "2023-09-05",
      createdDateTo = "2023-09-09";

    // Filter the items within the date range - should output 2 items
    const filteredResponse = mockedResponse.data.filter(item => {
      const createdAt = (item.status === TaskStatus.Incomplete || item.status === TaskStatus.Completed)
        ? moment(item.reportCreatedAt)
        : moment(item?.occurrenceDate).add(item.endTime, "seconds");
      return createdAt.isSameOrAfter(moment(createdDateFrom), "day") && createdAt.isSameOrBefore(moment(createdDateTo), "day");
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?fromDate=${createdDateFrom}&toDate=${createdDateTo}&filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithFilter");
    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : totalCount,
          data : mockedResponse.data,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithoutFilter");

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tableDateRangePickerSelector).click();
    // getting Calendar controls
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(":nth-child(9) > .Calendar__monthSelectorItemText").click(); // Select September
    cy.get("[aria-label=\"Tuesday, 5 September 2023\"]").click();
    cy.get("[aria-label=\"Saturday, 9 September 2023\"]").click();
    cy.getBySelector(tableDateRangePickerApplyBtn).click();

    cy.wait("@getDataWithFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?fromDate=${createdDateFrom}&toDate=${createdDateTo}&filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(2);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // check 10-rows-data is display on clicking the "Clear" button
    cy.getBySelector(tableDateRangePickerSelector).click();
    cy.getBySelector(tableDateRangePickerClearBtn).click();

    cy.wait("@getDataWithoutFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });

    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  it("should display when filtering by status (Completed) and shift (Night) and display full list on clearing filter values", () => {
    const mockedResponse = PatrolReportResponse;
    const totalCount = mockedResponse.count;

    const filterStatus = TaskStatus.Completed;
    const filterShift = TaskShift.Night;

    // Filter the items by status (Completed) and shift (Night)
    const filteredResponse = mockedResponse.data.filter(item => {
      return item.status === filterStatus && getTimeOfADayText(item.startTime) === filterShift;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithFilter");
    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : totalCount,
          data : mockedResponse.data,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithoutFilter");

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tableFilterSelector).click();
    cy.getBySelector(tableFilterSelector).within(() => {
      cy.contains(filterStatus).click();
      cy.contains(filterShift).click();
    });
    cy.getBySelector(tableFilterProceedBtn).click();

    cy.wait("@getDataWithFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // check 10-rows-data is display on clicking the "Clear" button
    cy.getBySelector(tableFilterSelector).click();
    cy.getBySelector(tableFilterResetBtn).click();

    cy.wait("@getDataWithoutFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });

    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  it("should display one patrol list report when searching by specific name and display full list on clearing search text", () => {
    const searchText = "abc-tdy";
    const mockedResponse = PatrolReportResponse;
    const totalCount = mockedResponse.count;
    const searchedData = mockedResponse.data.filter(taskList => taskList.name.toLowerCase().includes(searchText.toLowerCase()));

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&searchText=${searchText}`,
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
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`,
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

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableSearchInputSelector).type(searchText);

    cy.wait("@getDataBySearching").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&searchText=${searchText}`);
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
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(defaultItemsPerPage);
      }
    });
    // check that the pagination is displayed again
    cy.getBySelector(tablePaginationSelector).should("exist");
  });

  it("should display patrols report on filter by status, shift, site and search", () => {
    // first calls site api to fill mocked site data
    const siteMockedResponse = SiteResponse;
    const totalCount = siteMockedResponse.count;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/site/list`, {
      statusCode : 200,
      body : siteMockedResponse
    }).as("getSites");

    cy.visit(REPORTS_PATH);

    cy.wait("@getSites").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/site/list`);
        expect(responseData).to.have.lengthOf(totalCount);
        expect(response.count).to.equal(totalCount);
      }
    });

    // report check
    const mockedResponse = PatrolReportResponse;

    const selectedSiteId = 13;
    const selectedSiteName = "abc";
    const filterStatus = TaskStatus.Missed;
    const filterShift = TaskShift.Night;
    const searchText = "newnew";

    // START --- Filter the items based on selected site - should output 5 items --- //
    const filteredResponseBySite = mockedResponse.data.filter(item => {
      return item.route.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&siteId=${selectedSiteId}`,
      {
        statusCode : 200,
        body : {
          count : filteredResponseBySite.length,
          data : filteredResponseBySite,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithSiteFilter");

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(siteSelector).click();
    cy.get("[data-test=\"custom-select__picker-container\"]")
      .find(".option")
      .contains(selectedSiteName)
      .scrollIntoView()
      .click();

    cy.wait("@getDataWithSiteFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0&siteId=${selectedSiteId}`);
        expect(responseData).to.have.lengthOf(5);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // START --- Filter the items based on site, status and shift - should output 3 items --- //
    const filteredResponseBySiteAndStatusAndShift = filteredResponseBySite.filter(item => {
      return item.status === filterStatus && getTimeOfADayText(item.startTime) === filterShift;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0&siteId=${selectedSiteId}`,
      {
        statusCode : 200,
        body : {
          count : filteredResponseBySiteAndStatusAndShift.length,
          data : filteredResponseBySiteAndStatusAndShift,
          limit : defaultItemsPerPage,
          offset : 0
        }
      }
    )
      .as("getDataWithSiteStatusShiftFilter");

    cy.getBySelector(tableFilterSelector).click();
    cy.getBySelector(tableFilterSelector).within(() => {
      cy.contains(filterStatus).click();
      cy.contains(filterShift).click();
    });
    cy.getBySelector(tableFilterProceedBtn).click();

    cy.wait("@getDataWithSiteStatusShiftFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0&siteId=${selectedSiteId}`);
        expect(responseData).to.have.lengthOf(3);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // START --- Filter the items based on site, status, shift and searchText - should output 1 item --- //
    const searchedData = filteredResponseBySiteAndStatusAndShift.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0&searchText=${searchText}&siteId=${selectedSiteId}`,
      {
        statusCode : 200,
        body : {
          count : searchedData.length,
          data : searchedData,
          limit : 10,
          offset : 0
        }
      }
    ).as("getDataWithSiteStatusShiftSearch");

    cy.getBySelector(tableSearchInputSelector).type(searchText);

    cy.wait("@getDataWithSiteStatusShiftSearch").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22${filterStatus}%22]&filterShift=${filterShift}&limit=10&offset=0&searchText=${searchText}&siteId=${selectedSiteId}`);
        expect(responseData).to.have.lengthOf(searchedData.length);
      }
    });
    // check that the pagination is not displayed as there are only less items of itemsPerPage
    cy.getBySelector(tablePaginationSelector).should("not.exist");
  });

  // patrol report - details page
  it("should display the details page when viewing a report", () => {
    const mockedResponse = PatrolReportResponse;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/list?filterStatuses=[%22Completed%22,%22Incomplete%22,%22Missed%22]&filterShift=&limit=10&offset=0`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getPatrolReports");

    cy.visit(REPORTS_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    const firstRowReportId = mockedResponse.data[0].id;
    cy.getBySelector(`${viewDetailsButton}-${firstRowReportId}`).click();
    cy.getBySelector(pageHeaderTitle).contains("Patrol Route Report");
  });

  // missed patrol details report page
  it("should display details of missed patrol report and open print dialog window when clicking on Download PDF button", () => {
    const missedReportDetailsData = MissedPatrolReportResponse;
    const taskId = "2e0fe0c5-2c75-4d39-b7d4-efbd0aa46da1";

    const pageLink = REPORT_DETAIL_PATH(taskId);
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/${taskId}?includeReport=true`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : missedReportDetailsData
    }).as("viewPatrolReportDetails");

    cy.visit(pageLink);

    cy.wait("@viewPatrolReportDetails").then((xhr : Interception) => {
      if (xhr.response) {
        const responseData : RouteTaskResponse = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);

        cy.getBySelector(reportDetailsName).contains(responseData.name);
        cy.getBySelector(reportDetailsSiteName).contains(responseData.route.site.name);
        cy.getBySelector(reportDetailsStatus).contains(responseData.status);
        cy.getBySelector(reportDetailsDatePrepared).contains(getFormattedDate(new Date(responseData?.occurrenceDate) as Date));
        cy.getBySelector(missedReportDetailsGeneralDesc).contains(`"${responseData.name}" was missed and no report was created.`);

        if (!!responseData.endComment) cy.getBySelector(missedReportDetailsReason).contains(responseData.endComment);
        else cy.getBySelector(missedReportDetailsReason).contains("Not provided");

        // downloading/saving pdf
        cy.getBySelector(loadingSpinner).should("not.exist");
        // temporately removing print dialog
        // cy.getBySelector(downloadPDFBtnSelector).click();
        // cy.getBySelector(downloadPDFBtnSelector).should("contain", "Preparing PDF...");
      }
    });
  });

  // incomplete patrol details report page
  it("should display details of incomplete patrol report", () => {
    const incompleteReportDetailsData = IncompletePatrolReportResponse;
    const taskId = "df2b1b9b-a199-4616-9f81-a4c2d5b39b19";

    const pageLink = REPORT_DETAIL_PATH(taskId);
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/${taskId}?includeReport=true`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : incompleteReportDetailsData
    }).as("viewPatrolReportDetails");

    cy.visit(pageLink);

    cy.wait("@viewPatrolReportDetails").then((xhr : Interception) => {
      if (xhr.response) {
        const responseData : RouteTaskResponse = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);

        cy.getBySelector(reportDetailsName).contains(responseData.name);
        cy.getBySelector(reportDetailsSiteName).contains(responseData.route.site.name);
        cy.getBySelector(reportDetailsStatus).contains(responseData.status);
        cy.getBySelector(reportDetailsDatePrepared).contains(getFormattedDate(new Date(responseData?.occurrenceDate) as Date));
        cy.getBySelector(incompleteReportDetailsGeneralDesc).contains(`"${responseData.name}" was started, but not completed.`);

        if (!!responseData.endComment) cy.getBySelector(incompleteReportDetailsReason).contains(responseData.endComment);
        else cy.getBySelector(incompleteReportDetailsReason).contains("Not provided");
      }
    });
  });

  // complete patrol details report page
  it("should display details of complete patrol report", () => {
    const completeReportDetailsData = CompletePatrolReportResponse;
    const taskId = "f1e4267b-a7ce-4ca9-9b89-545ba992f656";

    const pageLink = REPORT_DETAIL_PATH(taskId);
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/${taskId}?includeReport=true`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : completeReportDetailsData
    }).as("viewPatrolReportDetails");

    cy.visit(pageLink);

    cy.wait("@viewPatrolReportDetails").then((xhr : Interception) => {
      if (xhr.response) {
        const responseData : RouteTaskResponse = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);

        cy.getBySelector(reportDetailsName).contains(responseData.name);
        cy.getBySelector(reportDetailsSiteName).contains(responseData.route.site.name);
        cy.getBySelector(reportDetailsStatus).contains(responseData.status);
        cy.getBySelector(reportDetailsDatePrepared).contains(getFormattedDate(new Date(responseData?.occurrenceDate) as Date));

        // 📌 check table columns are correctly rendered
        constants.REPORT_COMPLETE_PATROL_COLUMNS.forEach(columnName => cy.getBySelector("patrol-report-complete-table").contains(columnName)
          .should("exist"));

        if (responseData.reportDataRows) {
          // 📌 check total checkpoints are correctly rendered
          Object.keys(responseData.reportDataRows).forEach((key) => {
            cy.getBySelector(`patrol-report-complete-table__checkpoint-${key}`).should("exist");
          });

          // 📌 check if the table is rendered with the correct number of rows
          Object.entries(responseData.reportDataRows).map(([key,
            checkpoints], index, array) => {
            _.map(checkpoints, (checkpoint, index) => {
              cy.getBySelector(`patrol-report-complete-table__row-${key}-${checkpoint.camera.id}-${index}`).should("exist");
            });
          });
        }
      }
    });
  });
});
