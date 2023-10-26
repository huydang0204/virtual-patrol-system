/**
 * Tests - Task List Page
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should have a Daily-and-Monthly button group
 * should have date picker and Record reason column if Daily tab is clicked
 * should have month picker and not have Record reason column if Monthly tab is clicked
 * Daily tab - should fetch data and render "Daily" tasks list table on 200 response
 *  - checks first column (startable task radio button or non-startable)
 *  - checks last column for 2 status (Missed and Incomplete task) and checks thier modals to record reason
 * Daily tab - should fetch data on Search and render \"Daily\" tasks based on search value (#patrol-name)
 * Daily tab - should call new api route with filtered values on filter by status and shift for \"Daily\" tasks
 * Daily tab - should fetch data on Filter by date and render \"Daily\" tasks based on filtered date
 * Monthly tab - should fetch data and render \"Monthly\" tasks list table on 200 response - by Admin
 * Monthly tab - should fetch data on Search and render \"Monthly\" tasks based on search value (#patrol-name)
 * Monthly tab - should call new api route with filtered values on filter by status and shift for \"Monthly\" tasks
 * Monthly tab - should fetch data on Filter by month and render \"Monthly\" tasks based on filtered month
 */

import "../support/commands";
import moment from "moment-timezone";

import * as constants from "../support/constants";
import { USER_ROLE } from "@vps/utils/lib/data";
import { DEFAULT_START_ALLOW_TIME_IN_SECOND } from "../../src/data/common-data";
import {
  TaskListResponse, TaskListResponseFor10Aug2023, TaskListResponseForJul2023, TaskListResponseForJul2023Filter, TaskListResponseForJun2023 
} from "../support/mockedResponses";
import { UserAccountModel } from "../../src/model/user-account";
import {
  getDayNightTasks, AllowStartedStatuses 
} from "../../src/pages/TaskList/utils";
import {
  getTodayInCalendarAcceptedFormat, getStartAndEndTimeOfDay, TIME_ZONE, getStartAndEndTimeOfMonth, getFormattedMonthYear
} from "../../src/utils/time-format";
import { checkDateTimeisXSecondsAway } from "../../src/utils/date-time";
import {
  MODAL_SELECTORS, MONTH_PICKER_SELECTORS, RADIO_BUTTON_CUSTOM_SELECTOR, TABLE_SELECTORS 
} from "../support/selectors";
import { TaskStatus } from "@vps/utils/lib/data";

const TASK_LIST_PATH = constants.TASK_LIST_PATH;
const tableDatePickerSelector = TABLE_SELECTORS.datePicker;
const tableFilterSelector = TABLE_SELECTORS.filter;
const tableFilterProceedBtn = TABLE_SELECTORS.filterProceedBtn;
const tableSearchInputSelector = TABLE_SELECTORS.searchInput;
const tableLoadingSpinnerSelector = TABLE_SELECTORS.loadingSpinner;
const monthPickerSelector = MONTH_PICKER_SELECTORS.picker;
const monthPickerMonthSelector = MONTH_PICKER_SELECTORS.month;
const monthPickerApplyBtnSelector = MONTH_PICKER_SELECTORS.applyBtn;
const radioButtonCustomSelector = RADIO_BUTTON_CUSTOM_SELECTOR;
const confirmModalCancelBtn = MODAL_SELECTORS.confirm.btnCancel;
const btnCloseModalSelector = MODAL_SELECTORS.nofity.btnClose;
const notifyModalSelector = MODAL_SELECTORS.nofity.name;

