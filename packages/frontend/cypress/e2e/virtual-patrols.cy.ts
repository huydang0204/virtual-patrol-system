/**
 * Tests - Virtual Patrol Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should render today assigned doable patrols
 * should call the correct API URL when Refresh button is clicked
 * should update to cameras image/video patrolling page when clicking one of the action button
 */

import "../support/commands";
import moment from "moment-timezone";

import * as constants from "../support/constants";
import { UserAccountModel } from "../../src/model/user-account";
import { getCanStartNowTasks } from "../../src/pages/Patrolling/utils";
import { TodayAssignedPatrols29Aug2023 } from "../support/mockedResponses";
import {
  MiniUserResponse, RouteTaskResponse
} from "@vps/utils/lib/dto";
import {
  TIME_ZONE, getStartAndEndTimeOfDay, getTodayInCalendarAcceptedFormat
} from "../../src/utils/time-format";
import { PAGE_SELECTORS } from "../support/selectors";

const ANALYTICS_PATH = constants.ANALYTICS_PATH;
const VIRTUAL_PATROL_PATH = constants.VIRTUAL_PATROL_PATH;
const pageLoadingSpinnerSelector = PAGE_SELECTORS.loadingSpinner;

describe("Virtual Patrol Page", () => {
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(ANALYTICS_PATH);
    cy.wait(2000);
  });

  it("should call the correct API URL when Refresh button is clicked", () => {
    const todayDate = getTodayInCalendarAcceptedFormat();
    const adjustedMonth = todayDate.month - 1;
    const selectedDateMoment = moment({
      year : todayDate.year,
      month : adjustedMonth,
      day : todayDate.day
    });
    const {
      start : fromDate,
      end : toDate
    } = getStartAndEndTimeOfDay(selectedDateMoment.tz(TIME_ZONE));

    const filteringStatuses = ["Pending",
      "NotStarted",
      "Paused"];
    const encodedFromDate = `fromDate=${fromDate.replace("+", "%2B")}`;
    const encodedToDate = `toDate=${toDate.replace("+", "%2B")}`;
    const encodedFilteredStatuses = `filterStatuses=${JSON.stringify(filteringStatuses).replace(/"/g, "%22")}`;
    const API = `${Cypress.env("CYPRESS_API_URL")}/task/list?${encodedFromDate}&${encodedToDate}&${encodedFilteredStatuses}&filterShift=`;
    console.log(API);
    // http://localhost:9000/apis/task/list?fromDate=2023-10-11T00:00:00%2B08:00&toDate=2023-10-11T23:59:59%2B08:00&filterStatuses=[%22Pending%22,%22NotStarted%22,%22Paused%22]&filterShift=
    // http://172.16.40.7/apis/task/list?fromDate=2023-10-11T00:00:00%2B08:00&toDate=2023-10-11T23:59:59%2B08:00&filterStatuses=[%22Pending%22,%22NotStarted%22,%22Paused%22]&filterShift=

    cy.intercept("GET", API).as("fetchTodayAssignedTasksOnRefresh");
    cy.visit(VIRTUAL_PATROL_PATH);

    cy.wait(2000);
    cy.getBySelector(pageLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector("patrol-list__refresh-btn").click();


    cy.wait("@fetchTodayAssignedTasksOnRefresh").then((xhr) => {
      expect(xhr.request.url).to.equal(API);
    });
  });
});
