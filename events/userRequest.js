/**
 * Created by Joshua Crowe on 30/06/2017.
 */

const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

async function userRequest (requestUser) {
  "use strict";

  const readUser = await currentDatabase.readUser(requestUser, "Name");

  if (readUser) {
    return Translation.user(readUser);
  } else {
    await currentDatabase.writeUser(currentDatabase.signUser(requestUser));
  }

  return Translation.user(await currentDatabase.readUser(requestUser, "Id"));
}

module.exports = userRequest;