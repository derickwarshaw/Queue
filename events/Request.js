const currentApplication = require('../queue').currentApplication;
const currentDatabase = require('../queue').currentDatabase;

const Translation = currentApplication.component('Translation');

/**
 * Handle a request for a client.
 * @param {Object} requestObject userObject
 */
async function Request (requestObject) {
  "use strict";

    const requestedRoom = await currentDatabase.readRoom(requestObject.userLocation);
    const readUser = await currentDatabase.readUser(requestObject, "Id");

    if (requestedRoom && readUser) {
        await currentDatabase.writeClient(requestObject.userName, requestedRoom.RoomId);
    } else {
        throw Error(`${requestObject.userLocation} is not a registered room.`);
    }

    const translatedClient = await Translation.client(await currentDatabase.readClient(requestObject.userName));
    const translatedUser = await Translation.user(readUser);

    translatedUser.clientId = translatedClient.clientId;
    await currentDatabase.alterUser(translatedUser);

    return translatedUser;
}

module.exports = Request;