describe("Task List Page", () => {  
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(TASK_LIST_PATH);
    cy.wait(2000);
  });

  after(() => cy.logout());

  it("should have a Daily-and-Monthly button group", () => {
    cy.getBySelector("task-list__daily-monthly-btn-group").contains("Daily")
      .should("be.visible");
    cy.getBySelector("task-list__daily-monthly-btn-group").contains("Monthly")
      .should("be.visible");
  });

  it("should have date picker and Record reason column if Daily tab is clicked", () => {
    cy.getBySelector("task-list__daily-btn").click({ force : true });
    cy.getBySelector(tableDatePickerSelector).should("exist");
    cy.getBySelector("task-list__table").contains("Record Reason")
      .should("exist");
  });

  it("should have month picker and not have Record reason column if Monthly tab is clicked", () => {
    cy.getBySelector("task-list__monthly-btn").click({ force : true });
    cy.getBySelector(monthPickerSelector).should("exist");
    cy.getBySelector("task-list__table").contains("Record Reason")
      .should("not.exist");
  });

  // START - Daily tab //
  it("Daily tab - should fetch data and render \"Daily\" tasks list table on 200 response - by Admin", () => {
    const todayDate = getTodayInCalendarAcceptedFormat();

    const initialLoadData = "fetchTask200";
    apiFetchTasks(initialLoadData);

    cy.wait(`@${initialLoadData}`).then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const responseData = xhr.response.body.data;
        const {
          dayShift,
          nightShift
        } = getDayNightTasks(responseData); 

        expect(xhr.response.statusCode).to.equal(200);

        cy.getBySelector("tbody-w-headers__label-Shift-Day").should("contain", "Shift Day");
        cy.getBySelector("tbody-w-headers__label-Shift-Night").should("contain", "Shift Night");
    
        // checks total count of 2 shifts
        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", dayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", nightShift.length);

        // checks first column format
        cy.get("[data-test=\"task-list__daily-today-date\"]").should("exist")
          .within(() => {
            cy.contains("Today");
          });

        // checks table columns
        constants.TASK_LIST_DAILY_COLUMNS.forEach(columnName => cy.getBySelector("task-list__table").contains(columnName)
          .should("exist"));

        cy.getLocalStorage().then((lsValue : UserAccountModel) => {
          responseData.forEach(row => {
            const isAdmin = lsValue.role === USER_ROLE.Admin;
            const accessibleUser = row.route.assignedUsers.some(user => user.id === lsValue.accountId);

            // checking 1st column, (whether `-` or radio button)
            if (AllowStartedStatuses.includes(row.status) && accessibleUser) {
              cy.getBySelector(radioButtonCustomSelector).should("exist");

              // checking if radio button is disabled or not
              const canStartNow = checkDateTimeisXSecondsAway(row.occurrenceDate, row.startTime, row?.route.allowStartTime || DEFAULT_START_ALLOW_TIME_IN_SECOND);
              // can't start because startAllowTime is not reached yet
              if ((TaskStatus.Pending && !canStartNow) && (TaskStatus.NotStarted !== row.status) && (TaskStatus.Paused !== row.status)) {
                cy.get("[data-test=\"radio-button-custom\"] > :first-child")
                  .should("have.class", "disabled");
              } 
              // can start now
              else {
                // check if click, it should be selected
                cy.getBySelector(`task-list__btn-select-task-${row.id}`).scrollIntoView()
                  .click();
                cy.get("[data-test=\"radio-button-custom\"] > :first-child")
                  .should("have.class", "checked");

                // if one task is selected, `Start patrolling` button is enabled
                cy.get("[data-test=task-list__btn-start-patrolling] button").should("not.have.class", "disabled");
                
                // on clicking again, it should be unselected
                cy.getBySelector(`task-list__btn-select-task-${row.id}`).scrollIntoView()
                  .click();
                cy.get("[data-test=\"radio-button-custom\"] > :first-child")
                  .should("have.class", "unchecked");

                // if no task is selected, `Start patrolling` button is disabled
                cy.get("[data-test=task-list__btn-start-patrolling] button").should("have.class", "disabled");
              }
            } else {
              cy.getBySelector("task-list__unallowed-task").should("exist");
            }

            // last column icon check
            switch (row.status) {
              case TaskStatus.Completed:
              case TaskStatus.NotStarted:
              case TaskStatus.Pending:
                cy.getBySelector(`task-list__CP-NS-PE-icon-${row.id}`).should("exist");
                break;

              case TaskStatus.Paused:
                cy.getBySelector(`task-list__PA-icon-${row.id}`).should("exist");
                break;
              
              case TaskStatus.OnGoing:
                cy.getBySelector(`task-list__OG-icon-${row.id}`).should("exist");
                break;
              
              case TaskStatus.Missed:
              case TaskStatus.Incomplete: {
                // admin can see which missed/incomplete tasks' end comment has been submitted or not
                if (isAdmin && !accessibleUser) {
                  if (!row.endComment) cy.getBySelector(`task-list__endCmt-absent-Admin-${row.id}`).should("exist");
                  else cy.getBySelector(`task-list__endCmt-present-Admin-${row.id}`).should("exist");
                } else if (isAdmin || accessibleUser) {
                  // if this task is mine or accessible by current user and endComment has not submitted yet
                  if (!row.endComment) {
                    cy.get(`[data-test=task-list__btn-record-reason-${row.id}] button`)
                      .should("have.class", "btn-danger")
                      .click();

                    // End comment alert checks
                    if (row.status === TaskStatus.Missed) {
                      cy.getBySelector("task-list__alert-missed-warning").should("exist");
                      cy.getBySelector(confirmModalCancelBtn).should("be.visible")
                        .click();
                    } else if (row.status === TaskStatus.Incomplete) {
                      cy.getBySelector("task-list__alert-incomplete-warning").should("exist");
                      cy.getBySelector(confirmModalCancelBtn).should("be.visible")
                        .click();
                    }
                  } else cy.getBySelector(`task-list__endCmt-present-${row.id}`).should("exist");
                }
                break;
              }
            }
          });
        });
      }
    });
  });

  it("Daily tab - should fetch data on Search and render \"Daily\" tasks based on search value (#patrol-name)", () => {
    const searchText = "Lo";
    const searchedData = TaskListResponse.data.filter(taskList => taskList.name.toLowerCase().includes(searchText.toLowerCase()));

    const initialLoadData = "fetchTask200";
    apiFetchTasks(initialLoadData);

    cy.wait(`@${initialLoadData}`).then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const {
          dayShift : searchedDayShift,
          nightShift : searchedNightShift
        } = getDayNightTasks(searchedData); 

        expect(xhr.response.statusCode).to.equal(200);

        cy.getBySelector(notifyModalSelector).should("exist")
          .then(() => {
            cy.getBySelector(btnCloseModalSelector).click();
          });

        cy.getBySelector(tableSearchInputSelector).type(searchText);

        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", searchedDayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", searchedNightShift.length);
      }
    });
  });

  it("Daily tab - should call new api route with filtered values on filter by status and shift for \"Daily\" tasks", () => {
    const filteringShift : string[] = ["Day"];
    const filteringStatuses : string[] = ["Completed",
      "Missed"];

    // prepare request
    const mockedResponse = TaskListResponse.data.filter(task => filteringStatuses.includes(task.status));
    const todayDate = getTodayInCalendarAcceptedFormat();
    const selectedDateMoment = moment({
      year : todayDate.year,
      month : todayDate.month - 1,
      day : todayDate.day
    });
    const {
      start : fromDate,
      end : toDate
    } = getStartAndEndTimeOfDay(selectedDateMoment.tz(TIME_ZONE));
    
    const encodedFilteredStatuses = JSON.stringify(filteringStatuses).replace(/"/g, "%22");
    cy.intercept("GET", "list*", {
      statusCode : 200,
      body : mockedResponse
    }).as("getFilteredData");

    // Filter actions on UI 
    cy.scrollTo("bottom", {
      duration : 500,
      ensureScrollable : false 
    });
    cy.getBySelector(tableFilterSelector).click();
    cy.getBySelector(tableFilterSelector).within(() => {
      filteringStatuses.forEach(status => cy.contains(status).click());
      filteringShift.forEach(shift => cy.contains(shift).click());
    });
    cy.getBySelector(tableFilterProceedBtn).click();

    // resolve request
    cy.wait("@getFilteredData").then(xhr => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?fromDate=${fromDate.replace("+", "%2B")}&toDate=${toDate.replace("+", "%2B")}&filterStatuses=${encodedFilteredStatuses}&filterShift=${filteringShift}`);
        
        const responseData = xhr.response.body;
        expect(responseData).to.have.lengthOf(5);
        
        const {
          dayShift,
          nightShift
        } = getDayNightTasks(responseData); 
        expect(dayShift).to.have.lengthOf(4);
        expect(nightShift).to.have.lengthOf(1);
      }
    });
  });

  it("Daily tab - should fetch data on Filter by date and render \"Daily\" tasks based on filtered date", () => {
    // 10-Aug-2023
    const filteringFromDate = "2023-08-10T00:00:00%2B08:00", 
      filteringToDate = "2023-08-10T23:59:59%2B08:00";

    // this url should exact match, including filters
    cy.intercept("GET", `list?fromDate=${filteringFromDate}&toDate=${filteringToDate}&filterStatuses=[]&filterShift=`, {
      statusCode : 200,
      body : TaskListResponseFor10Aug2023
    }).as("fetchTasksWithSpecificDate");

    cy.visit(TASK_LIST_PATH);

    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.getBySelector(tableDatePickerSelector).click();
    // getting Calendar controls
    cy.get(".-shown > .Calendar__monthText").click();
    cy.get(":nth-child(8) > .Calendar__monthSelectorItemText").click();
    cy.get("[aria-label=\"Thursday, 10 August 2023\"]").click();
    cy.get(".d-flex > .btn-primary").click();

    cy.wait("@fetchTasksWithSpecificDate").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?fromDate=${filteringFromDate}&toDate=${filteringToDate}&filterStatuses=[]&filterShift=`);

        const responseData = xhr.response.body.data;
        expect(responseData).to.have.lengthOf(13);

        const {
          dayShift : filteredDayShift,
          nightShift : filteredNightShift
        } = getDayNightTasks(responseData); 

        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", filteredDayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", filteredNightShift.length);
      }
    });
  });
  // END - Daily tab //

  // START - Monthly tab //
  it("Monthly tab - should fetch data and render \"Monthly\" tasks list table on 200 response - by Admin", () => {
    const year = moment().year();
    const month = moment().month() - 1;

    const {
      start : fromDate,
      end : toDate
    } = getStartAndEndTimeOfMonth({
      year,
      month 
    });
    const apiURL = `list?fromDate=${fromDate.replace("+", "%2B")}&toDate=${toDate.replace("+", "%2B")}&filterStatuses=[]&filterShift=`;

    cy.intercept("GET", `${apiURL}`, {
      statusCode : 200,
      body : TaskListResponseForJul2023
    }).as("fetchTask200");
    cy.getBySelector("task-list__monthly-btn").click({ force : true });
    cy.visit(TASK_LIST_PATH);
    cy.wait(2000);
    cy.getBySelector("task-list__monthly-btn").click({ force : true });
  
    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@fetchTask200").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const responseData = xhr.response.body.data;
        const {
          dayShift,
          nightShift
        } = getDayNightTasks(responseData); 

        // checks status code and request url
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/${apiURL}`);

        cy.getBySelector("tbody-w-headers__label-Shift-Day").should("contain", "Shift Day");
        cy.getBySelector("tbody-w-headers__label-Shift-Night").should("contain", "Shift Night");
    
        // checks total count of 2 shifts
        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", dayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", nightShift.length);

        // checks first column format
        const monthDisplayDate = getFormattedMonthYear(new Date(year, month));
        cy.getBySelector("task-list__monthly-current-month").contains(monthDisplayDate)
          .should("exist"); // format : `June, 2023`

        // checks table columns
        constants.TASK_LIST_MONTHLY_COLUMNS.forEach(columnName => cy.getBySelector("task-list__table").contains(columnName)
          .should("exist"));
      }
    });
  });

  it("Monthly tab - should fetch data on Search and render \"Monthly\" tasks based on search value (#patrol-name)", () => {
    const year = moment().year();
    const month = moment().month() - 1;
    const searchText = "video-feed";

    const {
      start : fromDate,
      end : toDate
    } = getStartAndEndTimeOfMonth({
      year,
      month 
    });
    const apiURL = `list?fromDate=${fromDate.replace("+", "%2B")}&toDate=${toDate.replace("+", "%2B")}&filterStatuses=[]&filterShift=`;
    
    cy.intercept("GET", apiURL, {
      statusCode : 200,
      body : TaskListResponseForJul2023
    }).as("fetchTask200");
    cy.getBySelector("task-list__monthly-btn").click();
    cy.visit(TASK_LIST_PATH);
    cy.wait(2000);
    cy.getBySelector("task-list__monthly-btn").click();
  
    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    cy.wait("@fetchTask200").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        const responseData = xhr.response.body.data;
        const searchedData = responseData.filter(taskList => taskList.name.toLowerCase().includes(searchText.toLowerCase()));
        const {
          dayShift : searchedDayShift,
          nightShift : searchedNightShift
        } = getDayNightTasks(searchedData); 

        expect(xhr.response.statusCode).to.equal(200);

        cy.get("[data-test=table__search-input]").type(searchText);

        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", searchedDayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", searchedNightShift.length);
      }
    });
  });

  it("Monthly tab - should call new api route with filtered values on filter by status and shift for \"Monthly\" tasks", () => {
    const year = moment().year();
    const month = moment().month() - 1;
    const filteringShift : string[] = ["Night"];
    const filteringStatuses : string[] = ["Completed",
      "Incomplete"];
    const mockedResponse = TaskListResponseForJul2023Filter.data;

    // prepare request
    const {
      start : fromDate,
      end : toDate
    } = getStartAndEndTimeOfMonth({
      year,
      month 
    });
    const apiURL = `list?fromDate=${fromDate.replace("+", "%2B")}&toDate=${toDate.replace("+", "%2B")}&filterStatuses=[]&filterShift=`;

    cy.intercept("GET", apiURL, {
      statusCode : 200,
      body : {
        count : mockedResponse.length,
        data : mockedResponse 
      }
    }).as("getFilteredData");
    cy.getBySelector("task-list__monthly-btn").click();
    cy.visit(TASK_LIST_PATH);
    cy.wait(2000);
    cy.getBySelector("task-list__monthly-btn").click();
  
    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    // Filter actions on UI
    cy.getBySelector(tableFilterSelector).click();
    cy.getBySelector(tableFilterSelector).within(() => {
      filteringStatuses.forEach(status => cy.contains(status).click());
      filteringShift.forEach(shift => cy.contains(shift).click());
    });
    cy.getBySelector(tableFilterProceedBtn).click();

    // resolve request
    cy.wait("@getFilteredData").then(xhr => {
      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        
        const responseData = xhr.response.body.data;
        expect(responseData).to.have.lengthOf(3);

        const {
          dayShift,
          nightShift
        } = getDayNightTasks(responseData); 
        expect(dayShift).to.have.lengthOf(2);
        expect(nightShift).to.have.lengthOf(1);
      }
    });
  });

  it("Monthly tab - should fetch data on Filter by month and render \"Monthly\" tasks based on filtered month", () => {
    const selectedMonth = "Jun";
    const filteringFromDate = "2023-06-01T00:00:00%2B08:00", 
      filteringToDate = "2023-06-30T23:59:59%2B08:00"; // Jun
    const mockedResponse = TaskListResponseForJun2023.data;

    // prepare request
    const apiURL = `list?fromDate=${filteringFromDate}&toDate=${filteringToDate}&filterStatuses=[]&filterShift=`;

    cy.intercept("GET", apiURL, {
      statusCode : 200,
      body : {
        count : mockedResponse.length,
        data : mockedResponse 
      }
    }).as("fetchTasksByMonth");

    cy.getBySelector("task-list__monthly-btn").click();
    cy.visit(TASK_LIST_PATH);
    cy.wait(1000);
    cy.getBySelector("task-list__monthly-btn").click();
  
    cy.getBySelector(tableLoadingSpinnerSelector)
      .should("not.exist");

    // Filter actions on UI
    cy.getBySelector(monthPickerSelector).click();
    cy.getBySelector(monthPickerMonthSelector)
      .contains(selectedMonth)
      .click();
    cy.getBySelector(monthPickerApplyBtnSelector)
      .click();

    cy.wait("@fetchTasksByMonth").then(xhr => {
      cy.wait(2000);

      if (xhr.response) {
        expect(xhr.response.statusCode).to.equal(200);
        expect(xhr.request.url).to.eq(`${Cypress.env("CYPRESS_API_URL")}/task/list?fromDate=${filteringFromDate}&toDate=${filteringToDate}&filterStatuses=[]&filterShift=`);

        const responseData = xhr.response.body.data;
        expect(responseData).to.have.lengthOf(41);

        const {
          dayShift : filteredDayShift,
          nightShift : filteredNightShift
        } = getDayNightTasks(responseData); 

        cy.get("[data-test=tbody-w-headers__count-Shift-Day]").find(".badge-label")
          .should("contain", filteredDayShift.length);
        cy.get("[data-test=tbody-w-headers__count-Shift-Night]").find(".badge-label")
          .should("contain", filteredNightShift.length);
      }
    });
  });
  // END - Monthly Tab //
});

const apiFetchTasks = (alias : string, filteredMockedData ?: any, queryStrings ?: { filterStatuses : string[], filterShift : string }) => {
  const mockedResponse = !!filteredMockedData ? filteredMockedData : TaskListResponse;

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

  cy.getBySelector("task-list__daily-btn").click({ force : true });
  
  // this url should exact match, including filters
  let encodedFilteredStatuses = "[]";
  if (queryStrings?.filterStatuses) encodedFilteredStatuses = JSON.stringify(queryStrings?.filterStatuses).replace(/"/g, "%22");

  cy.intercept("GET", `list?fromDate=${fromDate.replace("+", "%2B")}&toDate=${toDate.replace("+", "%2B")}&filterStatuses=${encodedFilteredStatuses}&filterShift=${queryStrings?.filterShift || ""}`, {
    statusCode : 200,
    body : mockedResponse
  }).as(alias);

  cy.visit(TASK_LIST_PATH);

  cy.getBySelector(tableLoadingSpinnerSelector)
    .should("not.exist");
};