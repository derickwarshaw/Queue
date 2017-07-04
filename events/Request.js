const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

/**
 * Handle a request for a client.
 * @param {Object} requestObject userObject
 */
async function Request (requestObject) {
  "use strict";

  // Step 1: Create a client. Db.writeClient.
  await currentDatabase.writeClient(requestObject.userName);

  // Step 2. Verify the client can be read. Db.readClient.
  const readClient = currentDatabase.readClient(requestObject.userName);

  // Step 3. Translate the client.
  // TODO: Write a client method in Translate.js
  const translatedClient = Translation.client(readClient);

  // Step 4. Alter the user with the Id of the client.
  requestObject.clientId = translatedClient.clientId;
  await currentDatabase.alterUser(requestObject);

  // Step 5. Translate the updated user object.
  const readUser = await currentDatabase.readUser(requestObject, "Id");
  const translatedUser = Translation.user(readUser);

  // Step 6. Return the translated user object.
  return translatedUser;
}

module.exports = Request;