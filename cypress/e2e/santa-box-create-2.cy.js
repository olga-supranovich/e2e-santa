const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box, add participants manually and run it", () => {
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
  let userCookie = Cypress.config("userCookie");
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let boxId;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(boxPage.boxIdField)
      .invoke("val")
      .as("value")
      .then((value) => {
        boxId = value;
      });
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
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(dashboardPage.togglePanel)
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants manually", () => {
    cy.get(generalElements.submitButton).click();

    let usersArray = Object.values(users).slice(1);

    cy.addParticipantsManually(usersArray);
    cy.get(invitePage.inviteButton).click();
    cy.contains(
      "Карточки участников успешно созданы и приглашения уже отправляются."
    ).should("exist");

    cy.clearCookies();
  });

  it("approve as user1", () => {
    cy.visit("/login");
    cy.login(users.user1.email, users.user1.password);
    cy.contains("Коробки").click({ force: true });
    cy.contains(newBoxName).click();
    cy.get(dashboardPage.userCardList).should("exist");
    cy.contains(dashboardPage.userCardList, `${users.user1.name}`).click({
      force: true,
    });
    cy.contains("Заполнить карточку участника").should("exist");
    cy.createCard(wishes);

    cy.clearCookies();
  });

  it("approve as user2", () => {
    cy.visit("/login");
    cy.login(users.user2.email, users.user2.password);
    cy.contains("Коробки").click({ force: true });
    cy.contains(newBoxName).click();
    cy.get(dashboardPage.userCardList).should("exist");
    cy.contains(dashboardPage.userCardList, `${users.user2.name}`).click({
      force: true,
    });
    cy.contains("Заполнить карточку участника").should("exist");
    cy.createCard(wishes);

    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.visit("/login");
    cy.login(users.user3.email, users.user3.password);
    cy.contains("Коробки").click({ force: true });
    cy.contains(newBoxName).click();
    cy.get(dashboardPage.userCardList).should("exist");
    cy.contains(dashboardPage.userCardList, `${users.user3.name}`).click({
      force: true,
    });
    cy.contains("Заполнить карточку участника").should("exist");
    cy.createCard(wishes);

    cy.clearCookies();
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
    cy.clearCookies();
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
      url: `/api/box/${boxId}`,
      headers: {
        Cookie: `${userCookie}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
    cy.request({
      url: `/api/box/${boxId}`,
      headers: {
        Cookie: `${userCookie}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body.error.message).to.eq("BOX_NOT_FOUND");
    });

    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Коробки").click({ force: true });
    cy.contains(newBoxName).should("not.exist");
  });
});
