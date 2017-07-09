const currentDatabase = require('../queue').currentDatabase;

/**
 * Dispose of unused clients.
 * @param {Object} avoidData Data sent by the client.
 * @param {Object} avoidSocket Socket object.
 * @returns {Promise.<void>}
 */
async function Avoid (avoidData, avoidSocket) {
  "use strict";

  await currentDatabase.deleteClient("Handshake", {
    clientHandshake: avoidSocket.socketHandshake
  });
  const readClient = await currentDatabase.readClient("Handshake", {
    clientHandshake: avoidSocket.socketHandshake
  });

  if (readClient !== undefined) {
    throw Error("Failed to remove client.");
  }
}

module.exports = Avoid;