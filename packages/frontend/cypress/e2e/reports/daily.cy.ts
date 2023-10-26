/**
 * Tests - Daily Report Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display daily report list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 *  - check if data is correctly rendered if clicked on the 2nd pagination item
 *  - check if the 2nd pagination item is active
 *  - check if the data is correctly rendered based on the 'site.name' column after clicking 2nd pagination item
 * should display daily report of selected site when selecting a site
 * should display daily report when filtering by date
 * should display daily report on filter by date and site
 * should display the details page when viewing a report
 * should display details of daily report and open print dialog window when clicking on Download PDF button
 *  - check table columns are correctly rendered
 *  - check checkpoint names are correctly rendered
 *  - downloading/saving pdf
 */
import moment from "moment-timezone";

import "../../support/commands";
import * as constants from "../../support/constants";
import { REPORTS_PATH } from "../../support/constants";
import {
  DailyReportDetailsResponse, DailyReportResponse, DailyReportResponse20, SiteResponse
} from "../../support/mockedResponses";
import {
  PAGE_SELECTORS, REPORT_DETAILS_INFO, TABLE_SELECTORS
} from "../../support/selectors";
import { TaskDailyReport } from "@vps/utils/lib/dto";
import { getFormattedDate } from "../../../src/utils/time-format";
import { Interception } from "cypress/types/net-stubbing";

const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const REPORT_DAILY_DETAILS_PATH = constants.REPORT_DAILY_DETAILS_PATH;
const pageHeaderTitle = PAGE_SELECTORS.pageHeaderTitle;
const loadingSpinner = PAGE_SELECTORS.loadingSpinner;
const tableSelector = "report-daily-list__table";
const siteSelector = "report-patrol__select-site";
const downloadPDFBtnSelector = "report-daily-page__download-pdf";
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tablePageSizeControlSelector = TABLE_SELECTORS.pageSizeControl;
const tableDatePickerSelector = TABLE_SELECTORS.datePicker;
const tableDatePickerApplyBtn = TABLE_SELECTORS.datePickerApplyBtn;
const tableDatePickerClearBtn = TABLE_SELECTORS.datePickerClearBtn;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const reportDetailsSiteName = REPORT_DETAILS_INFO.daily.siteName;
const reportDetailsDatePrepared = REPORT_DETAILS_INFO.daily.datePrepared;
const defaultItemsPerPage = 10;

