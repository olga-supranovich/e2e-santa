// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("../fixtures/pages/loginPage.json");
const boxPage = require("../fixtures/pages/boxPage.json");

const generalElements = require("../fixtures/pages/general.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("createCard", (text) => {
  cy.get(generalElements.submitButton).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeBoxPage.wishesInput).type(text);
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
});

Cypress.Commands.add("addParticipantsManually", (array) => {
  for (let i = 0; i < array.length; i++) {
    cy.get(`:nth-child(${2 * i + 1}) > .frm-wrapper > #input-table-${i}`).type(
      array[i].name
    );
    cy.get(`:nth-child(${2 * i + 2}) > .frm-wrapper > #input-table-${i}`).type(
      array[i].email
    );
  }
});

Cypress.Commands.add(
  "createBox",
  (newBoxName, maxAmount, currency, context) => {
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxIdField)
      .invoke("val")
      .then((boxId) => (context.boxId = boxId));
    cy.get(generalElements.arrowRight).click();
    cy.contains("Выберите обложку").should("exist");
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.contains("Стоимость подарков").should("exist");
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.contains("Дополнительные настройки").should("exist");
    cy.get(generalElements.arrowRight).click();
  }
);

// Cypress.Commands.add("createBox", (newBoxName, maxAmount, currency) => {
//   cy.get(boxPage.boxNameField).type(newBoxName);
//   cy.get(boxPage.boxIdField).invoke("val").as("value");
//   // .then(function (value) {
//   //   boxId = value;
//   // });
//   // cy.log("Box ID:", boxId);
//   cy.get(generalElements.arrowRight).click();
//   cy.contains("Выберите обложку").should("exist");
//   cy.get(boxPage.sixthIcon).click();
//   cy.get(generalElements.arrowRight).click();
//   cy.contains("Стоимость подарков").should("exist");
//   cy.get(boxPage.giftPriceToggle).check({ force: true });
//   cy.get(boxPage.maxAnount).type(maxAmount);
//   cy.get(boxPage.currency).select(currency);
//   cy.get(generalElements.arrowRight).click();
//   cy.contains("Дополнительные настройки").should("exist");
//   cy.get(generalElements.arrowRight).click();
//   cy.get("@value").then((value) => {
//     cy.log(`boxId0: ${value}`);
//   });
//   // return cy.get("@value");
//   // return cy.wrap(boxId);
// });

// Cypress.Commands.add("createBox", (newBoxName, maxAmount, currency) => {
//   cy.get(boxPage.boxNameField).type(newBoxName);

//   return cy
//     .get(boxPage.boxIdField)
//     .invoke("val")
//     .then((boxIdValue) => {
//       // Store the value of boxIdValue in a variable if you need to use it later
//       const boxId = boxIdValue;
//       // Perform further actions with the obtained value
//       cy.get(generalElements.arrowRight).click();
//       cy.contains("Выберите обложку").should("exist");
//       cy.get(boxPage.sixthIcon).click();
//       cy.get(generalElements.arrowRight).click();
//       cy.contains("Стоимость подарков").should("exist");
//       cy.get(boxPage.giftPriceToggle).check({ force: true });
//       cy.get(boxPage.maxAnount).type(maxAmount);
//       cy.get(boxPage.currency).select(currency);
//       cy.get(generalElements.arrowRight).click();
//       cy.contains("Дополнительные настройки").should("exist");
//       cy.get(generalElements.arrowRight).click();
//       cy.log(`boxId0: ${boxId}`); // Log or use the boxId value
//     });
// });
