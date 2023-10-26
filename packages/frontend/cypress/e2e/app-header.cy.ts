/**
 * Tests - AppHeader
 * (Note: To include this entire test file, include in ./index.cy.ts, and remove  for below test blocks)
 * ============================
 * should show the settings icon for user role - Admin
 * should not show the settings icon for user role - Client
 * should not show the settings icon for user role - Officer
 * should show the notification icon
 * should have notification icon count at least 0
 * should show user name
 * should show Admin in user role place for admin login
 * should show Client in user role place for client login
 * should show Officer in user role place for officer login
 * should show logout button and if clicked, redirect to logout path
 */

import "../support/commands";
import * as constants from "../support/constants";

const ANALYTICS_PATH = constants.ANALYTICS_PATH;
const USER_CRENDENTIALS = constants.USER_CONSTANTS.crendentials;

describe("App Header", () => {  
  beforeEach(() => {
    cy.logout();
  });

  it("should show the settings icon for user role - Admin", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("app-header__settings-icon").should("be.visible");
  });

  it("should not show the settings icon for user role - Client", () => {
    cy.login(USER_CRENDENTIALS.client.username, USER_CRENDENTIALS.client.password);
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("app-header__settings-icon").should("not.exist");
  });

  it("should not show the settings icon for user role - Officer", () => {
    cy.login(USER_CRENDENTIALS.officer.username, USER_CRENDENTIALS.officer.password);
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("app-header__settings-icon").should("not.exist");
  });

  it("should show the notification icon", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);

    cy.getBySelector("app-header__noti-icon").should("be.visible");
  });

  it("should have notification icon count at least 0", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__noti-count").then(($countElement) => {
      const notificationCount = parseInt($countElement.text());
      expect(notificationCount).to.be.at.least(0, "Notification count should be 0 or greater");
    });
  });

  it("should show user name", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__username").should("be.visible")
      .then((usernameElement) => {
        const username = usernameElement.text().trim();
        expect(username.length > 0 || username === "User").to.be.true;
      });
  });

  it("should show Admin in user role place for admin login", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__user-role").should("be.visible")
      .then((usernameElement) => {
        const username = usernameElement.text().trim();
        expect(username === "Admin").to.be.true;
      });
  });

  it("should show Client in user role place for client login", () => {
    cy.login(USER_CRENDENTIALS.client.username, USER_CRENDENTIALS.client.password);
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__user-role").should("be.visible")
      .then((usernameElement) => {
        const username = usernameElement.text().trim();
        expect(username === "Client").to.be.true;
      });
  });

  it("should show Officer in user role place for officer login", () => {
    cy.login(USER_CRENDENTIALS.officer.username, USER_CRENDENTIALS.officer.password);
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__user-role").should("be.visible")
      .then((usernameElement) => {
        const username = usernameElement.text().trim();
        expect(username === "Officer").to.be.true;
      });
  });

  it("should show logout button and if clicked, redirect to logout path", () => {
    cy.login();
    cy.visit(ANALYTICS_PATH);
    
    cy.getBySelector("app-header__logout-button").should("be.visible");
    cy.getBySelector("app-header__logout-button").click();
    cy.url().should("include", constants.LOGOUT_PATH);
  });
});