/**
 * Tests - Monthly Report Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should display monthly report list
 *  - check table columns are correctly rendered
 *  - check if the table is rendered with the correct number of rows
 *  - check if the data in the table matches the fetched data - name column
 *  - check pagination has correctly rendered
 *  - check if data is correctly rendered if clicked on the 2nd pagination item
 *  - check if the 2nd pagination item is active
 *  - check if the data is correctly rendered based on the 'site.name' column after clicking 2nd pagination item
 * should display monthly report of selected site when selecting a site
 * should display monthly report when filtering by month
 * should display monthly report on filter by month and site
 * should display the details page when viewing a report
 * should display details of monthly report and open print dialog window when clicking on Download PDF button
 */

import _ from "lodash";
import moment from "moment-timezone";

import "../../support/commands";
import * as constants from "../../support/constants";
import { REPORTS_PATH } from "../../support/constants";
import {
  MonthlyReportDetailsResponse, MonthlyReportResponse, SiteResponse
} from "../../support/mockedResponses";
import {
  MONTH_PICKER_SELECTORS, PAGE_SELECTORS, REPORT_DETAILS_INFO, TABLE_SELECTORS
} from "../../support/selectors";
import { TaskMonthlyReport } from "@vps/utils/lib/dto";
import { TaskStatus } from "@vps/utils/lib/data";
import { getFormattedDate } from "../../../src/utils/time-format";
import { Interception } from "cypress/types/net-stubbing";

const appHeaderTabsSelector = constants.CYPRESS_SELECTORS.appHeaderTabs;
const REPORT_MONTHLY_DETAILS_PATH = constants.REPORT_MONTHLY_DETAILS_PATH;
const loadingSpinner = PAGE_SELECTORS.loadingSpinner;
const pageHeaderTitle = PAGE_SELECTORS.pageHeaderTitle;
const tableSelector = "report-monthly-list__table";
const siteSelector = "report-patrol__select-site";
// const downloadPDFBtnSelector = "report-monthly-page__download-pdf";
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const tablePaginationSelector = TABLE_SELECTORS.pagination;
const tablePageSizeControlSelector = TABLE_SELECTORS.pageSizeControl;
const monthPickerSelector = MONTH_PICKER_SELECTORS.picker;
const monthPickerMonthSelector = MONTH_PICKER_SELECTORS.month;
const monthPickerApplyBtnSelector = MONTH_PICKER_SELECTORS.applyBtn;
const reportDetailsSiteName = REPORT_DETAILS_INFO.monthly.siteName;
const reportDetailsDatePrepared = REPORT_DETAILS_INFO.monthly.datePrepared;
const viewDetailsButton = TABLE_SELECTORS.viewDetailsButton;
const reportMonthlyTotalPatrolCountSelector = "report-monthly__total-patrol-count";
const reportMonthlyCompletedSelector = "report-monthly-completed-count";
const reportMonthlyMissedIncompleteSelector = "report-monthly-missedIncomplete-count";
const defaultItemsPerPage = 10;

