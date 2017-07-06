const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

async function Authenticate (authenticateUser) {
  "use strict";

  console.log(authenticateUser);
}

module.exports = Authenticate;