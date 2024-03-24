const users = require("../fixtures/users.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
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
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
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

  it("add participants manually", () => {
    cy.get(generalElements.submitButton).click();
    cy.addParticipantsManually(usersArray);
    cy.get(invitePage.inviteButton).click();
    cy.contains(
      "Карточки участников успешно созданы и приглашения уже отправляются."
    ).should("exist");

    cy.clearCookies();
  });

  let usersArray = Object.values(users).slice(1);
  usersArray.forEach((user, index) => {
    it(`approve as user${index + 1}`, () => {
      cy.visit("/login");
      cy.login(user.email, user.password);
      cy.contains("Коробки").click({ force: true });
      cy.contains(newBoxName).click();
      cy.get(dashboardPage.userCardList).should("exist");
      cy.contains(dashboardPage.userCardList, `${user.name}`).click({
        force: true,
      });
      cy.contains("Заполнить карточку участника").should("exist");
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
      url: `/api/box/${context.boxId}`,
      headers: {
        Cookie: `${userCookie}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
    });

    cy.request({
      url: `/api/box/${context.boxId}`,
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