describe("Daily Report Page", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(REPORTS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should display daily report list", () => {
    const mockedResponse = DailyReportResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?limit=10&offset=0`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getDailyReports");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getDailyReports").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(itemPerPage);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.REPORT_DAILY_COLUMNS.forEach((columnName : string) => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", itemPerPage);

        // 📌 check if the data in the table matches the fetched data - site name column
        responseData.forEach((dataItem, index) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.site.name);
        });

        if (response.count > 10) {
          // 📌 check pagination has correctly rendered
          cy.getBySelector(tablePaginationSelector).should("exist");
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", Math.ceil(totalCount / itemPerPage));
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
            .first()
            .should("have.class", "active");
        }

        if (responseData.length > 10) {
          // 📌 check if data is correctly rendered if clicked on the 2nd pagination item
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`)
            .eq(1)
            .scrollIntoView()
            .click();
          
          // 📌 check if the 2nd pagination item is active
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).then(($btnPage : JQuery<HTMLElement>) => {
            if ($btnPage.length > 0) {
              cy.wrap($btnPage.eq(1)).should("have.class", "active");
            }
          });
        }

        if (response.count > 20) {
          // 📌 check if the data is correctly rendered based on the 'site name' column after clicking 2nd pagination item
          const secondPageData = mockedResponse.data.slice(itemPerPage, itemPerPage * 2);
          secondPageData.forEach((dataItem, index) => {
            cy.getBySelector(tableSelector)
              .find("tbody > tr")
              .eq(index)
              .should("contain", dataItem.site.name);
          });
        }
      }
    });

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?limit=20&offset=0`, {
      statusCode : 200,
      body : DailyReportResponse20
    }).as("getDailyReportsByLimit20");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tablePageSizeControlSelector).select("20");

    cy.wait("@getDailyReportsByLimit20").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        // 📌 check if there are 20 data rows in the table on selecting 20 in page size control
        const _itemPerPage = 20;
        cy.getBySelector(tableLoadingSpinnerSelector).should("not.exist");
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", _itemPerPage);
        // check if the pagination items become 3 after that
        cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", Math.ceil(totalCount / _itemPerPage));
      }
    });
  });

  it("should display daily report of selected site when selecting a site", () => {
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
    const mockedResponse = DailyReportResponse;

    const selectedSiteId = 13;
    const selectedSiteName = "abc";

    // Filter the items based on selected site - should output 2 items
    const filteredResponse = mockedResponse.data.filter(item => {
      return item.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse
        }
      }
    )
      .as("getDataWithSiteFilter");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

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
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(7);
        cy.getBySelector(tablePaginationSelector).should("not.exist");

        // 📌 check if the data in the table matches the fetched data - site name column
        responseData.forEach((dataItem, index) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", selectedSiteName);
        });
      }
    });
  });

  it("should display daily report when filtering by date", () => {
    const mockedResponse = DailyReportResponse;

    const selectedDate = "2023-09-13";

    // Filter the items on the selected date - should output 1 item
    const filteredResponse = mockedResponse.data.filter(item => {
      return moment(item.createdAt).format("YYYY-MM-DD") === selectedDate;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?date=${selectedDate}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse
        }
      }
    )
      .as("getDataWithFilter");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tableDatePickerSelector).click();
    // getting Calendar controls
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(":nth-child(9) > .Calendar__monthSelectorItemText").click(); // Select September
    cy.get("[aria-label=\"Wednesday, 13 September 2023\"]").click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    cy.wait("@getDataWithFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?date=${selectedDate}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  it("should display daily report on filter by date and site", () => {
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
    const mockedResponse = DailyReportResponse;

    const selectedSiteId = 13;
    const selectedSiteName = "abc";
    const selectedDate = "2023-09-13";

    // Filter the items based on selected site - should output 7 items
    const filteredResponseBySite = mockedResponse.data.filter(item => {
      return item.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponseBySite.length,
          data : filteredResponseBySite
        }
      }
    )
      .as("getDataWithSiteFilter");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

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
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(7);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // START --- Filter the items based on site, and date - should output 3 items --- //
    const filteredResponseBySiteAndDate = filteredResponseBySite.filter(item => {
      return moment(item.createdAt).format("YYYY-MM-DD") === selectedDate;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&date=${selectedDate}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponseBySiteAndDate.length,
          data : filteredResponseBySiteAndDate
        }
      }
    )
      .as("getDataWithSiteAndDateFilter");

    cy.getBySelector(tableDatePickerSelector).click();
    // getting Calendar controls
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(":nth-child(9) > .Calendar__monthSelectorItemText").click(); // Select September
    cy.get("[aria-label=\"Wednesday, 13 September 2023\"]").click();
    cy.getBySelector(tableDatePickerApplyBtn).click();

    cy.wait("@getDataWithSiteAndDateFilter").then((xhr : Interception) => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?siteId=${selectedSiteId}&date=${selectedDate}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  it("should display the details page when viewing a report", () => {
    const mockedResponse = DailyReportResponse;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/list?limit=10&offset=0`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getDailyReports");

    cy.visit(REPORTS_PATH);
    clickDailyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getDailyReports").then((xhr : Interception) => {
      if (xhr.response) {
        const firstRowReportId = mockedResponse.data[0].id;
        cy.getBySelector(`${viewDetailsButton}-${firstRowReportId}`).click();
        cy.getBySelector(pageHeaderTitle).contains("Daily Patrol Report");
      }
    });

  });

  it("should display details of daily report and open print dialog window when clicking on Download PDF button", () => {
    const dailyReportDetailsData = DailyReportDetailsResponse;
    const taskId = "bdb342a2-72e0-4c57-aef6-ab7cb61e02bf";

    const pageLink = REPORT_DAILY_DETAILS_PATH(taskId);
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/daily-report/${taskId}`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : dailyReportDetailsData
    }).as("viewDailyReportDetails");

    cy.visit(pageLink);

    cy.wait("@viewDailyReportDetails").then((xhr : Interception) => {
      if (xhr.response) {
        const responseData : TaskDailyReport = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);

        cy.getBySelector(reportDetailsSiteName).contains(responseData.site.name);
        cy.getBySelector(reportDetailsDatePrepared).contains(getFormattedDate(new Date(responseData.createdAt) as Date));

        // 📌 check table columns are correctly rendered
        constants.REPORT_COMPLETE_PATROL_COLUMNS.forEach(columnName => cy.getBySelector("daily-report-details-table").contains(columnName)
          .should("exist"));

        const nightShifts : TaskDailyReport[] = [],
          dayShifts : TaskDailyReport[] = [];
        if (!!responseData && responseData.taskReportData) {
          const isNightShift = responseData.taskReportData.some((report) => report.name.toLowerCase().includes("night"));

          if (isNightShift) {
            const nightObj = { ...responseData };
            nightObj.taskReportData = responseData.taskReportData.filter((report) => report.name.toLowerCase().includes("night"));
            nightShifts.push(nightObj);
          } else {
            const dayObj = { ...responseData };
            dayObj.taskReportData = responseData.taskReportData.filter((report) => !report.name.toLowerCase().includes("night"));
            dayShifts.push(dayObj);
          }

          // 📌 check checkpoint names are correctly rendered
          nightShifts.forEach(nShift => {
            if (!!nShift.taskReportData) {
              nShift.taskReportData.map(data => {
                cy.getBySelector(`daily-report__night-missedOrIncomplete-${data.id}`).should("exist");
              });
            }
          });
        }

        // 📌 downloading/saving pdf
        cy.getBySelector(loadingSpinner).should("not.exist");
        // cy.getBySelector(downloadPDFBtnSelector).click();
        // cy.getBySelector(downloadPDFBtnSelector).should("contain", "Preparing PDF...");
      }
    });
  });
});

const clickDailyReportTab = () : void => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`)
    .find(".a-tab")
    .eq(1)
    .click();
};