describe("Monthly Report Page", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(REPORTS_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should display monthly report list", () => {
    const mockedResponse = MonthlyReportResponse;
    const totalCount = mockedResponse.count;
    const itemPerPage = defaultItemsPerPage;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?limit=10&offset=0`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getMonthlyReports");

    cy.visit(REPORTS_PATH);
    clickMonthlyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getMonthlyReports").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);

        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(totalCount);
        expect(response.count).to.equal(totalCount);

        // 📌 check table columns are correctly rendered
        constants.REPORT_MONTHLY_COLUMNS.forEach(columnName => cy.getBySelector(tableSelector).contains(columnName)
          .should("exist"));

        // 📌 check if the table is rendered with the correct number of rows
        cy.getBySelector(tableSelector)
          .find("tbody > tr")
          .should("have.length", totalCount);

        // 📌 check if the data in the table matches the fetched data - site name column
        responseData.forEach((dataItem, index) => {
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .eq(index)
            .should("contain", dataItem.site.name);
        });

        if (totalCount <= itemPerPage) {
          cy.getBySelector(tablePaginationSelector).should("not.exist");
        } else {
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

          // 📌 check if the data is correctly rendered based on the 'site name' column after clicking 2nd pagination item
          const secondPageData = mockedResponse.data.slice(itemPerPage, itemPerPage * 2);
          secondPageData.forEach((dataItem, index) => {
            cy.getBySelector(tableSelector)
              .find("tbody > tr")
              .eq(index)
              .should("contain", dataItem.site.name);
          });

          // 📌 check if there are 20 data rows in the table on selecting 20 in page size control
          const _itemPerPage = 20;
          cy.getBySelector(tablePageSizeControlSelector).select(_itemPerPage.toString());
          cy.getBySelector(tableLoadingSpinnerSelector).should("not.exist");
          cy.getBySelector(tableSelector)
            .find("tbody > tr")
            .should("have.length", _itemPerPage);
          // check if the pagination items become 3 after that
          cy.get(`[data-test=${tablePaginationSelector}] .btn-page`).should("have.length", Math.ceil(totalCount / _itemPerPage));
        }
      }
    });
  });

  it("should display monthly report of selected site when selecting a site", () => {
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
    const mockedResponse = MonthlyReportResponse;

    const selectedSiteId = 13;
    const selectedSiteName = "abc";

    // Filter the items based on selected site - should output 1 item
    const filteredResponse = mockedResponse.data.filter(item => {
      return item.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&limit=10&offset=0`,
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
    clickMonthlyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(siteSelector).click();
    cy.get("[data-test=\"custom-select__picker-container\"]")
      .find(".option")
      .contains(selectedSiteName)
      .scrollIntoView()
      .click();

    cy.wait("@getDataWithSiteFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
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

  it("should display monthly report when filtering by month", () => {
    const mockedResponse = MonthlyReportResponse;

    const selectedMonth = "Jul";
    const selectedDate = "2023-07-01";

    // Filter the items on the selected month - should output 1 item
    const filteredResponse = _.filter(mockedResponse.data, (item) => {
      const itemDate = moment(item.createdAt).date(1)
        .format("YYYY-MM-DD");
      return itemDate === selectedDate;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?month=${selectedDate}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponse.length,
          data : filteredResponse
        }
      }
    )
      .as("getDataWithMonthFilter");

    cy.visit(REPORTS_PATH);
    clickMonthlyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(monthPickerSelector).click();
    cy.getBySelector(monthPickerMonthSelector)
      .contains(selectedMonth)
      .click();
    cy.getBySelector(monthPickerApplyBtnSelector)
      .click();

    cy.wait("@getDataWithMonthFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?month=${selectedDate}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  it("should display monthly report on filter by month and site", () => {
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
    const mockedResponse = MonthlyReportResponse;

    const selectedSiteId = 1;
    const selectedSiteName = "Building A";
    const selectedMonth = "Jul";
    const selectedDate = "2023-07-01";

    // Filter the items based on selected site - should output 4 items
    const filteredResponseBySite = mockedResponse.data.filter(item => {
      return item.site.id === selectedSiteId.toString();
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&limit=10&offset=0`,
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
    clickMonthlyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(siteSelector).click();
    cy.get("[data-test=\"custom-select__picker-container\"]")
      .find(".option")
      .contains(selectedSiteName)
      .scrollIntoView()
      .click();

    cy.wait("@getDataWithSiteFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(4);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });

    // START --- Filter the items based on site, and month - should output 1 item --- //
    const filteredResponseBySiteAndMonth = _.filter(filteredResponseBySite, (item) => {
      const itemDate = moment(item.createdAt).date(1)
        .format("YYYY-MM-DD");
      return itemDate === selectedDate;
    });

    cy.intercept(
      "GET",
      `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&month=${selectedDate}&limit=10&offset=0`,
      {
        statusCode : 200,
        body : {
          count : filteredResponseBySiteAndMonth.length,
          data : filteredResponseBySiteAndMonth
        }
      }
    )
      .as("getDataWithSiteAndMonthFilter");

    cy.getBySelector(monthPickerSelector).click();
    cy.getBySelector(monthPickerMonthSelector)
      .contains(selectedMonth)
      .click();
    cy.getBySelector(monthPickerApplyBtnSelector)
      .click();

    cy.wait("@getDataWithSiteAndMonthFilter").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const response = xhr.response.body;
        const responseData = response.data;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?siteId=${selectedSiteId}&month=${selectedDate}&limit=10&offset=0`);
        expect(responseData).to.have.lengthOf(1);
        cy.getBySelector(tablePaginationSelector).should("not.exist");
      }
    });
  });

  it("should display the details page when viewing a report", () => {
    const mockedResponse = MonthlyReportResponse;

    cy.intercept("GET", `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/list?limit=10&offset=0`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getMonthlyReports");

    cy.visit(REPORTS_PATH);
    clickMonthlyReportTab();

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@getMonthlyReports").then(xhr => {
      if (xhr.response) {
        const firstRowReportId = mockedResponse.data[0].id;
        cy.getBySelector(`${viewDetailsButton}-${firstRowReportId}`).click();
        cy.wait(1000);
        cy.getBySelector(pageHeaderTitle).contains("Monthly Summary Report");
      }
    });

  });

  it("should display details of monthly report and open print dialog window when clicking on Download PDF button", () => {
    const monthlyReportDetailsData = MonthlyReportDetailsResponse;
    const taskId = "88aaff17-f766-48c3-b471-05aa69a7e59a";

    const pageLink = REPORT_MONTHLY_DETAILS_PATH(taskId);
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/monthly-report/${taskId}`;

    cy.intercept("GET", API, {
      statusCode : 200,
      body : monthlyReportDetailsData
    }).as("viewMonthlyReportDetails");

    cy.visit(pageLink);

    cy.wait("@viewMonthlyReportDetails").then(xhr => {
      if (xhr.response) {
        const responseData : TaskMonthlyReport = xhr.response.body;

        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(API);

        cy.getBySelector(reportDetailsSiteName).contains(responseData.site.name);
        cy.getBySelector(reportDetailsDatePrepared).contains(getFormattedDate(new Date(responseData.createdAt) as Date));

        if (!_.isEmpty(responseData.taskCounts)) {
          const totalPatrolCount = _.sum(Object.values(responseData?.taskCounts));
          cy.getBySelector(reportMonthlyTotalPatrolCountSelector).contains(totalPatrolCount);

          const completedCount = responseData.taskCounts[TaskStatus.Completed];
          cy.getBySelector(reportMonthlyCompletedSelector).contains(completedCount);

          const missedCount = responseData.taskCounts[TaskStatus.Missed] || 0;
          const inCompletedCount = responseData.taskCounts[TaskStatus.Incomplete] || 0;
          const missedIncompletedCount = missedCount + inCompletedCount;
          cy.getBySelector(reportMonthlyMissedIncompleteSelector).contains(missedIncompletedCount);
        }

        let nightShifts : Record<string, number[]> = {},
          dayShifts : Record<string, number[]> = {};
        Object.entries(responseData?.taskStatusRecords).forEach(([patrolName,
          stats]) => {
          const firstWord = patrolName.split(" ")[0];

          if (firstWord?.toLowerCase()?.includes("night")) {
            nightShifts = {
              ...nightShifts,
              [patrolName] : stats
            };
          } else {
            dayShifts = {
              ...dayShifts,
              [patrolName] : stats
            };
          }
        });

        Object.entries(dayShifts).map(([patrolName,
          stats], key) => {
          cy.getBySelector(`report-monthly-details__day-${key}`).contains(patrolName);

          stats.map((stat) => {
            const uniqueKey = `${_.kebabCase(patrolName)}-${key}-${stat}`;
            if (stat !== 0) {
              if (stat > 1) cy.getBySelector(`monthly-report-day__cross-${uniqueKey}`).should("exist");
              else cy.getBySelector(`monthly-report-day__tick-${uniqueKey}`).should("exist");
            }
          });
        });

        Object.entries(nightShifts).map(([patrolName,
          stats], key) => {
          cy.getBySelector(`report-monthly-details__night-${key}`).contains(patrolName);

          stats.map((stat) => {
            const uniqueKey = `${_.kebabCase(patrolName)}-${key}-${stat}`;
            if (stat !== 0) {
              if (stat > 1) cy.getBySelector(`monthly-report-night__cross-${uniqueKey}`).should("exist");
              else cy.getBySelector(`monthly-report-night__tick-${uniqueKey}`).should("exist");
            }
          });
        });

        // 📌 downloading/saving pdf
        cy.getBySelector(loadingSpinner).should("not.exist");
        // cy.getBySelector(downloadPDFBtnSelector).click();
        // cy.getBySelector(downloadPDFBtnSelector).should("contain", "Preparing PDF...");
      }
    });
  });
});

const clickMonthlyReportTab = () => {
  cy.get(`[data-test="${appHeaderTabsSelector}"]`)
    .find(".a-tab")
    .eq(2)
    .click();
};
