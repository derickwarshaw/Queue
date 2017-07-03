const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

async function Authenticate (authenticateUser) {
  "use strict";

  const readUser = await currentDatabase.readUser(authenticateUser, "Name");

  if (readUser) {
    return Translation.user(readUser);
  } else {
    await currentDatabase.writeUser(currentDatabase.signUser(authenticateUser));
  }

  return Translation.user(await currentDatabase.readUser(authenticateUser, "Id"));
}

module.exports = Authenticate;