const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

/**
 * Handle a request for a client.
 * @param {Object} requestObject userObject
 */
async function Request (requestObject) {
  "use strict";

  // Step 1: Check if room & user exists.
    const requestedRoom = await currentDatabase.readRoom(requestObject.userLocation);
    const readUser = await currentDatabase.readUser(requestObject, "Id");

    if (requestedRoom && readUser) {

        // Step 2: Create a client.
        await currentDatabase.writeClient(requestObject.userName, requestedRoom.RoomId);

    } else {
        throw Error(`${requestObject.userLocation} is not a registered room.`);
    }

    // Step 3: Verify the client can be found.
    const readClient = await currentDatabase.readClient(requestObject.userName);

    // Step 4: Translate the client & the user.
    const translatedClient = await Translation.client(readClient);
    const translatedUser = await Translation.user(readUser);

    // Step 5: Alter the clientId of the user.
    translatedUser.clientId = translatedClient.clientId;
    await currentDatabase.alterUser(translatedUser);

    return translatedUser;
}

module.exports = Request;