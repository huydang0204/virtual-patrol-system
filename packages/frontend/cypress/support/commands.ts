/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    login(email ?: string, password ?: string): Chainable<any>;
    logout(): Chainable<any>;
    getBySelector(selector: string, ...args: any[]): Chainable<any>;
    getBySelectorLike(selector: string, ...args: any[]): Chainable<any>;
    getLocalStorage(key?: string): Chainable<any>;
    setLocalStorage(values : {}, key ?: string): Chainable<any>;
}
}

Cypress.Commands.add("getBySelector", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelectorLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

let loggedIn = false;
Cypress.Commands.add("login", (email = "admin@vps.com", password = "admin") : void => {
  cy.visit(Cypress.env("CYPRESS_LoginPath"));

  cy.get("input[name=\"email\"]").type(email);
  cy.get("input[name=\"password\"]").type(password);
  cy.get("button[type=\"submit\"]").click();

  cy.wait(1000);
  loggedIn = true;
});

Cypress.Commands.add("logout", () : void => {
  if (loggedIn) {
    cy.visit(Cypress.env("CYPRESS_LogoutPath"));
    loggedIn = false;
  }

  cy.wait(1000);
});

Cypress.Commands.add("setLocalStorage", (values, key = Cypress.env("CYPRESS_LocalStorageAuthKey")) : void => {
  window.localStorage.setItem(key, JSON.stringify(values));
});

Cypress.Commands.add("getLocalStorage", (key = Cypress.env("CYPRESS_LocalStorageAuthKey")) : void => {
  cy.window().its("localStorage")
    .invoke("getItem", key)
    .then((value) => {
      if (value) return JSON.parse(value);
      return null;
    });
});
