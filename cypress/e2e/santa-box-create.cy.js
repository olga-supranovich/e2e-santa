const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let context = {};

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();

    cy.createBox(newBoxName, maxAmount, currency, context);

    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(dashboardPage.togglePanel)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click();
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });

  let usersArray = Object.values(users).slice(1);
  usersArray.forEach((user, index) => {
    it(`approve as user${index + 1}`, () => {
      cy.visit(inviteLink);
      cy.get(generalElements.submitButton).click();
      cy.contains("войдите").click();
      cy.login(user.email, user.password);
      cy.contains("Создать карточку участника").should("exist");
      cy.createCard(wishes);

      cy.clearCookies();
    });
  });

  it("draw lots", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Коробки").click({ force: true });
    cy.contains(newBoxName).click();

    cy.contains("Перейти к жеребьевке").click({ force: true });
    cy.get(generalElements.submitButton).click();
    cy.contains("Да, провести жеребьевку").click({ force: true });
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
});
