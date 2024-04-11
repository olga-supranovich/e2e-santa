const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "oigaea",
    baseUrl: "https://santa-secret.ru/",
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  chromeWebSecurity: false,
  taskTimeout: 10000,
  viewportWidth: 1920,
  viewportHeight: 1080,
});
