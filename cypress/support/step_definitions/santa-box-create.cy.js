import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";

const users = require("../../fixtures/users.json");
const generalElements = require("../../fixtures/pages/general.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");

let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let context = {};

Given("user logs in as {string} and {string}", function (email, password) {
  cy.visit("/login");
  cy.login(email, password);
});

When("user creates a new box", () => {
  cy.contains("Создать коробку").click();
  cy.createBox(newBoxName, maxAmount, currency, context);
});

Then("user should see created box name", () => {
  cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
});

Then("user should see toggle panel on the box page", () => {
  cy.get(dashboardPage.togglePanel)
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

Then("user clicks button Add participants and copies invite link", () => {
  cy.get(generalElements.submitButton).click();
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
    });
  cy.log(inviteLink);
  cy.clearCookies();
});

When("user fills in the form with participants data", (dataTable) => {
  let usersArray = dataTable.hashes();
  cy.get(generalElements.submitButton).click();
  cy.addParticipantsManually(usersArray);
});

Then("user submits and correct message is displayed", function () {
  cy.get(invitePage.inviteButton).click();
  cy.contains(
    "Карточки участников успешно созданы и приглашения уже отправляются."
  ).should("exist");

  cy.clearCookies();
});

When(
  "user opens invite link and logs in as {string} and {string}",
  (email, password) => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.login(email, password);
    cy.contains("Создать карточку участника").should("exist");
  }
);

Then("user {string} opens card", (name) => {
  cy.get(dashboardPage.userCardList).should("exist");
  cy.contains(dashboardPage.userCardList, name).click({
    force: true,
  });
  cy.contains("Заполнить карточку участника").should("exist");
});

Then("user creates card", () => {
  cy.createCard(wishes);
  cy.clearCookies();
});

When("user opens created box", () => {
  cy.contains("Коробки").click({ force: true });
  cy.contains(newBoxName).click();
});

When("user draw lots", () => {
  cy.contains("Перейти к жеребьевке").click({ force: true });
  cy.get(generalElements.submitButton).click();
  cy.contains("Да, провести жеребьевку").click({ force: true });
});

Then("successful message is displayed", () => {
  cy.contains("Жеребьевка проведена").should("exist");
});

after("delete box", () => {
  let userCookie;
  cy.request({
    method: "POST",
    url: "/api/login",
    body: {
      email: `${users.userAutor.email}`,
      password: `${users.userAutor.password}`,
    },
  }).then((response) => {
    userCookie = response.headers["set-cookie"].join("; ");
    cy.wrap(userCookie).as("userCookie");
  });
  cy.request({
    method: "DELETE",
    url: `/api/box/${context.boxId}`,
    headers: {
      Cookie: `${userCookie}`,
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
  });
});
