const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://santa-secret.ru/",
    testIsolation: false,
    userCookie:
      "_ym_uid=1710697498810842493; _ym_d=1710697498; _ym_isad=2; uuid=3d39992f81507b03%3A1; __upin=6DCARnNFpswruOWaa+Qusg; _buzz_fpc=JTdCJTIycGF0aCUyMiUzQSUyMiUyRiUyMiUyQyUyMmRvbWFpbiUyMiUzQSUyMi5zdGFnaW5nLmxwaXRrby5ydSUyMiUyQyUyMmV4cGlyZXMlMjIlM0ElMjJNb24lMkMlMjAxNyUyME1hciUyMDIwMjUlMjAxNyUzQTU0JTNBNTMlMjBHTVQlMjIlMkMlMjJTYW1lU2l0ZSUyMiUzQSUyMkxheCUyMiUyQyUyMnZhbHVlJTIyJTNBJTIyJTdCJTVDJTIydWZwJTVDJTIyJTNBJTVDJTIyZWMyY2Q0OGVmN2NhNGIxZjE0MTkzYjdhNDI1NTMyMjElNUMlMjIlMkMlNUMlMjJicm93c2VyVmVyc2lvbiU1QyUyMiUzQSU1QyUyMjEyMi4wJTVDJTIyJTdEJTIyJTdE; _buzz_aidata=JTdCJTIycGF0aCUyMiUzQSUyMiUyRiUyMiUyQyUyMmRvbWFpbiUyMiUzQSUyMi5zdGFnaW5nLmxwaXRrby5ydSUyMiUyQyUyMmV4cGlyZXMlMjIlM0ElMjJNb24lMkMlMjAxNyUyME1hciUyMDIwMjUlMjAxNyUzQTU0JTNBNTMlMjBHTVQlMjIlMkMlMjJTYW1lU2l0ZSUyMiUzQSUyMkxheCUyMiUyQyUyMnZhbHVlJTIyJTNBJTIyJTdCJTVDJTIydWZwJTVDJTIyJTNBJTVDJTIyNkRDQVJuTkZwc3dydU9XYWElMkJRdXNnJTVDJTIyJTJDJTVDJTIyYnJvd3NlclZlcnNpb24lNUMlMjIlM0ElNUMlMjIxMjIuMCU1QyUyMiU3RCUyMiU3RA==; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwMDE2MjcsImlhdCI6MTcxMDY5ODQ5NiwiZXhwIjoxNzEwNzAyMDk2fQ.Vb87ABaXbQnJYLEXvlP75ifCPteC86LV8kW_dcnq9ZI",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  chromeWebSecurity: false,
  taskTimeout: 10000,
});
