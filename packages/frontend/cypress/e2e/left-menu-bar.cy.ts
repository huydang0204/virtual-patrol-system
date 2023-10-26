/**
 * Tests - Left Menu Bar
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove .skip for below test blocks)
 * ============================
 * should show correct menu items for Admin and go to correct paths
 * should show only correct menu items for Client and go to correct paths
 * should show only correct menu items for Officer and go to correct paths
 */

import "../support/commands";
import * as constants from "../support/constants";

const ANALYTICS_PATH = constants.ANALYTICS_PATH;
const TASK_LIST_PATH = constants.TASK_LIST_PATH;
const USER_CRENDENTIALS = constants.USER_CONSTANTS.crendentials;
const sidebar = constants.USER_CONSTANTS.sidebar;

describe("Left Menu Bar", () => {  
  beforeEach(() => {
    cy.logout();
  });
  
  it("should show correct menu items for Admin and go to correct paths", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);

    sidebar.admin.forEach(item => {
      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .should("be.visible");
      
      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .click();
      cy.url().should("include", item.path);
    });
  });

  it("should show only correct menu items for Client and go to correct paths", () => {
    cy.login(USER_CRENDENTIALS.client.username, USER_CRENDENTIALS.client.password);
    cy.visit(ANALYTICS_PATH);

    sidebar.client.forEach(item => {
      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .should("be.visible");

      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .click();
      cy.url().should("include", item.path);
    });

    // admin-specific items are not visible for the client
    sidebar.admin.forEach(item => {
      if (!sidebar.client.some(clientItem => clientItem.label === item.label)) {
        cy.getBySelector("left-menu-bar__item").contains(item.label)
          .should("not.exist");
      }
    });
  });

  it("should show only correct menu items for Officer and go to correct paths", () => {
    cy.login(USER_CRENDENTIALS.officer.username, USER_CRENDENTIALS.officer.password);
    cy.visit(TASK_LIST_PATH);

    sidebar.officer.forEach(item => {
      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .should("be.visible");
      
      cy.getBySelector("left-menu-bar__item").contains(item.label)
        .click();
      cy.url().should("include", item.path);
    });

    // admin-specific items are not visible for the officer
    sidebar.admin.forEach(item => {
      if (!sidebar.officer.some(officerItem => officerItem.label === item.label)) {
        cy.getBySelector("left-menu-bar__item").contains(item.label)
          .should("not.exist");
      }
    });
  });
});
