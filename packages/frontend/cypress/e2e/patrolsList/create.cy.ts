
import "../../support/commands";
import * as constants from "../../support/constants";

const PATROLS_LIST_PATH = constants.PATROL_LIST_PATH;
const CREATE_PATROL_PATH = constants.CREATE_PATROL_PATH;
const pageHeaderTitleSelector = constants.CYPRESS_SELECTORS.pageHeaderTitleSelector;
const appReturnToPrevPage = constants.CYPRESS_SELECTORS.appReturnToPrevPage;

describe("Patrols List Page", () => {  
  beforeEach(() => {
    cy.session("login", () => {
      cy.login();
    });
    cy.visit(CREATE_PATROL_PATH);
    cy.wait(2000);
  });
    
  after(() => cy.logout());

  it("should navigate to Patrol Route creation page, and redirect to patrols list page on clicking return button", () => {
    cy.getBySelector(pageHeaderTitleSelector).contains("Create Patrol Route")
      .should("exist");
          
    cy.getBySelector(appReturnToPrevPage).click();
    cy.url().should("eq", PATROLS_LIST_PATH);
    cy.getBySelector(pageHeaderTitleSelector).contains("Virtual Patrol Routes")
      .should("exist");
  });
});

