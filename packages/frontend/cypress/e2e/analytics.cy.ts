/**
 * Tests - Dashboard Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should navigate to the dashboard page ➝ (default [month - this month, site - all])
 * should display 'Dashboard not available' for unavailable data ➝ (month - 2021, Jan, site - all)
 * should display 3 types of Graphs if fetching dashboard data success ➝ (month - 2023, Jul, site - all)
 * should select the second item in the custom Site select component
 * should load data and show statistics with 200 response
 * should not load data and show statistics with 404 response
 * should trigger the print dialog when Download PDF button is clicked
 * should revert to "Download PDF" after the print dialog is closed
 * should reset the month picker to the current month when "Clear filters" button is clicked
 */

import _ from "lodash";
import moment from "moment-timezone";

import "../support/commands";
import * as constants from "../support/constants";
import { DashboardAnalyticsResponse } from "../support/mockedResponses";

const ANALYTICS_PATH = constants.ANALYTICS_PATH;
const currentMonthInDMMMYYYY = `1-${moment().format("MMM")}-2023`;

describe("Analytics Page", () => {  
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(ANALYTICS_PATH);
  });

  it("should navigate to the dashboard page", () => {
    cy.contains("Virtual Patrol Routes")
      .should("exist");
    cy.contains("Number of Alerts Raised")
      .should("exist");
    cy.contains("Alert Types")
      .should("exist");
  });

  it("should display 'Dashboard not available' for unavailable data", () => {
    cy.getBySelector("page-loading-spinner")
      .should("not.exist");
    
    cy.getBySelector("month-picker")
      .click();
    cy.getBySelector("month-picker__prev-year")
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.getBySelector("month-picker__prev-year")
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.getBySelector("month-picker__month")
      .contains("Jan")
      .click();
    cy.getBySelector("month-picker__apply")
      .click();
    
    cy.getBySelector("dashboard-not-available-message")
      .should("include.text", "Dashboard not available yet");
  });

  it("should display 3 types of Graphs if fetching dashboard data success", () => {
    cy.getBySelector("page-loading-spinner")
      .should("not.exist");
    
    cy.getBySelector("month-picker")
      .click();
    cy.getBySelector("month-picker__month")
      .contains("Jul")
      .click();
    cy.getBySelector("month-picker__apply")
      .click();
    
    cy.contains("Virtual Patrol Routes")
      .should("exist");
    cy.contains("Number of Alerts Raised")
      .should("exist");
    cy.contains("Alert Types")
      .should("exist");
  });

  it("should select the second item in the custom Site select component", () => {
    cy.getBySelector("page-loading-spinner")
      .should("not.exist");
    
    cy.getBySelector("custom-select")
      .click();
    cy.getBySelector("custom-select__picker-container")
      .find(".option")
      .eq(1)
      .scrollIntoView() 
      .click();

    cy.getBySelector("icon-button__label")
      .should("not.contain", "All sites");
  });

  it("should load data and show statistics with 200 response", () => {
    const mockedResponse = DashboardAnalyticsResponse;
    const totalTaskCount = _.sum(_.values(mockedResponse.taskCountAnalytics));
    const totalAlerts = mockedResponse.weeklyAlertCountAnalytics.reduce((sum, count) => sum + count, 0);

    cy.intercept("GET", `dashboard-analytics?date=${currentMonthInDMMMYYYY}`, {
      statusCode : 200,
      body : mockedResponse
    }).as("getData200");
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("page-loading-spinner")
      .should("not.exist");

    cy.wait("@getData200").then(xhr => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);

        cy.wait(2000);

        // first graph
        cy.getBySelector("dashboard-page__total-routes")
          .should("contain", `Virtual Patrol Routes ${totalTaskCount}`);
        cy.get("[data-test='dashboard-page__completed-count'] span")
          .should("have.text", `${mockedResponse.taskCountAnalytics.Completed}`)
          .parent()
          .contains("Completed")
          .should("exist");
        cy.get("[data-test='dashboard-page__missed-count'] span")
          .should("have.text", `${mockedResponse.taskCountAnalytics.Missed}`)
          .parent()
          .contains("Missed")
          .should("exist");
        cy.get("[data-test='dashboard-page__incomplete-count'] span")
          .should("have.text", `${mockedResponse.taskCountAnalytics.Incomplete}`)
          .parent()
          .contains("Incomplete")
          .should("exist");
        
        // pie chart
        Object.keys(mockedResponse.alertCountAnalytics).forEach((key) => {
          const value = mockedResponse.alertCountAnalytics[key];
          const totalSum = _.sum(_.values(mockedResponse.alertCountAnalytics));
          const percentage = (value / totalSum) * 100;
          cy.contains(`${percentage.toFixed(0)}%`).should("exist");
        });

        // bar chart
        cy.getBySelector("dashboard-page__no-of-alerts-raised")
          .should("contain", "Number of Alerts Raised")
          .should("contain", totalAlerts);
        cy.getBySelector("dashboard-page__alerts-raised").within(() => {
          mockedResponse.weeklyAlertCountAnalytics.forEach((value) => {
            cy.contains(value).should("exist");
          });
        });
      }
    });
  });

  it("should not load data and show statistics with 404 response", () => {
    cy.intercept("GET", `dashboard-analytics?date=${currentMonthInDMMMYYYY}`, { statusCode : 404 }).as("getData404");
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("page-loading-spinner")
      .should("not.exist");

    cy.wait("@getData404").then(xhr => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(404);

        cy.getBySelector("dashboard-not-available-message")
          .should("include.text", "Dashboard not available yet");
      }
    });
  });

  it("should trigger the print dialog when Download PDF button is clicked", () => {
    cy.getBySelector("page-loading-spinner").should("not.exist");

    cy.getBySelector("dashboard-page__download-pdf").click();

    cy.getBySelector("dashboard-page__download-pdf").should("contain", "Preparing PDF...");
  });

  it("should revert to \"Download PDF\" after the print dialog is closed", () => {
    cy.getBySelector("page-loading-spinner").should("not.exist");

    cy.getBySelector("dashboard-page__download-pdf").click();
  
    cy.getBySelector("dashboard-page__download-pdf").should("contain", "Download PDF");
  });

  it("should reset the month picker to the current month when \"Clear filters\" button is clicked", () => {
    const selectedMonth = "Jul";
    const selectedYear = moment().year();

    cy.getBySelector("page-loading-spinner")
      .should("not.exist");

    cy.getBySelector("month-picker")
      .click();
    cy.getBySelector("month-picker__month")
      .contains(selectedMonth)
      .click();
    cy.getBySelector("month-picker__apply")
      .click();
    
    cy.getBySelector("dashboard-page__filters-labels").contains(`${moment().month(selectedMonth)
      .format("MMMM")}, ${selectedYear}`);

    cy.getBySelector("dashboard-page__btn-clear-filters").click();

    cy.getBySelector("dashboard-page__filters-labels").contains(`${moment.months(moment().month())}, ${selectedYear}`);
  });
});
